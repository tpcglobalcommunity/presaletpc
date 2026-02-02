-- Add soft_launch category to marketing_templates constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'marketing_templates_category_check'
      AND conrelid = 'public.marketing_templates'::regclass
  ) THEN
    ALTER TABLE public.marketing_templates DROP CONSTRAINT marketing_templates_category_check;
  END IF;

  ALTER TABLE public.marketing_templates
    ADD CONSTRAINT marketing_templates_category_check 
    CHECK (category IN ('onboarding','payments','referrals','marketing','soft_launch'));
END $$;

-- Add soft_launch template
INSERT INTO public.marketing_templates (title, type, category, language, subject, content, variables, featured) VALUES
('Pinned Message Soft Launch (ID)', 'notification', 'soft_launch', 'id', NULL, '🚀 TPC Global - Soft Launch Phase\n\n📚 Edukasi Blockchain & Ekosistem Digital\n\n⚠️ Penting:\n• Platform untuk pembelajaran dan edukasi\n• Tidak ada jaminan profit\n• Trading memiliki risiko kerugian\n\n🔐 Keamanan:\n• Official domain: tpcglobal.io\n• Selalu verifikasi link resmi\n• Waspadai penipuan\n\n📞 Bantuan:\n• Hubungi admin resmi untuk informasi\n• Join grup edukasi resmi\n\n#TPCGlobal #Edukasi #Blockchain', ARRAY[], true);
