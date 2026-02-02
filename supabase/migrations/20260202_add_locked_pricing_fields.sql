-- Add locked pricing fields to invoices table
-- Migration: 20260202_add_locked_pricing_fields.sql

-- Add pricing snapshot fields
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS idr_rate INTEGER NOT NULL DEFAULT 17000,
ADD COLUMN IF NOT EXISTS tpc_price_usd NUMERIC NOT NULL DEFAULT 0.001,
ADD COLUMN IF NOT EXISTS sol_price_usd NUMERIC NULL,
ADD COLUMN IF NOT EXISTS amount_sol NUMERIC NULL,
ADD COLUMN IF NOT EXISTS sponsor_bonus_pct INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sponsor_bonus_tpc NUMERIC NOT NULL DEFAULT 0;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_idr_rate ON invoices(idr_rate);
CREATE INDEX IF NOT EXISTS idx_invoices_tpc_price_usd ON invoices(tpc_price_usd);
CREATE INDEX IF NOT EXISTS idx_invoices_sol_price_usd ON invoices(sol_price_usd);
CREATE INDEX IF NOT EXISTS idx_invoices_sponsor_bonus_pct ON invoices(sponsor_bonus_pct);
CREATE INDEX IF NOT EXISTS idx_invoices_sponsor_bonus_tpc ON invoices(sponsor_bonus_tpc);

-- Add comments for documentation
COMMENT ON COLUMN invoices.idr_rate IS 'Locked IDR rate: 1 USD = 17000 IDR';
COMMENT ON COLUMN invoices.tpc_price_usd IS 'Locked TPC price: 1 TPC = 0.001 USD';
COMMENT ON COLUMN invoices.sol_price_usd IS 'Snapshot SOL price at invoice creation';
COMMENT ON COLUMN invoices.amount_sol IS 'Original SOL amount input';
COMMENT ON COLUMN invoices.sponsor_bonus_pct IS 'Locked sponsor commission percentage (5%)';
COMMENT ON COLUMN invoices.sponsor_bonus_tpc IS 'Sponsor bonus amount in TPC tokens';
