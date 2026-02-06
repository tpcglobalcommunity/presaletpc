-- Migration: 20260206_profiles_onboarding_gate.sql
-- Description: Add onboarding required fields to profiles table
-- Author: TPC Global Team

-- Add required columns for onboarding process
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Create index for wallet_address for performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON public.profiles(wallet_address);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.phone IS 'User phone number for onboarding';
COMMENT ON COLUMN public.profiles.city IS 'User city for onboarding';
COMMENT ON COLUMN public.profiles.wallet_address IS 'User Solana wallet address for token distribution';
