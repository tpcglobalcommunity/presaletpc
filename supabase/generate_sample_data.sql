-- Copy and paste this script in Supabase SQL Editor
-- This will generate realistic sample data for admin dashboard

-- Generate sample users (profiles)
INSERT INTO profiles (id, email_current, member_code, referral_code, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'TPC001', 'REF001', NOW() - INTERVAL '30 days', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'TPC002', 'REF002', NOW() - INTERVAL '25 days', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'mike.wilson@example.com', 'TPC003', 'REF003', NOW() - INTERVAL '20 days', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'sarah.johnson@example.com', 'TPC004', 'REF004', NOW() - INTERVAL '15 days', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'david.brown@example.com', 'TPC005', 'REF005', NOW() - INTERVAL '10 days', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'emily.davis@example.com', 'TPC006', 'REF006', NOW() - INTERVAL '8 days', NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'chris.miller@example.com', 'TPC007', 'REF007', NOW() - INTERVAL '6 days', NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'lisa.garcia@example.com', 'TPC008', 'REF008', NOW() - INTERVAL '5 days', NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'robert.martinez@example.com', 'TPC009', 'REF009', NOW() - INTERVAL '4 days', NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'jennifer.anderson@example.com', 'TPC010', 'REF010', NOW() - INTERVAL '3 days', NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'william.taylor@example.com', 'TPC011', 'REF011', NOW() - INTERVAL '2 days', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'mary.thomas@example.com', 'TPC012', 'REF012', NOW() - INTERVAL '1 day', NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'james.jackson@example.com', 'TPC013', 'REF013', NOW() - INTERVAL '12 hours', NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'patricia.white@example.com', 'TPC014', 'REF014', NOW() - INTERVAL '6 hours', NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'richard.harris@example.com', 'TPC015', 'REF015', NOW() - INTERVAL '2 hours', NOW())
ON CONFLICT (id) DO NOTHING;

-- Generate sample invoices
INSERT INTO invoices (
    id, invoice_no, email, user_id, base_currency, amount_input, tpc_amount, 
    status, created_at, expires_at, updated_at
) VALUES
-- Paid invoices
(gen_random_uuid(), 'TPC-2024-0001', 'john.doe@example.com', '550e8400-e29b-41d4-a716-446655440001', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), 'TPC-2024-0002', 'jane.smith@example.com', '550e8400-e29b-41d4-a716-446655440002', 'IDR', 3400000, 3400000, 'PAID', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'TPC-2024-0003', 'mike.wilson@example.com', '550e8400-e29b-41d4-a716-446655440003', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '18 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), 'TPC-2024-0004', 'sarah.johnson@example.com', '550e8400-e29b-41d4-a716-446655440004', 'IDR', 5100000, 5100000, 'PAID', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(gen_random_uuid(), 'TPC-2024-0005', 'david.brown@example.com', '550e8400-e29b-41d4-a716-446655440005', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '12 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'TPC-2024-0006', 'emily.davis@example.com', '550e8400-e29b-41d4-a716-446655440006', 'IDR', 3400000, 3400000, 'PAID', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'TPC-2024-0007', 'chris.miller@example.com', '550e8400-e29b-41d4-a716-446655440007', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'TPC-2024-0008', 'lisa.garcia@example.com', '550e8400-e29b-41d4-a716-446655440008', 'IDR', 6800000, 6800000, 'PAID', NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Unpaid invoices
(gen_random_uuid(), 'TPC-2024-0009', 'robert.martinez@example.com', '550e8400-e29b-41d4-a716-446655440009', 'IDR', 1700000, 1700000, 'UNPAID', NOW() - INTERVAL '4 days', NOW() + INTERVAL '2 days', NOW()),
(gen_random_uuid(), 'TPC-2024-0010', 'jennifer.anderson@example.com', '550e8400-e29b-41d4-a716-446655440010', 'IDR', 3400000, 3400000, 'UNPAID', NOW() - INTERVAL '3 days', NOW() + INTERVAL '3 days', NOW()),
(gen_random_uuid(), 'TPC-2024-0011', 'william.taylor@example.com', '550e8400-e29b-41d4-a716-446655440011', 'IDR', 1700000, 1700000, 'UNPAID', NOW() - INTERVAL '2 days', NOW() + INTERVAL '4 days', NOW()),
(gen_random_uuid(), 'TPC-2024-0012', 'mary.thomas@example.com', '550e8400-e29b-41d4-a716-446655440012', 'IDR', 5100000, 5100000, 'UNPAID', NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', NOW()),

-- Pending review invoices
(gen_random_uuid(), 'TPC-2024-0013', 'james.jackson@example.com', '550e8400-e29b-41d4-a716-446655440013', 'IDR', 1700000, 1700000, 'PENDING_REVIEW', NOW() - INTERVAL '12 hours', NOW() + INTERVAL '6 days', NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), 'TPC-2024-0014', 'patricia.white@example.com', '550e8400-e29b-41d4-a716-446655440014', 'IDR', 3400000, 3400000, 'PENDING_REVIEW', NOW() - INTERVAL '6 hours', NOW() + INTERVAL '5 days', NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), 'TPC-2024-0015', 'richard.harris@example.com', '550e8400-e29b-41d4-a716-446655440015', 'IDR', 1700000, 1700000, 'PENDING_REVIEW', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '6 days', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- Update some profiles to have referral relationships
UPDATE profiles SET referral_code = 'TPC001' WHERE email_current = 'jane.smith@example.com';
UPDATE profiles SET referral_code = 'TPC002' WHERE email_current = 'mike.wilson@example.com';
UPDATE profiles SET referral_code = 'TPC003' WHERE email_current = 'sarah.johnson@example.com';
UPDATE profiles SET referral_code = 'TPC001' WHERE email_current = 'david.brown@example.com';
UPDATE profiles SET referral_code = 'TPC004' WHERE email_current = 'emily.davis@example.com';
UPDATE profiles SET referral_code = 'TPC002' WHERE email_current = 'chris.miller@example.com';
UPDATE profiles SET referral_code = 'TPC005' WHERE email_current = 'lisa.garcia@example.com';
UPDATE profiles SET referral_code = 'TPC003' WHERE email_current = 'robert.martinez@example.com';
UPDATE profiles SET referral_code = 'TPC006' WHERE email_current = 'jennifer.anderson@example.com';
UPDATE profiles SET referral_code = 'TPC007' WHERE email_current = 'william.taylor@example.com';

-- Verify the data was inserted
SELECT 'Sample Data Generated' as status;
SELECT COUNT(*) as total_users FROM profiles;
SELECT COUNT(*) as total_invoices FROM invoices;
SELECT status, COUNT(*) as count FROM invoices GROUP BY status;
SELECT COUNT(*) as total_referrals FROM profiles WHERE referral_code IS NOT NULL AND referral_code != '';

-- Test the dashboard stats function
SELECT * FROM get_dashboard_stats_admin();
