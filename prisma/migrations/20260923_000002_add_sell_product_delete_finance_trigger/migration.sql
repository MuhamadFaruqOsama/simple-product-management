CREATE OR REPLACE FUNCTION public.handle_sell_product_before_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_date DATE;
    v_total_income NUMERIC(18,2);
BEGIN
    SELECT
        DATE_TRUNC('day', COALESCE(MIN(lsp."created_at"), OLD."created_at"))::DATE,
        COALESCE(SUM(ROUND((lsp."quantity"::NUMERIC * lsp."selling_price"), 2)), 0)
    INTO v_date, v_total_income
    FROM "list_sell_product" lsp
    WHERE lsp."sell_product_id" = OLD."id";

    IF v_total_income <= 0 THEN
        RETURN OLD;
    END IF;

    UPDATE "overall_finances"
    SET "total_income" = COALESCE("total_income", 0) - v_total_income,
        "last_updated_at" = NOW()
    WHERE "user_id" = OLD."user_id"
      AND "date" = v_date;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS "trg_sell_product_before_delete" ON "sell_product";
CREATE TRIGGER "trg_sell_product_before_delete"
BEFORE DELETE ON "sell_product"
FOR EACH ROW
EXECUTE FUNCTION public.handle_sell_product_before_delete();
