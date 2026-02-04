import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Coins, FileText, Users, User, ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumberID } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
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

  // Fetch user's own profile
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    (async () => {
      console.log('[PROFILE] Loading profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id,email_initial,email_current,member_code,referred_by')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('[PROFILE] load failed', error);
        return;
      }

      console.log('[PROFILE] Loaded profile:', { user_id: data?.user_id, member_code: data?.member_code, email_current: data?.email_current });
      setProfile(data);
    })();

    return () => { cancelled = true; };
  }, [user?.id]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // For now, use direct query since RPC might not exist
        const { data, error } = await supabase
          .from('invoices')
          .select('id,invoice_no,status,tpc_amount,created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching invoices:', error);
          toast({ title: 'Gagal memuat data', variant: 'destructive' });
          return;
        }
        
        setInvoices(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({ title: 'Terjadi kesalahan', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchInvoices();
    }
  }, [user, toast]);

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
    <div className="min-h-screen bg-[#0B0E11] pb-20">
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
            onClick={() => navigate('/id/buytpc')}
            className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Coins className="h-5 w-5" />
            Beli TPC
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => navigate('/id/dashboard/invoices')}
            className="w-full bg-[#1E2329] border border-[#2B3139] hover:border-[#F0B90B]/50 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <FileText className="h-5 w-5" />
            Lihat Invoice
            <ArrowRight className="h-4 w-4" />
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
