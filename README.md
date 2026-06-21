# BudgitUrself

BudgitUrself is a personal budgeting web app built around the idea that manual budgeting beats automated budgeting — you get a clearer, more honest picture of your money when you're the one entering and categorizing it.

## What it does

- **Paycheck tracking** — log your income and see it allocated across your budget.
- **Expense management** — track fixed expenses and see what's left to spend after they're covered.
- **Budget overview** — instantly see how much you're free to spend on extras once essentials are accounted for.
- **Categorization** — organize spending by card and by category to see exactly where your money goes.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS for styling, with Radix UI primitives
- [Prisma](https://www.prisma.io) ORM on PostgreSQL ([Supabase](https://supabase.com))
- [Auth0](https://auth0.com) for authentication
- Stripe (webhook scaffolded, not yet wired up) for billing
- Deployed on [Vercel](https://vercel.com)

## Status

Actively in development. The marketing site (landing page, features, about/terms/privacy) is built out; the core app (accounts, budgets, transactions, settings) is being implemented.

## Project structure

The Next.js app lives in [budgiturself/](budgiturself/) — see [budgiturself/README.md](budgiturself/README.md) for setup and local development instructions.
