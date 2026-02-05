import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, ArrowLeft, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID, formatRupiah } from '@/lib/number';

interface Invoice {
  id: string;
  invoice_no: string;
  status: string;
  amount_input: number;
  base_currency: string;
  amount_usd: number;
  tpc_amount: number;
  created_at: string;
  email: string;
  proof_url?: string;
  wallet_tpc?: string;
  tpc_sent?: boolean;
  tpc_tx_hash?: string;
  rejected_reason?: string;
  rejected_at?: string;
}

export default function AdminInvoiceDetailPage() {
  const navigate = useNavigate();
  const { lang, invoiceKey } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Debug: Component mounted
  console.debug('[ADMIN_INVOICE_DETAIL] mounted', { invoiceKey, path: window.location.pathname });

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
          console.error('[ADMIN_INVOICE_DETAIL] primary query error:', error);
          // Try fallback
          const fallbackMode = mode === 'id' ? 'invoice_no' : 'id';
          console.debug('[ADMIN_INVOICE_DETAIL] trying fallback', { fallbackMode });
          
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
          console.debug('[ADMIN_INVOICE_DETAIL] primary null, trying fallback', { fallbackMode });
          
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
          <FileText className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Invoice Tidak Ditemukan</h2>
          <p className="text-[#848E9C] mb-4">
            Invoice dengan ID atau Nomor Invoice yang diminta tidak ditemukan.
          </p>
          <Button
            onClick={() => navigate(`/${lang}/admin/invoices`)}
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

  const statusConfig = getStatusConfig(invoice.status);
  const Icon = statusConfig.icon;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/${lang}/admin/invoices`)}
          className="text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Invoice
        </Button>
        <h1 className="text-2xl font-bold text-white mb-2">Detail Invoice</h1>
        <p className="text-[#848E9C]">Kelola detail invoice pembelian TPC</p>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
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
                  <div className="text-white font-medium">{invoice.invoice_no}</div>
                </div>
                <div>
                  <div className="text-[#848E9C] text-sm">Tanggal Dibuat</div>
                  <div className="text-white font-medium">
                    {new Date(invoice.created_at).toLocaleString('id-ID')}
                  </div>
                </div>
                <div>
                  <div className="text-[#848E9C] text-sm">Email</div>
                  <div className="text-white font-medium">{invoice.email}</div>
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
                      ? formatRupiah(invoice.amount_input)
                      : `$${invoice.amount_usd?.toFixed(2)}`
                    }
                  </div>
                </div>
                <div>
                  <div className="text-[#848E9C] text-sm">TPC</div>
                  <div className="text-white font-medium">{formatNumberID(invoice.tpc_amount)} TPC</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proof Section */}
          <Card className="bg-[#1E2329] border border-[#2B3139]">
            <CardHeader>
              <CardTitle>Bukti Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.proof_url ? (
                <div className="space-y-4">
                  <div className="bg-[#2B3139] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Bukti Pembayaran</span>
                      <ExternalLink className="h-4 w-4 text-[#F0B90B]" />
                    </div>
                    <a 
                      href={invoice.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black rounded-lg p-3"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Lihat Bukti
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
                  <p className="text-[#848E9C]">Belum ada bukti pembayaran</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* TPC Info */}
          <Card className="bg-[#1E2329] border border-[#2B3139]">
            <CardHeader>
              <CardTitle>Informasi TPC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-[#848E9C] text-sm">Wallet Tujuan</div>
                  <div className="text-white font-mono text-sm">
                    {invoice.wallet_tpc || 'Belum diatur'}
                  </div>
                </div>
                <div>
                  <div className="text-[#848E9C] text-sm">TPC Terkirim</div>
                  <div className="text-white font-medium">
                    {invoice.tpc_sent ? (
                      <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sudah
                      </Badge>
                    ) : (
                      <Badge className="bg-[#848E9C]/10 text-[#848E9C] border-[#848E9C]/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Belum
                      </Badge>
                    )}
                  </div>
                </div>
                {invoice.tpc_tx_hash && (
                  <div className="mt-2">
                    <div className="text-[#848E9C] text-sm">Transaction Hash</div>
                    <div className="text-white font-mono text-xs">{invoice.tpc_tx_hash}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-[#1E2329] border border-[#2B3139]">
            <CardHeader>
              <CardTitle>Aksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.status === 'PENDING_REVIEW' && (
                  <div className="space-y-3">
                    <Button className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black">
                      Approve Pembayaran
                    </Button>
                    <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-600">
                      Reject Pembayaran
                    </Button>
                  </div>
                )}
              
                {invoice.status === 'REJECTED' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Pembayaran Ditolak</h4>
                    <p className="text-red-200 text-sm">{invoice.rejected_reason || 'Tidak ada alasan'}</p>
                    <p className="text-red-300 text-xs mt-2">
                      Ditolak pada: {invoice.rejected_at ? new Date(invoice.rejected_at).toLocaleString('id-ID') : '-'}
                    </p>
                  </div>
                )}

                {invoice.status === 'PAID' && (
                  <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Pembayaran Selesai</h4>
                    <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
                    <p className="text-emerald-200 text-sm">Pembayaran telah diverifikasi dan selesai.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
