# BudgitUrself — Next.js app

The application itself. For what the product is and how it is structured, see the
[repository README](../README.md).

## Prerequisites

- Node.js 20.9 or newer
- A PostgreSQL database (the project uses Supabase)
- An Auth0 tenant with a Regular Web Application

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:deploy            # apply migrations
npm run dev
```

The app runs at http://localhost:3000.

Auth0 needs `http://localhost:3000/auth/callback` as an allowed callback URL and
`http://localhost:3000` as an allowed logout URL.

## Scripts

| Script                            | What it does                                           |
| --------------------------------- | ------------------------------------------------------ |
| `npm run dev`                     | Start the dev server                                   |
| `npm run build`                   | Generate the Prisma client and build for production    |
| `npm start`                       | Serve the production build                             |
| `npm run lint` / `lint:fix`       | ESLint                                                 |
| `npm run format` / `format:check` | Prettier                                               |
| `npm run typecheck`               | `tsc --noEmit`                                         |
| `npm test` / `test:watch`         | Vitest                                                 |
| `npm run verify`                  | Format check, lint, typecheck and tests — what CI runs |
| `npm run db:migrate`              | Create and apply a migration in development            |
| `npm run db:deploy`               | Apply pending migrations (CI/production)               |
| `npm run db:studio`               | Open Prisma Studio                                     |

## Environment

Every variable in [`.env.example`](.env.example) is required. They are validated
once at startup by [`src/lib/env.ts`](src/lib/env.ts), so a missing or malformed
value fails immediately with a named error rather than at the first query.

## Layout

```
src/
  app/            routes, colocated components/ and lib/ per route
  components/ui/  shared design-system primitives
  lib/            domain modules — auth, budget, db, env, format
```

See the [architecture section of the repository README](../README.md#architecture)
for the rules these folders follow.
