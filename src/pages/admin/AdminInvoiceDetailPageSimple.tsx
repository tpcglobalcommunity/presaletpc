import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';

type Invoice = {
  id?: string | null;
  invoice_no?: string | null;
  status?: string | null;
  amount_input?: number | null;
  base_currency?: string | null;
  amount_usd?: number | null;
  tpc_amount?: number | null;
  created_at?: string | null;
  email?: string | null;
  transfer_method?: string | null;
  wallet_tpc?: string | null;
  proof_url?: string | null;
  proof_uploaded_at?: string | null;
  submitted_at?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_note?: string | null;
  rejected_reason?: string | null;
  rejected_at?: string | null;
  sponsor_code?: string | null;
  sponsor_user_id?: string | null;
  expires_at?: string | null;
  tpc_sent?: boolean | null;
  tpc_tx_hash?: string | null;
};

export default function AdminInvoiceDetailPage() {
  const { invoiceKey } = useParams<{ invoiceKey: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  console.debug('[ADMIN_INVOICE_DETAIL] mounted', { invoiceKey });

  // UUID detector
  const isUUID = (s: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceKey) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      console.debug('[ADMIN_INVOICE_DETAIL] fetch start', { invoiceKey });

      try {
        setIsLoading(true);
        
        const mode = isUUID(invoiceKey) ? 'id' : 'invoice_no';
        console.debug('[ADMIN_INVOICE_DETAIL] mode', { invoiceKey, mode });

        // Primary query
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq(mode, invoiceKey)
          .maybeSingle();

        console.debug('[ADMIN_INVOICE_DETAIL] primary result', { data, error });

        if (error) {
          console.error('[ADMIN_INVOICE_DETAIL] primary error:', error);
          // Try fallback
          const fallbackMode = mode === 'id' ? 'invoice_no' : 'id';
          console.debug('[ADMIN_INVOICE_DETAIL] fallback start', { fallbackMode });
          
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('invoices')
            .select('*')
            .eq(fallbackMode, invoiceKey)
            .maybeSingle();

          console.debug('[ADMIN_INVOICE_DETAIL] fallback result', { data: fallbackData, error: fallbackError });

          if (fallbackError || !fallbackData) {
            setNotFound(true);
          } else {
            setInvoice(fallbackData);
          }
        } else if (!data) {
          // Try fallback
          const fallbackMode = mode === 'id' ? 'invoice_no' : 'id';
          console.debug('[ADMIN_INVOICE_DETAIL] primary null, fallback start', { fallbackMode });
          
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('invoices')
            .select('*')
            .eq(fallbackMode, invoiceKey)
            .maybeSingle();

          console.debug('[ADMIN_INVOICE_DETAIL] fallback result', { data: fallbackData, error: fallbackError });

          if (fallbackError || !fallbackData) {
            setNotFound(true);
          } else {
            setInvoice(fallbackData);
          }
        } else {
          setInvoice(data);
        }
      } catch (error) {
        console.error('[ADMIN_INVOICE_DETAIL] fetch error:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceKey]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID': return { color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/20', label: 'Lunas', icon: CheckCircle };
      case 'PENDING_REVIEW': return { color: 'text-amber-400', bgColor: 'bg-amber-400/10', borderColor: 'border-amber-400/20', label: 'Menunggu Verifikasi', icon: Clock };
      case 'REJECTED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Ditolak', icon: XCircle };
      case 'UNPAID': return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: 'Belum Bayar', icon: FileText };
      case 'CANCELLED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Dibatalkan', icon: XCircle };
      default: return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: status, icon: FileText };
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F0B90B] mx-auto"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Invoice Tidak Ditemukan</h2>
          <p className="text-[#848E9C] mb-4">
            Invoice dengan ID atau Nomor Invoice yang diminta tidak ditemukan.
          </p>
          <Button
            onClick={() => navigate('/id/admin/invoices')}
            className="bg-[#F0B90B] hover:bg-[#F8D56B] text-black"
          >
            Kembali ke Daftar Invoice
          </Button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F0B90B] mx-auto"></div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(invoice.status || '');
  const Icon = statusConfig.icon;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/id/admin/invoices')}
          className="text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Invoice
        </Button>
        <h1 className="text-2xl font-bold text-white mb-2">Detail Invoice</h1>
        <p className="text-[#848E9C]">Kelola detail invoice pembelian TPC</p>
      </div>

      {/* Invoice Info */}
      <Card className="bg-[#1E2329] border border-[#2B3139]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Informasi Invoice</span>
            <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
              <Icon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-[#848E9C] text-sm">Nomor Invoice</div>
              <div className="text-white font-medium">{invoice.invoice_no || '-'}</div>
            </div>
            <div>
              <div className="text-[#848E9C] text-sm">Tanggal Dibuat</div>
              <div className="text-white font-medium">
                {invoice.created_at ? new Date(invoice.created_at).toLocaleString('id-ID') : '-'}
              </div>
            </div>
            <div>
              <div className="text-[#848E9C] text-sm">Email</div>
              <div className="text-white font-medium">{invoice.email || '-'}</div>
            </div>
            <div>
              <div className="text-[#848E9C] text-sm">Status</div>
              <div className="text-white font-medium">{statusConfig.label}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-[#848E9C] text-sm">Jumlah</div>
              <div className="text-white font-medium">
                {invoice.base_currency === 'IDR' 
                  ? formatRupiah(invoice.amount_input || 0)
                  : `$${invoice.amount_usd?.toFixed(2) || '0.00'}`
                }
              </div>
            </div>
            <div>
              <div className="text-[#848E9C] text-sm">TPC</div>
              <div className="text-white font-medium">{formatNumberID(invoice.tpc_amount || 0)} TPC</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
