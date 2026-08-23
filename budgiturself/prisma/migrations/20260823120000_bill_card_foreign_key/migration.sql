-- Replace `Bill.card` (the credit card's *name*) with `Bill.cardId`, a real
-- foreign key. The name reference had no integrity: renaming a card required a
-- compensating UPDATE in application code, deleting one left its bills pointing
-- at a card that no longer existed, and two cards sharing a name were
-- indistinguishable.

ALTER TABLE "Bill" ADD COLUMN "cardId" TEXT;

-- Backfill by matching the old name within the owning user.
UPDATE "Bill" b
SET "cardId" = c."id"
FROM "CreditCard" c
WHERE c."userId" = b."userId"
  AND c."name" = b."card";

-- The old constraint names the column about to be dropped.
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_type_fields_check";
ALTER TABLE "Bill" DROP COLUMN "card";

-- Any DIGITAL bill whose name never resolved was already orphaned — it pointed
-- at a card that had been renamed away or deleted. There is no card to attach
-- it to, and the constraint below cannot admit it.
DELETE FROM "Bill" WHERE "type" = 'DIGITAL' AND "cardId" IS NULL;

ALTER TABLE "Bill" ADD CONSTRAINT "Bill_type_fields_check" CHECK (
  ("type" = 'DIGITAL' AND "cardId" IS NOT NULL AND "category" IS NOT NULL AND "owedTo" IS NULL) OR
  ("type" = 'PERSONAL' AND "owedTo" IS NOT NULL AND "cardId" IS NULL AND "category" IS NULL)
);

CREATE INDEX "Bill_cardId_idx" ON "Bill"("cardId");

ALTER TABLE "Bill" ADD CONSTRAINT "Bill_cardId_fkey"
  FOREIGN KEY ("cardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
