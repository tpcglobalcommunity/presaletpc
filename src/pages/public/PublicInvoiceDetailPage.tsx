import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Upload, ExternalLink, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatIdr, formatUsdc } from '@/lib/formatters';
import TokenMintInfoCard from '@/components/trust/TokenMintInfoCard';

interface PublicInvoice {
  invoice_no: string;
  status: string;
  amount_input: number;
  amount_usd: number;
  tpc_amount: number;
  base_currency: string;
  created_at: string;
  approved_at: string | null;
  tpc_tx_hash: string | null;
  tpc_sent: boolean;
  wallet_tpc: string | null;
}

export default function PublicInvoiceDetailPage() {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SAFETY NET: Guard against invalid invoice_no
  if (!invoiceNo || invoiceNo === 'undefined' || invoiceNo === 'null' || invoiceNo.trim() === '') {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1E2329] border-[#2B3139]">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Invoice Tidak Valid</h2>
            <p className="text-[#848E9C] mb-6">
              ID invoice tidak valid atau tidak ditemukan.
            </p>
            <Button 
              asChild
              className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black"
            >
              <Link to="/id">Kembali ke Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceNo) {
        setError('Invoice number is required');
        setLoading(false);
        return;
      }

      try {
        const { data, error: rpcError } = await supabase.rpc('get_public_invoice_by_token', {
          p_invoice_no: invoiceNo
        });

        if (rpcError) {
          setError('Invoice not found');
          return;
        }

        if (!data || !Array.isArray(data) || data.length === 0) {
          setError('Invoice not found');
          return;
        }

        setInvoice(data[0]);
      } catch (err) {
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNo]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'EXPIRED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const isExpired = () => {
    if (!invoice) return false;
    const createdAt = new Date(invoice.created_at);
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    return new Date() > expiresAt;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <div className="text-white">Loading invoice...</div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center p-4">
        <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl max-w-md w-full">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-white text-xl font-semibold mb-2">Invoice Not Found</h1>
            <p className="text-[#848E9C] mb-4">{error || 'Invoice not found'}</p>
            <Link to="/id">
              <Button className="bg-[#F0B90B] hover:bg-[#E0A800] text-[#1A1B22] font-medium">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayStatus = isExpired() ? 'EXPIRED' : invoice.status;

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      <Helmet>
        <title>Invoice {invoice.invoice_no} - TPC Global</title>
        <meta name="description" content={`Invoice ${invoice.invoice_no} - TPC Global`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/id" className="inline-flex items-center text-[#848E9C] hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
            <CardHeader className="bg-[#1A1B22]/50 border-b border-[#1F2A33]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl">Invoice Details</CardTitle>
                <Badge className={getStatusColor(displayStatus)}>
                  {getStatusIcon(displayStatus)}
                  <span className="ml-2">{displayStatus}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Invoice Number */}
              <div className="bg-[#1E2329] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#848E9C] text-sm">Invoice Number</span>
                  <span className="text-white font-mono font-semibold">{invoice.invoice_no}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#1E2329] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#848E9C] text-sm">Payment Amount</span>
                  </div>
                  <div className="text-white font-semibold">
                    {invoice.base_currency === 'IDR' 
                      ? formatIdr(invoice.amount_input)
                      : formatUsdc(invoice.amount_input)
                    }
                  </div>
                </div>

                <div className="bg-[#1E2329] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#848E9C] text-sm">TPC Amount</span>
                  </div>
                  <div className="text-white font-semibold">
                    {invoice.tpc_amount?.toLocaleString() || 0} TPC
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              {invoice.wallet_tpc && (
                <div className="bg-[#1E2329] rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Wallet className="h-4 w-4 text-[#F0B90B] mr-2" />
                    <span className="text-[#848E9C] text-sm">TPC Wallet Address</span>
                  </div>
                  <div className="text-white font-mono text-sm break-all">
                    {invoice.wallet_tpc}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#1E2329] rounded-xl p-4">
                  <span className="text-[#848E9C] text-sm">Created At</span>
                  <div className="text-white font-medium">
                    {new Date(invoice.created_at).toLocaleString('id-ID')}
                  </div>
                </div>

                {invoice.approved_at && (
                  <div className="bg-[#1E2329] rounded-xl p-4">
                    <span className="text-[#848E9C] text-sm">Approved At</span>
                    <div className="text-white font-medium">
                      {new Date(invoice.approved_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction Hash */}
              {invoice.tpc_tx_hash && (
                <div className="bg-[#1E2329] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#848E9C] text-sm">Transaction Hash</span>
                    <a
                      href={`https://solscan.io/tx/${invoice.tpc_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F0B90B] hover:text-[#F8D56B] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="text-white font-mono text-sm break-all">
                    {invoice.tpc_tx_hash}
                  </div>
                </div>
              )}

              {/* Status-specific content */}
              {displayStatus === 'APPROVED' && invoice.tpc_sent && (
                <>
                  <Alert className="bg-green-500/10 border-green-500/50">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-400">
                      <strong>TPC sudah dikirim ke wallet Anda</strong>
                      <br />
                      Token TPC telah berhasil dikirim ke alamat wallet yang tertera.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-[#848E9C] text-sm mb-3">TPC dikirim menggunakan token resmi berikut:</p>
                      <TokenMintInfoCard compact={true} showDisclaimer={false} />
                    </div>
                  </div>
                </>
              )}

              {displayStatus === 'PENDING' && !isExpired() && (
                <div className="space-y-4">
                  <Alert className="bg-yellow-500/10 border-yellow-500/50">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-400">
                      <strong>Menunggu Pembayaran</strong>
                      <br />
                      Silakan upload bukti transfer untuk melanjutkan proses.
                    </AlertDescription>
                  </Alert>

                  <div className="text-center">
                    <Link to={`/id/login?redirect=/member/invoices/${invoice.invoice_no}`}>
                      <Button className="bg-[#F0B90B] hover:bg-[#E0A800] text-[#1A1B22] font-medium">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Bukti Transfer
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {displayStatus === 'EXPIRED' && (
                <Alert className="bg-gray-500/10 border-gray-500/50">
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                  <AlertDescription className="text-gray-400">
                    <strong>Invoice Kadaluarsa</strong>
                    <br />
                    Invoice ini telah kadaluarsa. Silakan buat invoice baru.
                  </AlertDescription>
                </Alert>
              )}

              {displayStatus === 'REJECTED' && (
                <Alert className="bg-red-500/10 border-red-500/50">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    <strong>Invoice Ditolak</strong>
                    <br />
                    Pembayaran Anda tidak dapat diproses. Silakan hubungi admin.
                  </AlertDescription>
                </Alert>
              )}

              {/* CTA to Member Area */}
              <div className="text-center pt-4 border-t border-[#1F2A33]">
                <p className="text-[#848E9C] mb-4">Lihat detail lengkap di Member Area</p>
                <Link to="/id/login">
                  <Button variant="outline" className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-[#1A1B22]">
                    Login ke Member Area
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
