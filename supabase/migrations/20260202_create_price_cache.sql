-- Create price cache table for SOL pricing
-- Migration: 20260202_create_price_cache.sql

CREATE TABLE IF NOT EXISTS price_cache (
    key TEXT PRIMARY KEY,
    value NUMERIC NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_price_cache_updated_at ON price_cache(updated_at);

-- Add comments
COMMENT ON TABLE price_cache IS 'Cache for real-time pricing data (SOL, etc.)';
COMMENT ON COLUMN price_cache.key IS 'Cache key (e.g., SOL_USD)';
COMMENT ON COLUMN price_cache.value IS 'Cached price value';
COMMENT ON COLUMN price_cache.updated_at IS 'Last update timestamp';

-- Insert initial SOL price placeholder (will be updated by edge function)
INSERT INTO price_cache (key, value) 
VALUES ('SOL_USD', 200.00) 
ON CONFLICT (key) DO NOTHING;
