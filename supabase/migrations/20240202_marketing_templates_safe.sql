-- =====================================================
-- TPC Global Marketing Templates - Safe Migration
-- =====================================================
-- This script is IDEMPOTENT and SAFE for production use
-- Handles table creation, constraints, triggers, and seeding

-- =====================================================
-- PHASE 1 — ENSURE TABLE EXISTS
-- =====================================================

-- Create extension if missing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create table IF NOT EXISTS with safe defaults
CREATE TABLE IF NOT EXISTS public.marketing_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('email','notification','sms')),
  category text NOT NULL,
  language text NOT NULL CHECK (language IN ('id','en')),
  subject text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  featured boolean NOT NULL DEFAULT false,
  variables text[] NOT NULL DEFAULT '{}'::text[],
  copied_count int NOT NULL DEFAULT 0,
  last_copied_at timestamptz,
  created_by uuid DEFAULT auth.uid(),  -- Nullable by default, safe for SQL editor
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- PHASE 2 — CATEGORY CONSTRAINT (SAFE)
-- =====================================================

-- Drop existing constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'marketing_templates_category_check'
      AND conrelid = to_regclass('public.marketing_templates', 'pg_class')
  ) THEN
    ALTER TABLE public.marketing_templates 
    DROP CONSTRAINT marketing_templates_category_check;
  END IF;
END $$;

-- Add category constraint with soft_launch
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_class 
    WHERE relname = 'marketing_templates' 
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER TABLE public.marketing_templates
    ADD CONSTRAINT marketing_templates_category_check 
    CHECK (category IN ('onboarding','payments','referrals','marketing','soft_launch'));
  END IF;
END $$;

-- =====================================================
-- PHASE 3 — UPDATED_AT TRIGGER
-- =====================================================

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_marketing_templates_updated_at ON public.marketing_templates;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_class 
    WHERE relname = 'marketing_templates' 
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    CREATE TRIGGER update_marketing_templates_updated_at
    BEFORE UPDATE ON public.marketing_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- =====================================================
-- PHASE 4 — SEED PINNED TEMPLATE (IDEMPOTENT)
-- =====================================================

-- Insert soft launch template only if not exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_class 
    WHERE relname = 'marketing_templates' 
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    INSERT INTO public.marketing_templates (
      title, 
      type, 
      category, 
      language, 
      subject, 
      content, 
      variables, 
      featured, 
      status,
      created_by
    )
    SELECT 
      'Pinned Message Soft Launch (ID)',
      'notification',
      'soft_launch',
      'id',
      NULL,
      '🚀 TPC Global - Soft Launch Phase

📚 Edukasi Blockchain & Ekosistem Digital

⚠️ Penting:
• Platform untuk pembelajaran dan edukasi
• Tidak ada jaminan profit
• Trading memiliki risiko kerugian

🔐 Keamanan:
• Official domain: https://tpcglobal.io
• Selalu verifikasi link resmi
• Waspadai penipuan

📞 Bantuan:
• Hubungi admin resmi untuk informasi
• Join grup edukasi resmi

#TPCGlobal #Edukasi #Blockchain',
      ARRAY[]::text[],
      true,
      'active',
      auth.uid()
    WHERE NOT EXISTS (
      SELECT 1 FROM public.marketing_templates 
      WHERE title = 'Pinned Message Soft Launch (ID)' 
        AND language = 'id'
    );
  END IF;
END $$;

-- =====================================================
-- PHASE 5 — OPTIONAL HARDENING
-- =====================================================

-- Create unique index on (title, language) to prevent duplicates
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_class 
    WHERE relname = 'marketing_templates' 
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_marketing_templates_title_language 
    ON public.marketing_templates(title, language);
  END IF;
END $$;

-- Create performance indexes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_class 
    WHERE relname = 'marketing_templates' 
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_marketing_templates_category 
    ON public.marketing_templates(category);
    
    CREATE INDEX IF NOT EXISTS idx_marketing_templates_type 
    ON public.marketing_templates(type);
    
    CREATE INDEX IF NOT EXISTS idx_marketing_templates_language 
    ON public.marketing_templates(language);
    
    CREATE INDEX IF NOT EXISTS idx_marketing_templates_featured 
    ON public.marketing_templates(featured);
    
    CREATE INDEX IF NOT EXISTS idx_marketing_templates_created_at 
    ON public.marketing_templates(created_at DESC);
    
    CREATE INDEX IF NOT EXISTS idx_marketing_templates_status 
    ON public.marketing_templates(status);
  END IF;
END $$;

-- =====================================================
-- SUMMARY
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Marketing Templates Migration Summary:';
  RAISE NOTICE '✅ Table created/verified: public.marketing_templates';
  RAISE NOTICE '✅ Category constraint updated with soft_launch';
  RAISE NOTICE '✅ Updated_at trigger created';
  RAISE NOTICE '✅ Soft launch template seeded (if not exists)';
  RAISE NOTICE '✅ Performance indexes created';
  RAISE NOTICE '✅ Migration is IDEMPOTENT and SAFE';
END $$;
