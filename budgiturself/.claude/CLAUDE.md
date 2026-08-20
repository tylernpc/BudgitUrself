# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BudgitUrself is a manual-first personal budgeting app: the user enters and categorizes their own
money instead of a sync engine guessing. The financial model it implements is in
[../docs/budget-model.md](../docs/budget-model.md) — bank balance + income − expenses − credit card
obligations = what's actually free to spend. `docs/budget-model.md` is the source of truth for any
change to the budget math or dashboard layout; read it before touching `lib/budget/calculations.ts`
or the dashboard components.

This directory (`budgiturself/`) is the Next.js app and the npm project root — run all commands
below from here. The repo root above it holds only docs and CI config.

## Commands

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, DIRECT_URL, AUTH0_*, APP_BASE_URL
npm run db:deploy            # apply migrations
npm run dev
```

| Command                                              | Purpose                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`                                        | Dev server                                                                        |
| `npm run build`                                      | `prisma generate` + production build                                              |
| `npm run verify`                                     | Format check, lint, typecheck, test — what CI runs. Run before handing work back. |
| `npm run format` / `format:check`                    | Prettier                                                                          |
| `npm run lint` / `lint:fix`                          | ESLint                                                                            |
| `npm run typecheck`                                  | `tsc --noEmit`                                                                    |
| `npm test` / `test:watch`                            | Vitest                                                                            |
| `npx vitest run src/lib/budget/calculations.test.ts` | Run a single test file                                                            |
| `npx vitest run -t "test name"`                      | Run tests matching a name                                                         |
| `npm run db:migrate`                                 | Create + apply a migration in dev (writes to `prisma/migrations/`)                |
| `npm run db:deploy`                                  | Apply pending migrations (CI/production, no new migration)                        |
| `npm run db:studio`                                  | Prisma Studio                                                                     |

CI (`.github/workflows/ci.yml`) runs `prisma generate`, `format:check`, `lint`, `typecheck`, `test`
on every push/PR — the same set as `npm run verify`.

## Architecture

The app follows [Next.js App Router Architecture in 2026](https://www.pean.dev/blog/nextjs-app-router-architecture-in-2026):

> **Routes compose, domain modules do the work, and every boundary validates what enters it.**

- `src/app/` — routes only. Server Components fetch by calling domain functions directly (no
  internal HTTP). Route-only UI and logic are colocated under `app/<route>/components/` and
  `app/<route>/lib/`; a component only moves to the shared `components/ui/` once it's reused across
  routes.
- `src/lib/<domain>/` — where the actual logic lives, grouped by product domain (`budget/`, `auth/`),
  never by technical layer (no `services/`, `helpers/`, `utils/` grab-bags).
- **A Server Component never fetches this app's own Route Handlers.** `src/app/api/` exists only for
  real external HTTP contracts: the Stripe webhook, health probes.
- Every trust boundary validates: Zod schemas (`lib/budget/schemas.ts`) parse both the client-side
  dialog input and, again, the Server Action input server-side (defense in depth — never trust that
  client validation ran). `lib/env.ts` validates all environment variables once at startup so a
  missing var fails immediately with a named error, not at first query.
- Auth is Auth0 (`@auth0/nextjs-auth0`). `proxy.ts` (Next.js middleware) refreshes the session
  cookie; the `(app)` layout redirects anonymous users — but that redirect is the _first_ gate, not
  the only one. `lib/auth/dal.ts` re-establishes ownership on every read: `getSessionUser`/
  `requireSessionUser` read the Auth0 session, `getCurrentUser`/`requireCurrentUser` upsert/select
  the app's own `User` row by `auth0Sub`, both cached per-request via React `cache()`. Never treat
  the layout redirect alone as a security boundary — call `requireCurrentUser()` wherever ownership
  actually matters.
- The budget domain (`src/lib/budget/`) follows a small Clean Architecture split:
  - `types.ts` — domain types (no Prisma types leak past this layer)
  - `schemas.ts` — Zod schemas per mutation, including the `billSchema` discriminated union over
    `BillType` (`DIGITAL` needs `card`, `PERSONAL` needs `owedTo`)
  - `calculations.ts` — the pure budget math from `docs/budget-model.md`
  - `repository.ts` — `BudgetRepository` interface (the port), domain-typed in and out
  - `mappers.ts` — explicit row↔domain conversion, including date handling (dates are stored/read as
    UTC-midnight to avoid timezone drift) and the reverse mapping for `Bill.type`
  - `prisma-budget-repository.ts` — the Prisma-backed implementation; exports a `budgetRepository`
    singleton. Mutations scope every query by `{ id, userId }` via `updateMany`/`deleteMany` so one
    user can never touch another's rows.
  - Server Actions in `app/<route>/lib/actions.ts` are the only callers: parse input with the schema,
    `requireCurrentUser()`, call the repository, `revalidatePath`. New budget mutations should follow
    this same five-step shape rather than querying Prisma directly from a route.
- Supabase RLS is enabled on every app table with no policies defined — intentional, since the app
  only ever talks to Postgres through Prisma's direct connection, never through PostgREST. Don't add
  RLS policies expecting them to be enforced; they'd be redundant with the ownership checks already
  done in the repository layer.
- Prisma migrations: the history was squashed once (see `prisma/migrations/20260819000000_baseline/`)
  after a missing foundational migration corrupted `migrate dev`'s shadow-database replay. Don't hand
  -edit or delete migration files or `_prisma_migrations` rows without understanding this — prefer
  `prisma migrate dev` for schema changes and `prisma migrate deploy` for applying them in CI/prod.

### Where new code goes

| Adding…                                    | Goes in                                      |
| ------------------------------------------ | -------------------------------------------- |
| UI used by exactly one route               | `app/<route>/components/`                    |
| A hook/helper used by exactly one route    | `app/<route>/lib/`                           |
| A primitive reused across routes           | `components/ui/`                             |
| Business rules, calculations, validation   | `lib/<domain>/`                              |
| A mutation triggered by this app's own UI  | a Server Action in that route's `actions.ts` |
| An endpoint for something outside this app | `app/api/…/route.ts`                         |
