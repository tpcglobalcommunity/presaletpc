import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';

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
  transfer_method?: string;
  wallet_tpc?: string;
  proof_url?: string;
  proof_uploaded_at?: string;
  submitted_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_note?: string;
  rejected_reason?: string;
  rejected_at?: string;
  tpc_sent: boolean;
  tpc_tx_hash?: string;
}

export default function AdminInvoiceDetailPage() {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceNo) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('invoice_no', invoiceNo)
          .single();

        if (error) {
          console.error('Error fetching invoice:', error);
          return;
        }

        setInvoice(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNo]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID': return { color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/20', label: 'Lunas', icon: CheckCircle };
      case 'PENDING_REVIEW': return { color: 'text-amber-400', bgColor: 'bg-amber-400/10', borderColor: 'border-amber-400/20', label: 'Menunggu Verifikasi', icon: Clock };
      case 'REJECTED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Ditolak', icon: XCircle };
      case 'UNPAID': return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: 'Belum Bayar', icon: FileText };
      default: return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: status, icon: FileText };
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse rounded-lg h-8 w-8 border-b-2 border-[#F0B90B] mx-auto"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Invoice Tidak Ditemukan</h1>
          <p className="text-[#848E9C]">Invoice dengan nomor "{invoiceNo}" tidak ditemukan.</p>
          <Button
            onClick={() => navigate('/id/admin/invoices')}
            className="mt-4 bg-[#F0B90B] hover:bg-[#F8D56B] text-black"
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
        <div className="animate-pulse rounded-lg h-8 w-8 border-b-2 border-[#F0B90B] mx-auto"></div>
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
          onClick={() => navigate('/id/admin/invoices')}
          className="text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold text-white mb-2">Detail Invoice</h1>
        <p className="text-[#848E9C]">{invoice.invoice_no}</p>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card className="bg-[#1E2329] border border-[#2B3139] lg:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[#848E9C] text-sm">Nomor Invoice</div>
                <div className="text-white font-medium">{invoice.invoice_no}</div>
              </div>
              <div>
                <div className="text-[#848E9C] text-sm">Status</div>
                <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              <div>
                <div className="text-[#848E9C] text-sm">Email</div>
                <div className="text-white font-medium">{invoice.email}</div>
              </div>
              <div>
                <div className="text-[#848E9C] text-sm">Tanggal Dibuat</div>
                <div className="text-white font-medium">{new Date(invoice.created_at).toLocaleDateString('id-ID')}</div>
              </div>
            </div>
            </div>

            {/* Financial Details */}
            <div className="mt-6 pt-6 border-t border-[#2B3139]">
              <h3 className="text-white font-medium mb-4">Detail Pembayaran</h3>
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
                </div>
              </div>
              <div>
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
        </div>
      </div>
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
          <div>
            <div className="text-[#848E9C] text-sm">TPC</div>
            <div className="text-white font-medium">{formatNumberID(invoice.tpc_amount)} TPC</div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Actions */}
    <div className="lg:col-span-3">
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
