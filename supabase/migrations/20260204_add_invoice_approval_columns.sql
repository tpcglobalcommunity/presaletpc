-- Migration: Add approval tracking columns to invoices table
-- Purpose: Track TPC delivery and approval timestamps
-- Safety: ADDITIVE ONLY - no existing columns modified

ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tpc_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS tpc_sent BOOLEAN DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_approved_at ON invoices(approved_at);
CREATE INDEX IF NOT EXISTS idx_invoices_tpc_sent ON invoices(tpc_sent);

-- Add comment for documentation
COMMENT ON COLUMN invoices.approved_at IS 'Timestamp when admin approved the invoice and TPC was sent';
COMMENT ON COLUMN invoices.tpc_tx_hash IS 'Transaction hash for TPC delivery to wallet';
COMMENT ON COLUMN invoices.tpc_sent IS 'Flag indicating if TPC has been sent to user wallet';
