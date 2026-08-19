-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('DIGITAL', 'PERSONAL');

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "bankBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN "monthlyIncome" DECIMAL(12,2) NOT NULL DEFAULT 0;

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
CREATE INDEX "CreditCard_userId_idx" ON "CreditCard"("userId");
CREATE INDEX "OneOffExpense_userId_idx" ON "OneOffExpense"("userId");
CREATE INDEX "MonthlyExpense_userId_idx" ON "MonthlyExpense"("userId");
CREATE INDEX "Bill_userId_idx" ON "Bill"("userId");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OneOffExpense" ADD CONSTRAINT "OneOffExpense_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MonthlyExpense" ADD CONSTRAINT "MonthlyExpense_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CheckConstraint: mirrors the app-layer discriminated union (see billSchema
-- in src/lib/budget/schemas.ts) at the database boundary so a stray direct
-- write can't produce a bill with mismatched digital/personal fields.
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_type_fields_check" CHECK (
  ("type" = 'DIGITAL' AND "card" IS NOT NULL AND "category" IS NOT NULL AND "owedTo" IS NULL) OR
  ("type" = 'PERSONAL' AND "owedTo" IS NOT NULL AND "card" IS NULL AND "category" IS NULL)
);

-- RLS: same lockdown as the rest of this schema (see the two prior
-- migrations). These tables are only ever reached through Prisma's direct
-- Postgres connection, never PostgREST, so RLS is enabled with no policies
-- to block all REST/GraphQL access.
ALTER TABLE "public"."CreditCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."OneOffExpense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MonthlyExpense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Bill" ENABLE ROW LEVEL SECURITY;
