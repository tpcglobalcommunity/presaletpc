import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Coins, 
  LogOut, 
  History, 
  Share2, 
  Settings,
  ChevronRight,
  Wallet,
  TrendingUp,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface Invoice {
  id: string;
  invoice_no: string;
  email: string;
  base_currency: string;
  amount_input: number;
  tpc_amount: number;
  status: string;
  created_at: string;
  expires_at: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/id');
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_no, email, base_currency, amount_input, tpc_amount, status, created_at, expires_at')
        .eq('user_id', user.id)
        .in('status', ['UNPAID', 'PENDING_REVIEW'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        setInvoices(data || []);
      }
      setIsLoading(false);
    };

    fetchInvoices();

    // Subscribe to realtime changes (user-specific)
    const channel = supabase
      .channel(`invoices-changes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
        },
        () => {
          fetchInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return <span className="badge-unpaid px-3 py-1 rounded-full text-xs font-medium">Belum Bayar</span>;
      case 'PENDING_REVIEW':
        return <span className="badge-pending px-3 py-1 rounded-full text-xs font-medium">Menunggu Review</span>;
      default:
        return null;
    }
  };

  const unpaidCount = invoices.filter(inv => inv.status === 'UNPAID').length;
  const pendingCount = invoices.filter(inv => inv.status === 'PENDING_REVIEW').length;
  const totalTPC = invoices.reduce((sum, inv) => sum + (Number(inv.tpc_amount) || 0), 0);

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'IDR') return formatRupiah(amount);
    return `${formatNumberID(amount)} ${currency}`;
  };

  const menuItems = [
    { 
      icon: FileText, 
      label: 'Invoice', 
      desc: `${invoices.length} transaksi`,
      path: '/id/member/invoices',
      color: 'bg-blue-500/20 text-blue-500'
    },
    { 
      icon: History, 
      label: 'Riwayat', 
      desc: 'Semua transaksi',
      path: '/id/member/invoices',
      color: 'bg-green-500/20 text-green-500'
    },
    { 
      icon: Share2, 
      label: 'Referral', 
      desc: 'Kode & bonus',
      path: '/id/member/referrals',
      color: 'bg-purple-500/20 text-purple-500'
    },
    { 
      icon: Settings, 
      label: 'Pengaturan', 
      desc: 'Profil & akun',
      path: '/id/member/settings',
      color: 'bg-orange-500/20 text-orange-500'
    },
    { 
      icon: Wallet, 
      label: 'Beli TPC', 
      desc: 'Tambah saldo',
      path: '/id/buytpc',
      color: 'bg-yellow-500/20 text-yellow-500'
    },
    { 
      icon: TrendingUp, 
      label: 'Market', 
      desc: 'Jual/Beli TPC',
      path: '/id/market',
      color: 'bg-emerald-500/20 text-emerald-500'
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mobile-container pt-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              {profile ? `Selamat datang, ${profile.member_code}` : 'Selamat datang'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">{unpaidCount}</div>
            <div className="text-xs text-muted-foreground">Belum Bayar</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
            <div className="text-xs text-muted-foreground">Review</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-primary">{formatNumberID(totalTPC)}</div>
            <div className="text-xs text-muted-foreground">Total TPC</div>
          </div>
        </div>
      )}

      {/* Member Profile Card */}
      {profile && (
        <div className="glass-card mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Wallet className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">Kode Member Anda</div>
              <div className="font-mono font-bold text-xl text-white truncate">{profile.member_code}</div>
            </div>
            <button
              onClick={() => navigate('/id/buytpc')}
              className="btn-gold py-3 px-5 text-sm shrink-0"
            >
              <Coins className="h-4 w-4" />
              Beli
            </button>
          </div>
        </div>
      )}

      {/* Quick Menu */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Menu Cepat</h2>
        <div className="grid grid-cols-3 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="glass-card p-4 text-left hover:bg-primary/5 transition-all group"
            >
              <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="font-semibold text-sm text-white">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Invoices Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Invoice Aktif</h2>
          {invoices.length > 0 && (
            <button 
              onClick={() => navigate('/id/member/invoices')}
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              Lihat Semua
              <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {invoices.length === 0 ? (
          <div className="glass-card text-center py-10">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-white mb-1">Tidak Ada Invoice</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Anda belum memiliki invoice yang perlu diproses
            </p>
            <button
              onClick={() => navigate('/id/buytpc')}
              className="btn-gold text-sm py-2 px-4"
            >
              <Coins className="h-4 w-4" />
              Beli TPC Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Sort: UNPAID first, then by expiry urgency */}
            {[...invoices]
              .sort((a, b) => {
                // UNPAID invoices first
                if (a.status === 'UNPAID' && b.status !== 'UNPAID') return -1;
                if (a.status !== 'UNPAID' && b.status === 'UNPAID') return 1;
                // Then by expiry time (soonest first)
                return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
              })
              .slice(0, 3)
              .map((invoice) => {
                const timeLeft = new Date(invoice.expires_at).getTime() - Date.now();
                const isExpiringSoon = timeLeft < 3600000; // < 1 hour
                const isExpiringToday = timeLeft < 86400000; // < 24 hours
                const progressPercent = Math.max(0, Math.min(100, (timeLeft / (23 * 3600000)) * 100));

                return (
                  <div
                    key={invoice.id}
                    className={`glass-card w-full p-4 transition-all hover:scale-[1.02] ${
                      isExpiringSoon && invoice.status === 'UNPAID'
                        ? 'border-red-500/50 bg-red-500/5'
                        : isExpiringToday && invoice.status === 'UNPAID'
                        ? 'border-yellow-500/50 bg-yellow-500/5'
                        : ''
                    }`}
                  >
                    {/* Header: Invoice No + Status */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-mono font-bold text-sm text-white">{invoice.invoice_no}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(invoice.created_at), 'd MMM yyyy', { locale: id })}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(invoice.status)}
                        {isExpiringSoon && invoice.status === 'UNPAID' && (
                          <span className="text-[10px] text-red-400 font-medium animate-pulse">
                            Segera bayar!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount Info */}
                    <div className="flex justify-between items-center py-2 border-y border-border/30 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Total Bayar</div>
                        <div className="font-semibold text-white">
                          {formatCurrency(invoice.amount_input, invoice.base_currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-0.5">Jumlah TPC</div>
                        <div className="font-bold text-primary text-lg">
                          {formatNumberID(Number(invoice.tpc_amount))}
                        </div>
                      </div>
                    </div>

                    {/* Expiry Info with Progress Bar */}
                    {invoice.status === 'UNPAID' && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className={`flex items-center gap-1 ${isExpiringSoon ? 'text-red-400' : 'text-yellow-400'}`}>
                            {isExpiringSoon ? <AlertCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                            {isExpiringSoon 
                              ? 'Expired dalam < 1 jam'
                              : isExpiringToday
                              ? 'Expired hari ini'
                              : `Berlaku hingga ${format(new Date(invoice.expires_at), 'd MMM, HH:mm', { locale: id })}`
                            }
                          </span>
                          <span className="text-muted-foreground">
                            {Math.ceil(timeLeft / 3600000)}j tersisa
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              isExpiringSoon ? 'bg-red-500' : isExpiringToday ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {invoice.status === 'PENDING_REVIEW' && (
                      <div className="flex items-center gap-2 mb-3 text-xs text-blue-400 bg-blue-500/10 p-2 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sedang direview oleh admin. Estimasi 1x24 jam.</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/id/member/invoices/${invoice.id}`)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                      >
                        Detail
                      </button>
                      {invoice.status === 'UNPAID' && (
                        <button
                          onClick={() => navigate(`/id/member/invoices/${invoice.id}`)}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                            isExpiringSoon
                              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                              : 'btn-gold'
                          }`}
                        >
                          {isExpiringSoon ? 'Bayar Sekarang!' : 'Bayar'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            {invoices.length > 3 && (
              <button
                onClick={() => navigate('/id/member/invoices')}
                className="w-full py-3 text-sm text-primary flex items-center justify-center gap-1 hover:underline border border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
              >
                Lihat {invoices.length - 3} invoice lainnya
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Promo / CTA Section */}
      <div className="glass-card p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-white">Ajak Teman</div>
            <div className="text-xs text-muted-foreground">
              Dapatkan bonus TPC dengan mengajak teman menggunakan kode referral Anda
            </div>
          </div>
          <button
            onClick={() => navigate('/id/member/referrals')}
            className="text-yellow-500 hover:text-yellow-400"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
