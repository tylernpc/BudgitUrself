-- Baseline migration: squashes the prior four migrations
-- (20260622010415_init_user, 20260817000000_enable_rls_prisma_migrations,
-- 20260817000100_enable_rls_user, 20260818000000_add_budget_domain) plus a
-- pre-existing "20260120050517_init" migration that created the User table
-- but was missing from this checkout, into one self-contained migration
-- matching the live database exactly. This is marked applied via
-- `prisma migrate resolve`, not run, since the database already has this
-- schema. Local migration history is now replayable from empty, which the
-- old history was not (the missing init migration broke `migrate dev`'s
-- shadow-database step).

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('DIGITAL', 'PERSONAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "auth0Sub" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "bankBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "monthlyIncome" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "limit" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OneOffExpense" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OneOffExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyExpense" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "chargeDate" INTEGER NOT NULL,
    "type" "BillType" NOT NULL,
    "card" TEXT,
    "category" TEXT,
    "owedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0Sub_key" ON "User"("auth0Sub");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CreditCard_userId_idx" ON "CreditCard"("userId");

-- CreateIndex
CREATE INDEX "OneOffExpense_userId_idx" ON "OneOffExpense"("userId");

-- CreateIndex
CREATE INDEX "MonthlyExpense_userId_idx" ON "MonthlyExpense"("userId");

-- CreateIndex
CREATE INDEX "Bill_userId_idx" ON "Bill"("userId");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OneOffExpense" ADD CONSTRAINT "OneOffExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyExpense" ADD CONSTRAINT "MonthlyExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CheckConstraint: mirrors billSchema's discriminated union at the database boundary.
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_type_fields_check" CHECK (
  ("type" = 'DIGITAL' AND "card" IS NOT NULL AND "category" IS NOT NULL AND "owedTo" IS NULL) OR
  ("type" = 'PERSONAL' AND "owedTo" IS NOT NULL AND "card" IS NULL AND "category" IS NULL)
);

-- RLS: locked down with no policies on every app table. Only Prisma's direct
-- Postgres connection reaches these, never PostgREST.
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."CreditCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."OneOffExpense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MonthlyExpense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Bill" ENABLE ROW LEVEL SECURITY;
