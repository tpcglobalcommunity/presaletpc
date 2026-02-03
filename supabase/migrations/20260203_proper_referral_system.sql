-- Migration: 20260203_proper_referral_system.sql
-- Implement proper multi-level referral system (10 levels)

-- PHASE 1: DATABASE SCHEMA
-- Referral data lives in its own table, separate from profiles

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  level int NOT NULL CHECK (level >= 1 AND level <= 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, level)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON public.referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_parent_user_id ON public.referrals(parent_user_id);

-- PHASE 2: RLS POLICIES

-- Enable RLS on referrals table
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can see their own referral tree
CREATE POLICY "Users read own referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = parent_user_id);

-- Admin full access (UUID whitelist via admin check function)
CREATE POLICY "Admin full access referrals"
ON public.referrals
FOR ALL
USING (public.is_admin(auth.uid()));

-- PHASE 3: REFERRAL INSERT LOGIC

-- Function to register referral and build downline tree
CREATE OR REPLACE FUNCTION public.register_referral(
  new_user_id uuid,
  referral_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  parent_id uuid;
BEGIN
  -- Find parent user by referral code
  SELECT user_id INTO parent_id
  FROM public.profiles
  WHERE referral_code = referral_code
  LIMIT 1;

  -- If no valid referral code, exit silently
  IF parent_id IS NULL THEN
    RETURN;
  END IF;

  -- Level 1: Direct referral
  INSERT INTO public.referrals (user_id, parent_user_id, level)
  VALUES (new_user_id, parent_id, 1)
  ON CONFLICT (user_id, level) DO NOTHING;

  -- Levels 2–10: Build the downline tree
  FOR i IN 2..10 LOOP
    INSERT INTO public.referrals (user_id, parent_user_id, level)
    SELECT
      new_user_id,
      r.parent_user_id,
      i
    FROM public.referrals r
    WHERE r.user_id = parent_id
      AND r.level = i - 1
    ON CONFLICT (user_id, level) DO NOTHING;
    
    -- Exit if no more parents found at this level
    IF NOT FOUND THEN
      EXIT;
    END IF;
  END LOOP;
END;
$$;

-- Grant execute permission for the function
GRANT EXECUTE ON FUNCTION public.register_referral TO authenticated;

-- Helper function to get referral stats for member dashboard
CREATE OR REPLACE FUNCTION public.get_referral_tree_stats(
  user_uuid uuid DEFAULT auth.uid()
)
RETURNS TABLE (
  level int,
  count bigint,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.level,
    COUNT(*)::bigint,
    MAX(r.created_at) as created_at
  FROM public.referrals r
  WHERE r.parent_user_id = user_uuid
  GROUP BY r.level
  ORDER BY r.level;
END;
$$;

-- Grant execute permission for the stats function
GRANT EXECUTE ON FUNCTION public.get_referral_tree_stats TO authenticated;

-- Helper function to get all referrals for admin view
CREATE OR REPLACE FUNCTION public.get_all_referrals_admin()
RETURNS TABLE (
  referral_id uuid,
  user_email text,
  user_referral_code text,
  parent_email text,
  parent_referral_code text,
  level int,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as referral_id,
    u.email as user_email,
    p.referral_code as user_referral_code,
    pu.email as parent_email,
    pp.referral_code as parent_referral_code,
    r.level,
    r.created_at
  FROM public.referrals r
  LEFT JOIN auth.users u ON r.user_id = u.id
  LEFT JOIN public.profiles p ON r.user_id = p.user_id
  LEFT JOIN auth.users pu ON r.parent_user_id = pu.id
  LEFT JOIN public.profiles pp ON r.parent_user_id = pp.user_id
  ORDER BY r.created_at DESC;
END;
$$;

-- Grant execute permission for admin function
GRANT EXECUTE ON FUNCTION public.get_all_referrals_admin TO authenticated;
