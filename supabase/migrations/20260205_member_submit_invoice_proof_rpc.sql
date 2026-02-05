-- Migration for secure member invoice proof submission RPC
-- This replaces client-side Edge Function calls with secure server-side processing

-- RPC function for member to submit invoice proof securely
-- This function validates ownership, updates invoice, and triggers admin email
CREATE OR REPLACE FUNCTION member_submit_invoice_proof(
    p_invoice_id UUID,
    p_user_id UUID,
    p_proof_url TEXT,
    p_proof_uploaded_at TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    invoice_id UUID,
    new_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invoice RECORD;
    v_invoice_no TEXT;
    v_base_currency TEXT;
    v_amount_input NUMERIC;
    v_tpc_amount NUMERIC;
    v_member_email TEXT;
    v_email_result JSONB;
BEGIN
    -- Validate input parameters
    IF p_invoice_id IS NULL OR p_user_id IS NULL OR p_proof_url IS NULL THEN
        RETURN QUERY SELECT false, 'Missing required parameters'::TEXT, NULL::UUID, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Get invoice and validate ownership
    SELECT 
        i.*,
        u.email as member_email
    INTO v_invoice
    FROM invoices i
    JOIN auth.users u ON u.id = i.user_id
    WHERE i.id = p_invoice_id 
    AND i.user_id = p_user_id
    AND i.status = 'UNPAID'
    FOR UPDATE;
    
    -- Check if invoice exists and belongs to user
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Invoice not found or not eligible for proof submission'::TEXT, NULL::UUID, NULL::TEXT;
        RETURN;
    END IF;
    
    -- Update invoice with proof details
    UPDATE invoices 
    SET 
        proof_url = p_proof_url,
        proof_uploaded_at = p_proof_uploaded_at,
        status = 'PENDING_REVIEW',
        submitted_at = now()
    WHERE id = p_invoice_id;
    
    -- Store invoice details for email
    v_invoice_no := v_invoice.invoice_no;
    v_base_currency := v_invoice.base_currency;
    v_amount_input := v_invoice.amount_input;
    v_tpc_amount := v_invoice.tpc_amount;
    v_member_email := v_invoice.member_email;
    
    -- Trigger admin email notification via Edge Function
    -- This is called server-side with service role permissions
    BEGIN
        SELECT content INTO v_email_result
        FROM http_post(
            'https://mzzwhrmcijyuqtfgtgg.supabase.co/functions/v1/send-admin-invoice-email',
            jsonb_build_object(
                'invoice_no', v_invoice_no,
                'base_currency', v_base_currency,
                'amount_input', v_amount_input,
                'tpc_amount', v_tpc_amount,
                'proof_url', p_proof_url,
                'member_email', v_member_email
            ),
            array[
                ('Content-Type', 'application/json'),
                ('Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true))
            ]
        );
        
        -- Log email result (don't fail if email fails)
        IF v_email_result IS NOT NULL THEN
            RAISE LOG 'Admin email sent for invoice %: %', v_invoice_no, v_email_result;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        -- Log email error but don't fail the proof submission
        RAISE LOG 'Failed to send admin email for invoice %: %', v_invoice_no, SQLERRM;
    END;
    
    -- Return success
    RETURN QUERY SELECT 
        true, 
        'Proof submitted successfully'::TEXT, 
        p_invoice_id, 
        'PENDING_REVIEW'::TEXT;
    
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION member_submit_invoice_proof TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_status ON invoices(user_id, status) WHERE status IN ('UNPAID', 'PENDING_REVIEW');
