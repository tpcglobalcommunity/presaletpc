import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Invoice {
  id: string;
  invoice_no: string;
  base_currency: string;
  amount_input: number;
  tpc_amount: number;
  status: string;
  created_at: string;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .in('status', ['PAID', 'EXPIRED', 'CANCELLED'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        setInvoices(data || []);
      }
      setIsLoading(false);
    };

    fetchInvoices();
  }, [user]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PAID':
        return { 
          badge: <span className="badge-paid px-3 py-1 rounded-full text-xs font-medium">Lunas</span>,
          icon: <CheckCircle className="h-5 w-5 text-success" />
        };
      case 'EXPIRED':
        return { 
          badge: <span className="badge-expired px-3 py-1 rounded-full text-xs font-medium">Kadaluarsa</span>,
          icon: <Clock className="h-5 w-5 text-muted-foreground" />
        };
      case 'CANCELLED':
        return { 
          badge: <span className="badge-cancelled px-3 py-1 rounded-full text-xs font-medium">Dibatalkan</span>,
          icon: <XCircle className="h-5 w-5 text-destructive" />
        };
      default:
        return { badge: null, icon: null };
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'IDR') return formatRupiah(amount);
    return `${formatNumberID(amount)} ${currency}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mobile-container pt-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Kembali</span>
        </button>
        <h1 className="text-title">Riwayat Invoice</h1>
        <p className="text-muted-foreground text-sm">
          Invoice yang sudah selesai diproses
        </p>
      </div>

      {/* Invoice List */}
      {invoices.length === 0 ? (
        <div className="glass-card text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Belum Ada Riwayat</h3>
          <p className="text-sm text-muted-foreground">
            Invoice yang sudah selesai akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => {
            const statusInfo = getStatusInfo(invoice.status);

            return (
              <div key={invoice.id} className="glass-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {statusInfo.icon}
                    <div>
                      <div className="font-mono font-bold">{invoice.invoice_no}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(invoice.created_at), 'd MMM yyyy', { locale: id })}
                      </div>
                    </div>
                  </div>
                  {statusInfo.badge}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <div>
                    <div className="text-sm text-muted-foreground">Nominal</div>
                    <div className="font-medium">
                      {formatCurrency(Number(invoice.amount_input), invoice.base_currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">TPC</div>
                    <div className={`font-bold ${invoice.status === 'PAID' ? 'text-success' : 'text-muted-foreground'}`}>
                      {formatNumberID(Number(invoice.tpc_amount))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
