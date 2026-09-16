-- RECURRING bills carry none of the branch columns — just the shared
-- name/amount/chargeDate. Extends `Bill_type_fields_check` to admit that
-- third branch alongside DIGITAL and PERSONAL.

ALTER TABLE "Bill" DROP CONSTRAINT "Bill_type_fields_check";

ALTER TABLE "Bill" ADD CONSTRAINT "Bill_type_fields_check" CHECK (
  ("type" = 'DIGITAL' AND "cardId" IS NOT NULL AND "category" IS NOT NULL AND "owedTo" IS NULL) OR
  ("type" = 'PERSONAL' AND "owedTo" IS NOT NULL AND "cardId" IS NULL AND "category" IS NULL) OR
  ("type" = 'RECURRING' AND "cardId" IS NULL AND "category" IS NULL AND "owedTo" IS NULL)
);
