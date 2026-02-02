-- Create marketing_templates table first if it doesn't exist
CREATE TABLE IF NOT EXISTS public.marketing_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('email','notification','sms')),
  category text NOT NULL CHECK (category IN ('onboarding','payments','referrals','marketing','soft_launch')),
  language text NOT NULL CHECK (language IN ('id','en')),
  subject text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  featured boolean NOT NULL DEFAULT false,
  variables text[] NOT NULL DEFAULT '{}',
  copied_count int NOT NULL DEFAULT 0,
  last_copied_at timestamptz,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "marketing_templates_select" ON public.marketing_templates;
DROP POLICY IF EXISTS "marketing_templates_insert" ON public.marketing_templates;
DROP POLICY IF EXISTS "marketing_templates_update" ON public.marketing_templates;
DROP POLICY IF EXISTS "marketing_templates_delete" ON public.marketing_templates;

-- Admin UUID whitelist policies
CREATE POLICY "marketing_templates_select" ON public.marketing_templates
FOR SELECT USING (
  auth.uid() IN (
    'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1'::uuid,
    '518694f6-bb50-4724-b4a5-77ad30152e0e'::uuid
  )
);

CREATE POLICY "marketing_templates_insert" ON public.marketing_templates
FOR INSERT WITH CHECK (
  auth.uid() IN (
    'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1'::uuid,
    '518694f6-bb50-4724-b4a5-77ad30152e0e'::uuid
  )
);

CREATE POLICY "marketing_templates_update" ON public.marketing_templates
FOR UPDATE USING (
  auth.uid() IN (
    'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1'::uuid,
    '518694f6-bb50-4724-b4a5-77ad30152e0e'::uuid
  )
);

CREATE POLICY "marketing_templates_delete" ON public.marketing_templates
FOR DELETE USING (
  auth.uid() IN (
    'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1'::uuid,
    '518694f6-bb50-4724-b4a5-77ad30152e0e'::uuid
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_marketing_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_marketing_templates_updated_at ON public.marketing_templates;

CREATE TRIGGER update_marketing_templates_updated_at
BEFORE UPDATE ON public.marketing_templates
FOR EACH ROW EXECUTE FUNCTION public.update_marketing_templates_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketing_templates_type ON public.marketing_templates(type);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_category ON public.marketing_templates(category);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_language ON public.marketing_templates(language);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_status ON public.marketing_templates(status);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_featured ON public.marketing_templates(featured);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_created_at ON public.marketing_templates(created_at DESC);

-- Add soft_launch template
INSERT INTO public.marketing_templates (title, type, category, language, subject, content, variables, featured) VALUES
('Pinned Message Soft Launch (ID)', 'notification', 'soft_launch', 'id', NULL, '🚀 TPC Global - Soft Launch Phase\n\n📚 Edukasi Blockchain & Ekosistem Digital\n\n⚠️ Penting:\n• Platform untuk pembelajaran dan edukasi\n• Tidak ada jaminan profit\n• Trading memiliki risiko kerugian\n\n🔐 Keamanan:\n• Official domain: tpcglobal.io\n• Selalu verifikasi link resmi\n• Waspadai penipuan\n\n📞 Bantuan:\n• Hubungi admin resmi untuk informasi\n• Join grup edukasi resmi\n\n#TPCGlobal #Edukasi #Blockchain', ARRAY[], true);
