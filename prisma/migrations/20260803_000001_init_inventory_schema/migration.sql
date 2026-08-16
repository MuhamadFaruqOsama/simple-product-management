-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overall_finances" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_income" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "total_spending" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "date" DATE NOT NULL,
    "last_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "overall_finances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdraw_balance_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total" NUMERIC(18,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdraw_balance_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_finances" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "total_income" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "total_spending" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "date" DATE NOT NULL,
    "last_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_finances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "total_remaining_stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "volume" TEXT NOT NULL,
    "selling_price" NUMERIC(18,2) NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "product_uuid_key" UNIQUE ("uuid")
);

-- CreateTable
CREATE TABLE "restock_product" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "restock_quantity" DOUBLE PRECISION NOT NULL,
    "remaining_stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchase_price" NUMERIC(18,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "restock_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sell_product" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sell_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_sell_product" (
    "id" SERIAL NOT NULL,
    "sell_product_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "selling_price" NUMERIC(18,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_sell_product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "overall_finances" ADD CONSTRAINT "overall_finances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_balance_history" ADD CONSTRAINT "withdraw_balance_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_finances" ADD CONSTRAINT "product_finances_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restock_product" ADD CONSTRAINT "restock_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sell_product" ADD CONSTRAINT "sell_product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_sell_product" ADD CONSTRAINT "list_sell_product_sell_product_id_fkey" FOREIGN KEY ("sell_product_id") REFERENCES "sell_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_sell_product" ADD CONSTRAINT "list_sell_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique constraints for aggregate tables
ALTER TABLE "overall_finances"
    ADD CONSTRAINT "overall_finances_user_id_date_key" UNIQUE ("user_id", "date");

ALTER TABLE "product_finances"
    ADD CONSTRAINT "product_finances_product_id_date_key" UNIQUE ("product_id", "date");

-- Functions
CREATE OR REPLACE FUNCTION public.handle_restock_product_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock DOUBLE PRECISION;
BEGIN
    SELECT COALESCE(p."total_remaining_stock", 0)
    INTO v_current_stock
    FROM "product" p
    WHERE p."id" = NEW."product_id"
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'product_id % does not exist', NEW."product_id";
    END IF;

    NEW."remaining_stock" := v_current_stock + NEW."restock_quantity";
    RETURN NEW;
END;
$$;

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
    SET "total_remaining_stock" = NEW."remaining_stock",
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

CREATE OR REPLACE FUNCTION public.handle_withdraw_balance_history_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_date DATE := DATE_TRUNC('day', NEW."created_at")::DATE;
BEGIN
    INSERT INTO "overall_finances" (
        "user_id",
        "total_income",
        "total_spending",
        "date",
        "last_updated_at"
    )
    VALUES (
        NEW."user_id",
        0,
        NEW."total",
        v_date,
        NOW()
    )
    ON CONFLICT ("user_id", "date")
    DO UPDATE SET
        "total_income" = "overall_finances"."total_income",
        "total_spending" = COALESCE("overall_finances"."total_spending", 0) + EXCLUDED."total_spending",
        "last_updated_at" = NOW();

    RETURN NEW;
END;
$$;

-- Triggers
DROP TRIGGER IF EXISTS "trg_restock_product_before_insert" ON "restock_product";
CREATE TRIGGER "trg_restock_product_before_insert"
BEFORE INSERT ON "restock_product"
FOR EACH ROW
EXECUTE FUNCTION public.handle_restock_product_before_insert();

DROP TRIGGER IF EXISTS "trg_restock_product_after_insert" ON "restock_product";
CREATE TRIGGER "trg_restock_product_after_insert"
AFTER INSERT ON "restock_product"
FOR EACH ROW
EXECUTE FUNCTION public.handle_restock_product_after_insert();

DROP TRIGGER IF EXISTS "trg_list_sell_product_after_insert" ON "list_sell_product";
CREATE TRIGGER "trg_list_sell_product_after_insert"
AFTER INSERT ON "list_sell_product"
FOR EACH ROW
EXECUTE FUNCTION public.handle_list_sell_product_after_insert();

DROP TRIGGER IF EXISTS "trg_withdraw_balance_history_after_insert" ON "withdraw_balance_history";
CREATE TRIGGER "trg_withdraw_balance_history_after_insert"
AFTER INSERT ON "withdraw_balance_history"
FOR EACH ROW
EXECUTE FUNCTION public.handle_withdraw_balance_history_after_insert();

-- Indexes
CREATE INDEX "idx_overall_finances_user_id" ON "overall_finances" ("user_id");
CREATE INDEX "idx_overall_finances_date" ON "overall_finances" ("date");
CREATE INDEX "idx_product_finances_product_id" ON "product_finances" ("product_id");
CREATE INDEX "idx_product_finances_date" ON "product_finances" ("date");
CREATE INDEX "idx_withdraw_balance_history_user_id" ON "withdraw_balance_history" ("user_id");
CREATE INDEX "idx_withdraw_balance_history_created_at" ON "withdraw_balance_history" ("created_at");
CREATE INDEX "idx_product_user_id" ON "product" ("user_id");
CREATE INDEX "idx_product_deleted_at" ON "product" ("deleted_at");
CREATE INDEX "idx_restock_product_product_id" ON "restock_product" ("product_id");
CREATE INDEX "idx_restock_product_created_at" ON "restock_product" ("created_at");
CREATE INDEX "idx_sell_product_user_id" ON "sell_product" ("user_id");
CREATE INDEX "idx_sell_product_created_at" ON "sell_product" ("created_at");
CREATE INDEX "idx_list_sell_product_sell_product_id" ON "list_sell_product" ("sell_product_id");
CREATE INDEX "idx_list_sell_product_product_id" ON "list_sell_product" ("product_id");
CREATE INDEX "idx_list_sell_product_created_at" ON "list_sell_product" ("created_at");
