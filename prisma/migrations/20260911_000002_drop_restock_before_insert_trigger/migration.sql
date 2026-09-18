DROP TRIGGER IF EXISTS "trg_restock_product_before_insert" ON "restock_product";
DROP FUNCTION IF EXISTS public.handle_restock_product_before_insert();
