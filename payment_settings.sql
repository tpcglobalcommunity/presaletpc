-- Insert payment settings into app_settings table
-- Migration: payment_settings.sql

INSERT INTO app_settings (key, value) VALUES
    ('payment_idr_bank_name', 'BCA'),
    ('payment_idr_bank_account_no', '7892088406'),
    ('payment_idr_bank_account_name', 'ARSYAD'),
    ('payment_sol_address', '5AeayrU2pdy6yNBeiUpTXkfMxw3VpDQGUHC6kXrBt5vw'),
    ('payment_usdc_chain', 'Solana (SPL)'),
    ('payment_usdc_address', '5AeayrU2pdy6yNBeiUpTXkfMxw3VpDQGUHC6kXrBt5vw')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();
