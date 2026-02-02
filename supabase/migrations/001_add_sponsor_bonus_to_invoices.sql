-- Add sponsor bonus columns to invoices table
-- Migration: 001_add_sponsor_bonus_to_invoices.sql

ALTER TABLE invoices 
ADD COLUMN sponsor_bonus_pct INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN sponsor_bonus_tpc NUMERIC DEFAULT 0 NOT NULL;

-- Add indexes for performance
CREATE INDEX idx_invoices_sponsor_bonus_pct ON invoices(sponsor_bonus_pct);
CREATE INDEX idx_invoices_sponsor_bonus_tpc ON invoices(sponsor_bonus_tpc);

-- Add comments for documentation
COMMENT ON COLUMN invoices.sponsor_bonus_pct IS 'Sponsor bonus percentage (locked at 5%)';
COMMENT ON COLUMN invoices.sponsor_bonus_tpc IS 'Sponsor bonus amount in TPC tokens';
