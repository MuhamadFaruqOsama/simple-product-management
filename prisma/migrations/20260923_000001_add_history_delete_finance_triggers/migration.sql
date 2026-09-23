CREATE OR REPLACE FUNCTION public.handle_list_sell_product_after_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id INTEGER;
    v_date DATE := DATE_TRUNC('day', OLD."created_at")::DATE;
    v_amount NUMERIC(18,2) := ROUND((OLD."quantity"::NUMERIC * OLD."selling_price"), 2);
BEGIN
    SELECT sp."user_id"
    INTO v_user_id
    FROM "sell_product" sp
    WHERE sp."id" = OLD."sell_product_id";

    IF v_user_id IS NULL THEN
        RETURN OLD;
    END IF;

    UPDATE "product_finances"
    SET "total_income" = COALESCE("total_income", 0) - v_amount,
        "last_updated_at" = NOW()
    WHERE "product_id" = OLD."product_id";

    UPDATE "overall_finances"
    SET "total_income" = COALESCE("total_income", 0) - v_amount,
        "last_updated_at" = NOW()
    WHERE "user_id" = v_user_id
      AND "date" = v_date;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS "trg_list_sell_product_after_delete" ON "list_sell_product";
CREATE TRIGGER "trg_list_sell_product_after_delete"
AFTER DELETE ON "list_sell_product"
FOR EACH ROW
EXECUTE FUNCTION public.handle_list_sell_product_after_delete();

CREATE OR REPLACE FUNCTION public.handle_restock_product_after_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id INTEGER;
    v_date DATE := DATE_TRUNC('day', OLD."created_at")::DATE;
    v_amount NUMERIC(18,2) := ROUND((OLD."restock_quantity"::NUMERIC * OLD."purchase_price"), 2);
BEGIN
    SELECT p."user_id"
    INTO v_user_id
    FROM "product" p
    WHERE p."id" = OLD."product_id";

    IF v_user_id IS NULL THEN
        RETURN OLD;
    END IF;

    UPDATE "product_finances"
    SET "total_spending" = COALESCE("total_spending", 0) - v_amount,
        "last_updated_at" = NOW()
    WHERE "product_id" = OLD."product_id";

    UPDATE "overall_finances"
    SET "total_spending" = COALESCE("total_spending", 0) - v_amount,
        "last_updated_at" = NOW()
    WHERE "user_id" = v_user_id
      AND "date" = v_date;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS "trg_restock_product_after_delete" ON "restock_product";
CREATE TRIGGER "trg_restock_product_after_delete"
AFTER DELETE ON "restock_product"
FOR EACH ROW
EXECUTE FUNCTION public.handle_restock_product_after_delete();
