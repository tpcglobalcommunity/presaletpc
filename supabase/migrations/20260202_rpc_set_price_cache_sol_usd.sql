-- RPC to set SOL price cache
-- Migration: 20260202_rpc_set_price_cache_sol_usd.sql

CREATE OR REPLACE FUNCTION set_price_cache_sol_usd(p_value NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate input
  IF p_value IS NULL OR p_value <= 0 THEN
    RAISE EXCEPTION 'SOL price must be a positive number';
  END IF;
  
  -- Upsert SOL price to price_cache
  INSERT INTO price_cache (key, value, updated_at)
  VALUES ('SOL_USD', p_value, NOW())
  ON CONFLICT (key) 
  DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = EXCLUDED.updated_at;
    
END;
$$;
