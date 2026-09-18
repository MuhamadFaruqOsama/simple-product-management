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
    ON CONFLICT ("product_id", "date")
    DO UPDATE SET
        "total_income" = COALESCE("product_finances"."total_income", 0),
        "total_spending" = COALESCE("product_finances"."total_spending", 0) + EXCLUDED."total_spending",
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

DROP TRIGGER IF EXISTS "trg_list_sell_product_after_insert" ON "list_sell_product";

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
    ON CONFLICT ("product_id", "date")
    DO UPDATE SET
        "total_income" = COALESCE("product_finances"."total_income", 0) + EXCLUDED."total_income",
        "total_spending" = "product_finances"."total_spending",
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

CREATE TRIGGER "trg_list_sell_product_after_insert"
AFTER INSERT ON "list_sell_product"
FOR EACH ROW
EXECUTE FUNCTION public.handle_list_sell_product_after_insert();
