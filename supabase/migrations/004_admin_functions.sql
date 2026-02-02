-- Fungsi untuk mengambil semua invoice dengan data email profil
CREATE OR REPLACE FUNCTION get_all_invoices_admin()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    email TEXT,
    referral_code TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    member_name TEXT
) AS $$
BEGIN
    -- Cek keamanan: Hanya super admin yang bisa eksekusi
    IF auth.uid() != '518694f6-bb50-4724-b4a5-77ad30152e0e' THEN
        RAISE EXCEPTION 'Akses ditolak: Anda bukan Admin.';
    END IF;

    RETURN QUERY
    SELECT 
        i.id, 
        i.user_id, 
        i.email, 
        i.referral_code, 
        i.status, 
        i.created_at, 
        p.email_current as member_name
    FROM public.invoices i
    LEFT JOIN public.profiles p ON i.user_id = p.user_id
    ORDER BY i.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fungsi untuk mengambil semua user dengan data profil
CREATE OR REPLACE FUNCTION get_all_users_admin()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    email_initial TEXT,
    email_current TEXT,
    member_code TEXT,
    referred_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    total_invoices INTEGER
) AS $$
BEGIN
    -- Cek keamanan: Hanya super admin yang bisa eksekusi
    IF auth.uid() != '518694f6-bb50-4724-b4a5-77ad30152e0e' THEN
        RAISE EXCEPTION 'Akses ditolak: Anda bukan Admin.';
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.user_id,
        p.email_initial,
        p.email_current,
        p.member_code,
        p.referred_by,
        p.created_at,
        COALESCE(inv_count.total, 0) as total_invoices
    FROM public.profiles p
    LEFT JOIN (
        SELECT 
            user_id, 
            COUNT(*) as total
        FROM public.invoices
        GROUP BY user_id
    ) inv_count ON p.user_id = inv_count.user_id
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fungsi untuk update status invoice
CREATE OR REPLACE FUNCTION update_invoice_status_admin(
    invoice_id UUID,
    new_status TEXT,
    review_note TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Cek keamanan: Hanya super admin yang bisa eksekusi
    IF auth.uid() != '518694f6-bb50-4724-b4a5-77ad30152e0e' THEN
        RAISE EXCEPTION 'Akses ditolak: Anda bukan Admin.';
    END IF;

    -- Update invoice
    UPDATE public.invoices 
    SET 
        status = new_status,
        review_note = review_note,
        reviewed_at = NOW(),
        reviewed_by = auth.uid()::TEXT,
        updated_at = NOW()
    WHERE id = invoice_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fungsi untuk get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats_admin()
RETURNS TABLE (
    total_users INTEGER,
    total_invoices INTEGER,
    unpaid_invoices INTEGER,
    paid_invoices INTEGER,
    total_referrals INTEGER
) AS $$
BEGIN
    -- Cek keamanan: Hanya super admin yang bisa eksekusi
    IF auth.uid() != '518694f6-bb50-4724-b4a5-77ad30152e0e' THEN
        RAISE EXCEPTION 'Akses ditolak: Anda bukan Admin.';
    END IF;

    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.profiles) as total_users,
        (SELECT COUNT(*) FROM public.invoices) as total_invoices,
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'UNPAID') as unpaid_invoices,
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PAID') as paid_invoices,
        (SELECT COUNT(*) FROM public.profiles WHERE referred_by IS NOT NULL) as total_referrals;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
