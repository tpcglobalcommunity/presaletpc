-- Create app settings table and insert presale stage configuration
-- Migration: 20260202_create_app_settings_and_stage_timers.sql

-- Create app settings table if not exists
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_app_settings_updated_at ON app_settings(updated_at);

-- Add comments
COMMENT ON TABLE app_settings IS 'Application configuration and settings';
COMMENT ON COLUMN app_settings.key IS 'Setting key identifier';
COMMENT ON COLUMN app_settings.value IS 'Setting value (stored as text)';
COMMENT ON COLUMN app_settings.updated_at IS 'Last update timestamp';

-- Insert default presale stage configuration (idempotent)
INSERT INTO app_settings (key, value) VALUES
    ('stage1_started_at', NOW()::text),
    ('stage1_duration_days', '180'),
    ('stage1_supply', '100000000'),
    ('stage1_price_usd', '0.001'),
    ('stage2_supply', '100000000'),
    ('stage2_price_usd', '0.002'),
    ('listing_price_usd', '0.005')
ON CONFLICT (key) DO NOTHING;
