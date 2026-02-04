import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatRupiah, formatNumberID } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Invoice {
  id: string;
  invoice_no: string;
  status: string;
  amount_input: number;
  base_currency: string;
  amount_usd: number;
  tpc_amount: number;
  created_at: string;
  expires_at?: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'PAID': return { color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/20', label: 'Lunas', icon: CheckCircle };
    case 'PENDING_REVIEW': return { color: 'text-amber-400', bgColor: 'bg-amber-400/10', borderColor: 'border-amber-400/20', label: 'Review', icon: AlertTriangle };
    case 'UNPAID': return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: 'Belum Bayar', icon: Clock };
    case 'CANCELLED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Dibatalkan', icon: XCircle };
    case 'EXPIRED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Kadaluarsa', icon: XCircle };
    default: return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: status, icon: FileText };
  }
};

const TAB_LABELS = {
  ALL: 'Semua',
  PAID: 'Lunas',
  PENDING_REVIEW: 'Review',
  UNPAID: 'Belum Bayar',
  CANCELLED: 'Ditolak'
} as const;

export default function MemberInvoicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL'|'PAID'|'PENDING_REVIEW'|'UNPAID'|'CANCELLED'>('ALL');

  // Filter invoices based on active tab
  const filteredInvoices = activeTab === 'ALL' 
    ? invoices 
    : invoices.filter(i => i.status === activeTab);

  // Calculate counts safely
  const counts = {
    ALL: (invoices ?? []).length,
    PAID: (invoices ?? []).filter(i => i.status === 'PAID').length,
    PENDING_REVIEW: (invoices ?? []).filter(i => i.status === 'PENDING_REVIEW').length,
    UNPAID: (invoices ?? []).filter(i => i.status === 'UNPAID').length,
    CANCELLED: (invoices ?? []).filter(i => i.status === 'CANCELLED').length
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });
        
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
        <h1 className="text-white font-semibold text-lg">Invoice Saya</h1>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="sticky top-0 z-10 bg-[#0B0F14]/90 backdrop-blur pb-3">
          <TabsList className="w-full justify-start overflow-x-auto bg-[#11161C] border border-[#1F2A33] rounded-xl">
            <TabsTrigger 
              value="ALL" 
              className="data-[state=active]:bg-[#F0B90B]/10 data-[state=active]:text-[#F0B90B] data-[state=active]:border-[#F0B90B]/30 text-[#848E9C] hover:text-white"
            >
              {TAB_LABELS.ALL}
              {counts.ALL > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[#2B3139] text-[#848E9C] rounded-full">
                  {counts.ALL}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="PAID" 
              className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-400/30 text-[#848E9C] hover:text-white"
            >
              {TAB_LABELS.PAID}
              {counts.PAID > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                  {counts.PAID}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="PENDING_REVIEW" 
              className="data-[state=active]:bg-[#F0B90B]/10 data-[state=active]:text-[#F0B90B] data-[state=active]:border-[#F0B90B]/30 text-[#848E9C] hover:text-white"
            >
              {TAB_LABELS.PENDING_REVIEW}
              {counts.PENDING_REVIEW > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[#F0B90B]/20 text-[#F0B90B] rounded-full">
                  {counts.PENDING_REVIEW}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="UNPAID" 
              className="data-[state=active]:bg-[#848E9C]/10 data-[state=active]:text-[#848E9C] data-[state=active]:border-[#848E9C]/30 text-[#848E9C] hover:text-white"
            >
              {TAB_LABELS.UNPAID}
              {counts.UNPAID > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[#848E9C]/20 text-[#848E9C] rounded-full">
                  {counts.UNPAID}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="CANCELLED" 
              className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 data-[state=active]:border-red-400/30 text-[#848E9C] hover:text-white"
            >
              {TAB_LABELS.CANCELLED}
              {counts.CANCELLED > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                  {counts.CANCELLED}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="p-4 space-y-4">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
            <p className="text-[#848E9C] font-medium">
              {activeTab === 'ALL' && 'Belum ada invoice'}
              {activeTab === 'PAID' && 'Belum ada invoice lunas'}
              {activeTab === 'PENDING_REVIEW' && 'Belum ada invoice yang direview'}
              {activeTab === 'UNPAID' && 'Tidak ada invoice belum bayar'}
              {activeTab === 'CANCELLED' && 'Tidak ada invoice ditolak'}
            </p>
            {activeTab === 'ALL' && (
              <>
                <p className="text-[#848E9C] text-sm mt-1">Beli TPC untuk membuat invoice pertama</p>
                <button
                  onClick={() => navigate('/id/buytpc')}
                  className="mt-4 bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Beli TPC Sekarang
                </button>
              </>
            )}
          </div>
        ) : (
          filteredInvoices.map((invoice) => {
            const statusConfig = getStatusConfig(invoice.status);
            const Icon = statusConfig.icon;
            
            return (
              <div
                key={invoice.invoice_no}
                onClick={() => navigate(`/id/member/invoices/${invoice.invoice_no}`)}
                className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 cursor-pointer hover:border-[#F0B90B]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-medium">{invoice.invoice_no}</div>
                    <div className="text-[#848E9C] text-xs">
                      {new Date(invoice.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                    <Icon className="h-3 w-3" />
                    {statusConfig.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[#848E9C] text-xs mb-1">Nominal</div>
                    <div className="text-white font-medium">
                      {invoice.base_currency === 'IDR' 
                        ? formatRupiah(invoice.amount_input)
                        : `$${invoice.amount_usd?.toFixed(2)}`
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-[#848E9C] text-xs mb-1">TPC</div>
                    <div className="text-white font-medium">{formatNumberID(invoice.tpc_amount)}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
