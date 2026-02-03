-- Fix: Add referral code validation to create_invoice_locked
-- Purpose: Check if referral code exists in profiles before creating invoice

-- First, create a helper function to check referral code validity
CREATE OR REPLACE FUNCTION is_referral_code_valid(p_referral_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    referral_exists BOOLEAN;
BEGIN
    -- Check if referral code exists in profiles table
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE member_code = UPPER(TRIM(p_referral_code))
        AND member_code IS NOT NULL
    ) INTO referral_exists;
    
    RETURN referral_exists;
END;
$$;

-- Update create_invoice_locked to validate referral code
DROP FUNCTION IF EXISTS public.create_invoice_locked(TEXT, TEXT, TEXT, NUMERIC);

CREATE OR REPLACE FUNCTION create_invoice_locked(
    p_email TEXT,
    p_referral_code TEXT,
    p_base_currency TEXT,
    p_amount_input NUMERIC
)
RETURNS TABLE (
    id UUID,
    invoice_no TEXT,
    email TEXT,
    referral_code TEXT,
    base_currency TEXT,
    amount_input NUMERIC,
    amount_usd NUMERIC,
    tpc_amount NUMERIC,
    idr_rate INTEGER,
    tpc_price_usd NUMERIC,
    sol_price_usd NUMERIC,
    amount_sol NUMERIC,
    sponsor_bonus_pct INTEGER,
    sponsor_bonus_tpc NUMERIC,
    status TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    user_id UUID,
    referral_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    -- Locked constants
    v_tpc_price_usd NUMERIC := 0.001;
    v_idr_rate INTEGER := 17000;
    v_sponsor_pct INTEGER := 5;
    
    -- Calculation variables
    v_amount_usd NUMERIC;
    v_tpc_amount NUMERIC;
    v_sol_price_usd NUMERIC;
    v_amount_sol NUMERIC;
    v_sponsor_bonus_tpc NUMERIC;
    v_referral_valid BOOLEAN;
    
    -- Invoice data
    v_invoice_no TEXT;
    v_expires_at TIMESTAMPTZ;
    v_user_id UUID;
    
    -- Validation
    v_email_valid BOOLEAN;
    v_referral_format_valid BOOLEAN;
    v_amount_valid BOOLEAN;
BEGIN
    -- Validate email
    v_email_valid := p_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
    IF NOT v_email_valid THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Validate referral code format
    v_referral_format_valid := LENGTH(TRIM(p_referral_code)) >= 3;
    IF NOT v_referral_format_valid THEN
        RAISE EXCEPTION 'Referral code must be at least 3 characters';
    END IF;
    
    -- Validate referral code exists in database
    IF p_referral_code IS NOT NULL AND TRIM(p_referral_code) != '' THEN
        v_referral_valid := is_referral_code_valid(p_referral_code);
    ELSE
        v_referral_valid := FALSE; -- No referral code provided
    END IF;
    
    -- Validate amount
    v_amount_valid := p_amount_input > 0;
    IF NOT v_amount_valid THEN
        RAISE EXCEPTION 'Amount must be greater than 0';
    END IF;
    
    -- Calculate based on currency
    IF p_base_currency = 'IDR' THEN
        -- IDR: integer only
        p_amount_input := FLOOR(p_amount_input);
        v_amount_usd := p_amount_input / v_idr_rate;
        v_tpc_amount := FLOOR(v_amount_usd / v_tpc_price_usd);
        v_sol_price_usd := NULL;
        v_amount_sol := NULL;
        
    ELSIF p_base_currency = 'USDC' THEN
        -- USDC: integer only
        p_amount_input := FLOOR(p_amount_input);
        v_amount_usd := p_amount_input;
        v_tpc_amount := FLOOR(v_amount_usd / v_tpc_price_usd);
        v_sol_price_usd := NULL;
        v_amount_sol := NULL;
        
    ELSIF p_base_currency = 'SOL' THEN
        -- SOL: max 3 decimal places, strict validation
        IF ROUND(p_amount_input::numeric, 3) != p_amount_input THEN
            RAISE EXCEPTION 'SOL amount must have maximum 3 decimal places';
        END IF;
        
        -- Get current SOL price from cache
        SELECT value INTO v_sol_price_usd 
        FROM price_cache 
        WHERE key = 'SOL_USD' 
        AND updated_at > NOW() - INTERVAL '10 minutes';
        
        IF v_sol_price_usd IS NULL THEN
            RAISE EXCEPTION 'SOL price unavailable or stale';
        END IF;
        
        v_amount_usd := p_amount_input * v_sol_price_usd;
        v_tpc_amount := FLOOR(v_amount_usd / v_tpc_price_usd);
        v_amount_sol := p_amount_input;
        
    ELSE
        RAISE EXCEPTION 'Invalid base currency';
    END IF;
    
    -- Calculate sponsor bonus (only if referral is valid)
    IF v_referral_valid THEN
        v_sponsor_bonus_tpc := FLOOR(v_tpc_amount * (v_sponsor_pct / 100.0));
    ELSE
        v_sponsor_bonus_tpc := 0; -- No bonus for invalid referral
    END IF;
    
    -- Generate invoice number
    SELECT invoice_no INTO v_invoice_no 
    FROM generate_invoice_no();
    
    -- Set expiry
    v_expires_at := NOW() + INTERVAL '23 hours';
    
    -- Get current user ID (if logged in)
    SELECT auth.uid() INTO v_user_id;
    
    -- Insert invoice with locked pricing
    INSERT INTO invoices (
        invoice_no,
        email,
        referral_code,
        base_currency,
        amount_input,
        amount_usd,
        tpc_amount,
        idr_rate,
        tpc_price_usd,
        sol_price_usd,
        amount_sol,
        sponsor_bonus_pct,
        sponsor_bonus_tpc,
        status,
        expires_at,
        user_id
    ) VALUES (
        v_invoice_no,
        LOWER(TRIM(p_email)),
        CASE 
            WHEN v_referral_valid THEN UPPER(TRIM(p_referral_code))
            ELSE NULL -- Don't save invalid referral codes
        END,
        p_base_currency,
        p_amount_input,
        v_amount_usd,
        v_tpc_amount,
        v_idr_rate,
        v_tpc_price_usd,
        v_sol_price_usd,
        v_amount_sol,
        CASE 
            WHEN v_referral_valid THEN v_sponsor_pct
            ELSE 0 -- No sponsor bonus percentage for invalid referral
        END,
        v_sponsor_bonus_tpc,
        'UNPAID',
        v_expires_at,
        v_user_id
    );
    
    RETURN QUERY
    SELECT 
        id,
        invoice_no,
        email,
        referral_code,
        base_currency,
        amount_input,
        amount_usd,
        tpc_amount,
        idr_rate,
        tpc_price_usd,
        sol_price_usd,
        amount_sol,
        sponsor_bonus_pct,
        sponsor_bonus_tpc,
        status,
        expires_at,
        created_at,
        user_id,
        v_referral_valid as referral_valid
    FROM invoices 
    WHERE invoice_no = v_invoice_no;
    
    RETURN;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_referral_code_valid(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invoice_locked(TEXT, TEXT, TEXT, NUMERIC) TO authenticated;
