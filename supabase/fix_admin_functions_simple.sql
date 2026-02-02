-- 1. Hapus fungsi lama agar tidak terjadi konflik tipe data
DROP FUNCTION IF EXISTS get_admin_users_data();
DROP FUNCTION IF EXISTS get_dashboard_stats_admin();

-- 2. Buat ulang fungsi daftar user (Fix Ambiguous Column)
CREATE OR REPLACE FUNCTION get_admin_users_data()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.user_id,         -- Menggunakan p. untuk merujuk ke tabel profiles
        p.email_current, 
        p.full_name, 
        ur.role_name,
        p.created_at
    FROM public.profiles p
    LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Buat ulang fungsi statistik (Fix Referral Code & Stats)
-- CATATAN: Versi ini hanya return 4 kolom. Frontend expects 10 kolom.
-- Lihat file dashboard_stats_complete.sql untuk versi lengkap.
CREATE OR REPLACE FUNCTION get_dashboard_stats_admin()
RETURNS TABLE (
    total_users BIGINT,
    pending_review BIGINT,
    paid_invoices BIGINT,
    total_referrals BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.profiles),
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PENDING'),
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PAID'),
        -- Pastikan nama kolom 'referral_code' benar, atau sesuaikan di sini
        (SELECT COUNT(*) FROM public.profiles WHERE referral_code IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
