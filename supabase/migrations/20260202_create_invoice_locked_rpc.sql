-- Create locked invoice RPC function
-- Migration: 20260202_create_invoice_locked_rpc.sql

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
    user_id UUID
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
    
    -- Invoice data
    v_invoice_no TEXT;
    v_expires_at TIMESTAMPTZ;
    v_user_id UUID;
    
    -- Validation
    v_email_valid BOOLEAN;
    v_referral_valid BOOLEAN;
    v_amount_valid BOOLEAN;
BEGIN
    -- Validate email
    v_email_valid := p_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
    IF NOT v_email_valid THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Validate referral code
    v_referral_valid := LENGTH(TRIM(p_referral_code)) >= 3;
    IF NOT v_referral_valid THEN
        RAISE EXCEPTION 'Referral code must be at least 3 characters';
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
    
    -- Calculate sponsor bonus (5%)
    v_sponsor_bonus_tpc := FLOOR(v_tpc_amount * (v_sponsor_pct / 100.0));
    
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
        UPPER(TRIM(p_referral_code)),
        p_base_currency,
        p_amount_input,
        v_amount_usd,
        v_tpc_amount,
        v_idr_rate,
        v_tpc_price_usd,
        v_sol_price_usd,
        v_amount_sol,
        v_sponsor_pct,
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
        user_id
    FROM invoices 
    WHERE invoice_no = v_invoice_no;
    
    RETURN;
END;
$$;
