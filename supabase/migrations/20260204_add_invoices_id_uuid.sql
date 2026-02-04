-- ADD UUID PRIMARY KEY COLUMN: public.invoices.id
-- Production-safe: add column, backfill, set NOT NULL, set PK
-- NOTE: if invoices already has a primary key (e.g., invoice_no), we switch to id.

BEGIN;

-- 1) Add id column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name='invoices' AND column_name='id'
  ) THEN
    ALTER TABLE public.invoices ADD COLUMN id uuid;
  END IF;
END $$;

-- 2) Backfill id for existing rows
UPDATE public.invoices
SET id = gen_random_uuid()
WHERE id IS NULL;

-- 3) Enforce NOT NULL
ALTER TABLE public.invoices
  ALTER COLUMN id SET NOT NULL;

-- 4) Ensure invoice_no unique (needed for legacy translator)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND tablename='invoices' AND indexname='invoices_invoice_no_unique'
  ) THEN
    CREATE UNIQUE INDEX invoices_invoice_no_unique ON public.invoices (invoice_no);
  END IF;
END $$;

-- 5) Switch primary key to id (drop old PK if exists)
DO $$
DECLARE
  pk_name text;
BEGIN
  SELECT conname INTO pk_name
  FROM pg_constraint
  WHERE conrelid = 'public.invoices'::regclass
    AND contype = 'p'
  LIMIT 1;

  IF pk_name IS NOT NULL AND pk_name <> 'invoices_pkey' THEN
    EXECUTE format('ALTER TABLE public.invoices DROP CONSTRAINT %I', pk_name);
  ELSIF pk_name = 'invoices_pkey' THEN
    -- do nothing; we'll replace if it is not on id
    NULL;
  END IF;
END $$;

-- Ensure primary key exists on id
DO $$
BEGIN
  -- if invoices_pkey exists, drop it first to avoid conflict
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid='public.invoices'::regclass
      AND contype='p'
      AND conname='invoices_pkey'
  ) THEN
    ALTER TABLE public.invoices DROP CONSTRAINT invoices_pkey;
  END IF;

  ALTER TABLE public.invoices ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);
END $$;

COMMIT;
