-- Add reject reason columns to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS rejected_reason TEXT NULL,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS rejected_by UUID NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_rejected_at ON invoices(rejected_at) WHERE rejected_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invoices_rejected_by ON invoices(rejected_by) WHERE rejected_by IS NOT NULL;

-- Add comment
COMMENT ON COLUMN invoices.rejected_reason IS 'Reason for invoice rejection (admin input)';
COMMENT ON COLUMN invoices.rejected_at IS 'Timestamp when invoice was rejected';
COMMENT ON COLUMN invoices.rejected_by IS 'UUID of admin who rejected the invoice';
