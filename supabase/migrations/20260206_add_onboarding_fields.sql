-- Migration: 20260206_add_onboarding_fields.sql
-- Description: Add required onboarding fields to profiles table
-- Author: TPC Global Team

-- Add required onboarding fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nama_lengkap TEXT,
ADD COLUMN IF NOT EXISTS no_wa TEXT,
ADD COLUMN IF NOT EXISTS kota TEXT,
ADD COLUMN IF NOT EXISTS tpc_wallet_address TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_sponsor_code ON public.profiles(sponsor_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.nama_lengkap IS 'Nama lengkap user untuk onboarding';
COMMENT ON COLUMN public.profiles.no_wa IS 'Nomor WhatsApp user';
COMMENT ON COLUMN public.profiles.kota IS 'Kota domisili user';
COMMENT ON COLUMN public.profiles.tpc_wallet_address IS 'Alamat wallet TPC Solana user';
COMMENT ON COLUMN public.profiles.is_active IS 'Status aktif user untuk sponsor validation';

-- Update RLS policies to allow users to update their own onboarding fields
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure TPC-GLOBAL sponsor exists
INSERT INTO public.profiles (user_id, member_code, sponsor_code, referred_by, is_active, email_initial, email_current, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'TPC-GLOBAL',
  'TPC-GLOBAL',
  NULL,
  true,
  'tpc@global.com',
  'tpc@global.com',
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO NOTHING;
