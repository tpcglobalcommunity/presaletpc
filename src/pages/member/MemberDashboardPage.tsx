import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Coins, FileText, Users, User, ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumberID } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  invoice_no: string;
  status: string;
  tpc_amount: number;
  created_at: string;
}

export default function MemberDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { lang } = useParams();
  const safeLang = lang === 'en' ? 'en' : 'id';
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // DEV log to confirm active page
  if (import.meta.env.DEV) {
    console.log('[PAGE]', 'Member Dashboard ACTIVE:', 'src/pages/member/MemberDashboardPage.tsx');
  }

  // Navigate to invoice list with safety check
  const navigateToInvoices = () => {
    try {
      navigate(`/${safeLang}/member/invoices`);
    } catch (error) {
      console.error('[NAVIGATION_ERROR] Failed to navigate to invoices:', error);
      toast({
        title: "Error Navigasi",
        description: "Halaman invoice belum tersedia. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };
  const fetchingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const invoicesFetchingRef = useRef(false);
  const lastInvoicesUserIdRef = useRef<string | null>(null);

  // Optimized profile loader
  const loadProfile = useCallback(async (uid: string) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      if (import.meta.env.DEV) {
        console.log('[PROFILE] Loading profile for user:', uid);
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id,email_initial,email_current,member_code,created_at')
        .eq('user_id', uid)
        .maybeSingle();

      if (error) {
        console.error('[PROFILE] load failed', error);
        return;
      }

      // Only update state if data actually changed
      setProfile(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) {
          return prev;
        }
        
        if (import.meta.env.DEV) {
          console.log('[PROFILE] Loaded profile:', { user_id: data?.user_id, member_code: data?.member_code, email_current: data?.email_current });
        }
        
        return data;
      });
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // Fetch user's own profile (optimized)
  useEffect(() => {
    const uid = user?.id;
    if (!uid) return;

    if (lastUserIdRef.current === uid) return;
    lastUserIdRef.current = uid;

    loadProfile(uid);
  }, [user?.id, loadProfile]);

  useEffect(() => {
    const uid = user?.id;
    if (!uid) {
      setInvoices([]);
      setIsLoading(false);
      return;
    }

    if (lastInvoicesUserIdRef.current === uid) return;
    lastInvoicesUserIdRef.current = uid;

    const fetchInvoices = async () => {
      if (invoicesFetchingRef.current) return;
      invoicesFetchingRef.current = true;

      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('invoices')
          .select('invoice_no,status,tpc_amount,created_at')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          if (import.meta.env.DEV) console.error('Error fetching invoices:', error);
          toast({ title: 'Gagal memuat data', variant: 'destructive' });
          return;
        }

        const next = data || [];
        setInvoices(prev => {
          // minimal compare to avoid spam re-render
          if (prev.length === next.length) {
            const same = prev.every((p, i) =>
              p.invoice_no === next[i]?.invoice_no &&
              p.status === next[i]?.status &&
              p.tpc_amount === next[i]?.tpc_amount &&
              p.created_at === next[i]?.created_at
            );
            if (same) return prev;
          }
          return next;
        });
      } catch (e) {
        if (import.meta.env.DEV) console.error('Error:', e);
        toast({ title: 'Terjadi kesalahan', variant: 'destructive' });
      } finally {
        setIsLoading(false);
        invoicesFetchingRef.current = false;
      }
    };

    fetchInvoices();
  }, [user?.id]);

  // Calculate stats
  const totalInvoices = invoices.length;
  const totalTPC = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.tpc_amount, 0);
  const referralBonus = 0; // Coming soon

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] pb-28">
      {/* Header */}
      <div className="bg-[#1E2329] border-b border-[#2B3139] px-4 py-3">
        <h1 className="text-white font-semibold text-lg">Dashboard</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F0B90B] flex items-center justify-center">
              <User className="h-5 w-5 text-black" />
            </div>
            <div>
              <div className="text-[#848E9C] text-xs">Email</div>
              <div className="text-white text-sm font-medium">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#F0B90B]" />
              <span className="text-white font-medium">Kode Referral</span>
            </div>
            <button
              onClick={() => {
                const referralCode = profile?.member_code || '-';
                if (referralCode !== '-') {
                  navigator.clipboard.writeText(referralCode);
                  toast({ title: 'Kode referral disalin!' });
                }
              }}
              className="text-[#F0B90B] text-sm hover:text-[#F8D56B] transition-colors"
            >
              Salin
            </button>
          </div>
          <div className="text-white font-mono text-sm bg-black/30 rounded p-2">
            {profile?.member_code || '-'}
          </div>
          <div className="text-[#848E9C] text-xs mt-2">
            Bagikan kode ini untuk dapatkan bonus sponsor 5%
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-[#848E9C]" />
              <span className="text-[#848E9C] text-xs">Total Invoice</span>
            </div>
            <div className="text-white text-xl font-bold">{totalInvoices}</div>
          </div>

          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-[#F0B90B]" />
              <span className="text-[#848E9C] text-xs">TPC Dibeli</span>
            </div>
            <div className="text-white text-xl font-bold">{formatNumberID(totalTPC)}</div>
          </div>

          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-[#F0B90B]" />
              <span className="text-[#848E9C] text-xs">Bonus Referral</span>
            </div>
            <div className="text-white text-xl font-bold">{formatNumberID(referralBonus)}</div>
            <div className="text-[#848E9C] text-xs mt-1">Coming soon</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/${safeLang}/buytpc`)}
            className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Coins className="h-5 w-5" />
            Beli TPC
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={navigateToInvoices}
            className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <FileText className="h-6 w-6" />
            <span className="text-lg">
              {invoices.length === 0 ? 'Buat Invoice' : 'Lihat Invoice'}
            </span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate(`/${safeLang}/admin`)}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl
                         bg-gradient-to-r from-yellow-400 to-yellow-500
                         text-black font-semibold py-3 shadow-lg"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
