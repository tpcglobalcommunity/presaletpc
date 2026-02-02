-- Create RPC function to get presale stage configuration
-- Migration: 20260202_rpc_get_presale_stage_config.sql

CREATE OR REPLACE FUNCTION get_presale_stage_config()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSON;
    v_stage1_started_at TIMESTAMPTZ;
    v_stage1_duration_days INTEGER;
    v_stage1_supply BIGINT;
    v_stage1_price_usd NUMERIC;
    v_stage2_supply BIGINT;
    v_stage2_price_usd NUMERIC;
    v_listing_price_usd NUMERIC;
BEGIN
    -- Get configuration from app_settings
    SELECT value::TIMESTAMPTZ INTO v_stage1_started_at 
    FROM app_settings 
    WHERE key = 'stage1_started_at';
    
    SELECT value::INTEGER INTO v_stage1_duration_days 
    FROM app_settings 
    WHERE key = 'stage1_duration_days';
    
    SELECT value::BIGINT INTO v_stage1_supply 
    FROM app_settings 
    WHERE key = 'stage1_supply';
    
    SELECT value::NUMERIC INTO v_stage1_price_usd 
    FROM app_settings 
    WHERE key = 'stage1_price_usd';
    
    SELECT value::BIGINT INTO v_stage2_supply 
    FROM app_settings 
    WHERE key = 'stage2_supply';
    
    SELECT value::NUMERIC INTO v_stage2_price_usd 
    FROM app_settings 
    WHERE key = 'stage2_price_usd';
    
    SELECT value::NUMERIC INTO v_listing_price_usd 
    FROM app_settings 
    WHERE key = 'listing_price_usd';
    
    -- Build JSON response
    v_result := json_build_object(
        'stage1_started_at', EXTRACT(EPOCH FROM v_stage1_started_at) * 1000, -- Unix timestamp in ms
        'stage1_duration_days', COALESCE(v_stage1_duration_days, 180),
        'stage1_supply', COALESCE(v_stage1_supply, 100000000),
        'stage1_price_usd', COALESCE(v_stage1_price_usd, 0.001),
        'stage2_supply', COALESCE(v_stage2_supply, 100000000),
        'stage2_price_usd', COALESCE(v_stage2_price_usd, 0.002),
        'listing_price_usd', COALESCE(v_listing_price_usd, 0.005)
    );
    
    RETURN v_result;
END;
$$;
