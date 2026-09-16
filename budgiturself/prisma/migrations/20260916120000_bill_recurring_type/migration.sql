-- Adds the RECURRING bill type (rent, insurance, and other fixed-amount
-- charges with no card or person attached). Split into its own migration
-- because Postgres cannot use a new enum value in the same transaction that
-- adds it — the follow-up migration updates the CHECK constraint.

ALTER TYPE "BillType" ADD VALUE 'RECURRING';
