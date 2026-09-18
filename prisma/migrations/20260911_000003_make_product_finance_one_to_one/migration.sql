DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "product_finances"
        GROUP BY "product_id"
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Cannot make product_finances one-to-one: duplicate product_id rows still exist. Consolidate product_finances data per product first.';
    END IF;
END;
$$;

ALTER TABLE "product_finances"
    DROP CONSTRAINT IF EXISTS "product_finances_product_id_date_key";

DROP INDEX IF EXISTS "idx_product_finances_product_id";

ALTER TABLE "product_finances"
    ADD CONSTRAINT "product_finances_product_id_key" UNIQUE ("product_id");

CREATE OR REPLACE FUNCTION public.handle_restock_product_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id INTEGER;
    v_date DATE := DATE_TRUNC('day', NEW."created_at")::DATE;
    v_amount NUMERIC(18,2) := ROUND((NEW."restock_quantity"::NUMERIC * NEW."purchase_price"), 2);
BEGIN
    SELECT p."user_id"
    INTO v_user_id
    FROM "product" p
    WHERE p."id" = NEW."product_id";

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'product_id % does not exist or has no user_id', NEW."product_id";
    END IF;

    UPDATE "product"
    SET "total_remaining_stock" = COALESCE("total_remaining_stock", 0) + NEW."restock_quantity",
        "updated_at" = NOW()
    WHERE "id" = NEW."product_id";

    INSERT INTO "product_finances" (
        "product_id",
        "total_income",
        "total_spending",
        "date",
        "last_updated_at"
    )
    VALUES (
        NEW."product_id",
        0,
        v_amount,
        v_date,
        NOW()
    )
    ON CONFLICT ("product_id")
    DO UPDATE SET
        "total_income" = COALESCE("product_finances"."total_income", 0),
        "total_spending" = COALESCE("product_finances"."total_spending", 0) + EXCLUDED."total_spending",
        "date" = EXCLUDED."date",
        "last_updated_at" = NOW();

    INSERT INTO "overall_finances" (
        "user_id",
        "total_income",
        "total_spending",
        "date",
        "last_updated_at"
    )
    VALUES (
        v_user_id,
        0,
        v_amount,
        v_date,
        NOW()
    )
    ON CONFLICT ("user_id", "date")
    DO UPDATE SET
        "total_income" = COALESCE("overall_finances"."total_income", 0),
        "total_spending" = COALESCE("overall_finances"."total_spending", 0) + EXCLUDED."total_spending",
        "last_updated_at" = NOW();

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_list_sell_product_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id INTEGER;
    v_date DATE := DATE_TRUNC('day', NEW."created_at")::DATE;
    v_amount NUMERIC(18,2) := ROUND((NEW."quantity"::NUMERIC * NEW."selling_price"), 2);
BEGIN
    SELECT sp."user_id"
    INTO v_user_id
    FROM "sell_product" sp
    WHERE sp."id" = NEW."sell_product_id";

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'sell_product_id % does not exist or has no user_id', NEW."sell_product_id";
    END IF;

    UPDATE "product"
    SET "total_remaining_stock" = COALESCE("total_remaining_stock", 0) - NEW."quantity",
        "updated_at" = NOW()
    WHERE "id" = NEW."product_id";

    INSERT INTO "product_finances" (
        "product_id",
        "total_income",
        "total_spending",
        "date",
        "last_updated_at"
    )
    VALUES (
        NEW."product_id",
        v_amount,
        0,
        v_date,
        NOW()
    )
    ON CONFLICT ("product_id")
    DO UPDATE SET
        "total_income" = COALESCE("product_finances"."total_income", 0) + EXCLUDED."total_income",
        "total_spending" = "product_finances"."total_spending",
        "date" = EXCLUDED."date",
        "last_updated_at" = NOW();

    INSERT INTO "overall_finances" (
        "user_id",
        "total_income",
        "total_spending",
        "date",
        "last_updated_at"
    )
    VALUES (
        v_user_id,
        v_amount,
        0,
        v_date,
        NOW()
    )
    ON CONFLICT ("user_id", "date")
    DO UPDATE SET
        "total_income" = COALESCE("overall_finances"."total_income", 0) + EXCLUDED."total_income",
        "total_spending" = "overall_finances"."total_spending",
        "last_updated_at" = NOW();

    RETURN NEW;
END;
$$;
