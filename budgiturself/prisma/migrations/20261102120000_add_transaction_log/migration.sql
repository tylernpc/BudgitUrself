-- An append-only journal of recorded money movements. Written in the same
-- database transaction as the balance change it describes, but never read by
-- the budget math — see the `Transaction` model comment in schema.prisma.
--
-- RLS is enabled with no policies, matching every other app table: the app
-- reaches Postgres only through Prisma's direct connection, never PostREST.

-- CreateEnum
CREATE TYPE "TransactionKind" AS ENUM ('CARD_CHARGE', 'EXPENSE_SPEND', 'BANK_ADJUST', 'INCOME_ADJUST', 'BILL_ADDED', 'BILL_REMOVED');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "TransactionKind" NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- Composite, in the order the list query uses it: filter by owner, sort newest first.
CREATE INDEX "Transaction_userId_occurredAt_idx" ON "Transaction"("userId", "occurredAt");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS (no policies — consistent with the other app tables)
ALTER TABLE "public"."Transaction" ENABLE ROW LEVEL SECURITY;
