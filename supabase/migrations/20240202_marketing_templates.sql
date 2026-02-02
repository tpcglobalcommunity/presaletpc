-- =========================
-- 1) CREATE TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.marketing_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('email','notification','sms')),
  category text NOT NULL CHECK (category IN ('onboarding','payments','referrals','marketing')),
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

-- =========================
-- 2) ENABLE RLS
-- =========================
ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;

-- =========================
-- 3) DROP & RECREATE POLICIES (UUID WHITELIST)
-- =========================
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

-- =========================
-- 4) UPDATED_AT TRIGGER
-- =========================
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

-- =========================
-- 5) INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_marketing_templates_type ON public.marketing_templates(type);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_category ON public.marketing_templates(category);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_language ON public.marketing_templates(language);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_status ON public.marketing_templates(status);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_featured ON public.marketing_templates(featured);
CREATE INDEX IF NOT EXISTS idx_marketing_templates_created_at ON public.marketing_templates(created_at DESC);

-- =========================
-- 6) SEED INDONESIAN TEMPLATES
-- =========================
INSERT INTO public.marketing_templates (title, type, category, language, subject, content, variables, featured) VALUES
-- Onboarding Templates
('Selamat Datang di TPC Global', 'email', 'onboarding', 'id', 'Selamat Datang di TPC Global! 🎉', 'Halo {{name}},\n\nSelamat datang di ekosistem TPC Global! Akun Anda telah berhasil dibuat.\n\nKode Member: {{member_code}}\n\nMulai perjalanan Anda bersama kami dan rasakan manfaatnya.\n\nSalam hangat,\nTim TPC Global', ARRAY['name', 'member_code'], true),
('Verifikasi Email Berhasil', 'notification', 'onboarding', 'id', NULL, 'Email Anda berhasil diverifikasi. Selamat bergabung dengan TPC Global!', ARRAY['name'], false),

-- Payment Templates
('Konfirmasi Pembayaran Berhasil', 'email', 'payments', 'id', 'Pembayaran Anda Telah Dikonfirmasi ✅', 'Halo {{name}},\n\nPembayaran sebesar {{amount}} untuk invoice {{invoice_id}} telah berhasil dikonfirmasi.\n\nTerima kasih atas kepercayaan Anda.\n\nTim TPC Global', ARRAY['name', 'amount', 'invoice_id'], true),
('Pembayaran Pending', 'notification', 'payments', 'id', NULL, 'Pembayaran untuk invoice {{invoice_id}} sedang dalam proses verifikasi.', ARRAY['invoice_id'], false),

-- Referral Templates
('Bonus Referral Anda!', 'email', 'referrals', 'id', 'Selamat! Anda Mendapat Bonus Referral! 🎁', 'Selamat {{name}}!\n\nAnda telah mendapat bonus referral sebesar {{bonus_amount}} dari mengundang {{referral_name}}.\n\nTerus ajak teman-teman Anda dan dapatkan lebih banyak bonus!\n\nSalam,\nTPC Global', ARRAY['name', 'bonus_amount', 'referral_name'], true),
('Referral Berhasil Ditambahkan', 'notification', 'referrals', 'id', NULL, '{{referral_name}} telah berhasil bergabung menggunakan kode referral Anda!', ARRAY['referral_name'], false),

-- Marketing Templates
('Promosi Spesial Bulan Ini', 'email', 'marketing', 'id', 'Promosi Spesial TPC Global - Jangan Lewatkan! 🚀', 'Halo {{name}},\n\nDapatkan penawaran spesial bulan ini dari TPC Global!\n\nPromo berlaku hingga {{end_date}}.\n\nSegera manfaatkan kesempatan ini.\n\nBest regards,\nTPC Team', ARRAY['name', 'end_date'], true),
('Update Sistem TPC', 'notification', 'marketing', 'id', NULL, 'Sistem TPC Global telah diperbarui dengan fitur-fitur baru. Coba sekarang!', ARRAY['name'], false),

-- SMS Templates
('Kode Verifikasi', 'sms', 'onboarding', 'id', NULL, 'Kode verifikasi TPC Anda: {{verification_code}}. Berlaku 5 menit.', ARRAY['verification_code'], false),
('Info Pembayaran', 'sms', 'payments', 'id', NULL, 'Pembayaran {{amount}} untuk invoice {{invoice_id}} berhasil. Terima kasih!', ARRAY['amount', 'invoice_id'], false);

-- =========================
-- 7) SEED ENGLISH TEMPLATES (OPTIONAL)
-- =========================
INSERT INTO public.marketing_templates (title, type, category, language, subject, content, variables, featured) VALUES
('Welcome to TPC Global', 'email', 'onboarding', 'en', 'Welcome to TPC Global! 🎉', 'Hello {{name}},\n\nWelcome to the TPC Global ecosystem! Your account has been successfully created.\n\nMember Code: {{member_code}}\n\nStart your journey with us and enjoy the benefits.\n\nBest regards,\nTPC Global Team', ARRAY['name', 'member_code'], true),
('Payment Confirmation', 'email', 'payments', 'en', 'Payment Confirmed ✅', 'Hello {{name}},\n\nYour payment of {{amount}} for invoice {{invoice_id}} has been confirmed.\n\nThank you for your trust.\n\nTPC Global Team', ARRAY['name', 'amount', 'invoice_id'], true),
('Referral Bonus Earned!', 'email', 'referrals', 'en', 'You Earned a Referral Bonus! 🎁', 'Congratulations {{name}}!\n\nYou have earned a referral bonus of {{bonus_amount}} for referring {{referral_name}}.\n\nKeep inviting friends and earn more bonuses!\n\nBest regards,\nTPC Team', ARRAY['name', 'bonus_amount', 'referral_name'], true),
('Special Promotion', 'email', 'marketing', 'en', 'Special TPC Promotion - Don''t Miss Out! 🚀', 'Hello {{name}},\n\nGet special offers this month from TPC Global!\n\nPromo valid until {{end_date}}.\n\nTake advantage of this opportunity now.\n\nBest regards,\nTPC Team', ARRAY['name', 'end_date'], true);
