import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';
import { getProofPublicUrl } from '@/lib/storage/getProofPublicUrl';

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
  rejected_by?: string;
}

export default function AdminInvoiceDetailPage() {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      // HARD GUARD: Only proceed if invoiceNo exists and is not undefined
      if (!invoiceNo || invoiceNo === 'undefined') {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('invoice_no', invoiceNo)
          .single();

        if (error) {
          console.error('Error fetching invoice:', error);
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!data) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        setInvoice(data);
      } catch (error) {
        console.error('Unexpected error:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNo]);

  const handleApprove = async () => {
    if (!invoice) return;
    
    setIsApproving(true);
    try {
      const { data, error } = await supabase.rpc('admin_approve_invoice', { p_id: invoice.invoice_no });
      
      if (error) {
        if (error.message.includes('Forbidden')) {
          toast({ title: 'Akses ditolak', description: 'Anda tidak memiliki hak akses admin', variant: 'destructive' });
        } else if (error.message.includes('Not authenticated')) {
          toast({ title: 'Harus login', description: 'Sesi Anda telah berakhir', variant: 'destructive' });
        } else {
          toast({ title: 'Gagal approve invoice', description: error.message, variant: 'destructive' });
        }
        return;
      }
      
      if (data) {
        setInvoice(data);
        toast({ title: 'Invoice berhasil diapprove!' });
        
        // Send approval email notification
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice-approved-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ invoice_no: invoice.invoice_no }),
          });
          
          if (!response.ok) {
            console.error('Failed to send approval email:', await response.text());
          } else {
            console.log('Approval email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
          // Don't show error to user as approval was successful
        }
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast({ title: 'Terjadi kesalahan', variant: 'destructive' });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!invoice) return;
    
    setIsRejecting(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          status: 'CANCELLED',
          rejected_reason: rejectNote.trim(),
          rejected_at: new Date().toISOString(),
        })
        .eq('invoice_no', invoice.invoice_no)
        .select()
        .single();
      
      if (error) {
        console.error('Reject error:', error);
        toast({ title: 'Gagal reject invoice', description: error.message, variant: 'destructive' });
        return;
      }
      
      if (data) {
        setInvoice(data);
        toast({ title: 'Invoice berhasil ditolak' });
        setRejectDialogOpen(false);
        setRejectNote('');
      }
    } catch (error) {
      console.error('Reject error:', error);
      toast({ title: 'Terjadi kesalahan', variant: 'destructive' });
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID': return { color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/20', label: 'Lunas', icon: CheckCircle };
      case 'PENDING_REVIEW': return { color: 'text-amber-400', bgColor: 'bg-amber-400/10', borderColor: 'border-amber-400/20', label: 'Review', icon: AlertTriangle };
      case 'UNPAID': return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: 'Belum Bayar', icon: Clock };
      case 'CANCELLED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Dibatalkan', icon: XCircle };
      default: return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: status, icon: FileText };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-white mb-2">Invoice Tidak Ditemukan</h2>
          <p className="text-[#848E9C] mb-4">Invoice yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Button
            onClick={() => navigate('../invoices')}
            className="bg-[#F0B90B] hover:bg-[#F8D56B] text-white"
          >
            Kembali ke Daftar Invoice
          </Button>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  const statusConfig = getStatusConfig(invoice.status);
  const Icon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('../invoices')}
          className="text-[#848E9C] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Detail Invoice</h1>
          <p className="text-[#848E9C]">{invoice.invoice_no}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Informasi Invoice
                <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[#848E9C] text-sm">Email</div>
                  <div className="text-white font-medium">{invoice.email}</div>
                </div>
                <div>
                  <div className="text-[#848E9C] text-sm">Tanggal</div>
                  <div className="text-white font-medium">
                    {new Date(invoice.created_at).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2B3139]">
                <div>
                  <div className="text-[#848E9C] text-sm">Nominal</div>
                  <div className="text-white font-bold text-lg">
                    {invoice.base_currency === 'IDR' 
                      ? formatRupiah(invoice.amount_input)
                      : `$${invoice.amount_usd?.toFixed(2)}`
                    }
                  </div>
                </div>
                <div>
                  <div className="text-[#848E9C] text-sm">TPC</div>
                  <div className="text-white font-bold text-lg text-[#F0B90B]">
                    {formatNumberID(invoice.tpc_amount)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {(invoice.transfer_method || invoice.wallet_tpc) && (
            <Card className="bg-[#1E2329] border-[#2B3139]">
              <CardHeader>
                <CardTitle className="text-white">Informasi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoice.transfer_method && (
                  <div>
                    <div className="text-[#848E9C] text-sm">Metode Transfer</div>
                    <div className="text-white font-medium">{invoice.transfer_method}</div>
                  </div>
                )}
                {invoice.wallet_tpc && (
                  <div>
                    <div className="text-[#848E9C] text-sm">Wallet TPC</div>
                    <div className="text-white font-mono text-sm bg-[#2B3139]/50 rounded p-2">
                      {invoice.wallet_tpc}
                    </div>
                  </div>
                )}
                {invoice.submitted_at && (
                  <div>
                    <div className="text-[#848E9C] text-sm">Waktu Submit</div>
                    <div className="text-white font-medium">
                      {new Date(invoice.submitted_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reject Reason */}
          {invoice.status === 'CANCELLED' && invoice.rejected_reason && (
            <Card className="bg-[#1E2329] border-[#2B3139]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  Alasan Penolakan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-white mb-2">{invoice.rejected_reason}</p>
                  {invoice.rejected_at && (
                    <p className="text-[#848E9C] text-xs">
                      Ditolak pada: {new Date(invoice.rejected_at).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Proof Upload */}
          {invoice.proof_url && (
            <Card className="bg-[#1E2329] border-[#2B3139]">
              <CardHeader>
                <CardTitle className="text-white">Bukti Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#2B3139]/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#848E9C] text-sm">File terupload</span>
                    {invoice.proof_uploaded_at && (
                      <span className="text-[#848E9C] text-xs">
                        {new Date(invoice.proof_uploaded_at).toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const proofUrl = getProofPublicUrl(invoice.proof_url);
                      if (proofUrl) window.open(proofUrl, '_blank');
                    }}
                    className="border-[#F0B90B]/50 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Lihat Bukti
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Info */}
          {(invoice.reviewed_by || invoice.reviewed_at || invoice.review_note) && (
            <Card className="bg-[#1E2329] border-[#2B3139]">
              <CardHeader>
                <CardTitle className="text-white">Informasi Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoice.reviewed_by && (
                  <div>
                    <div className="text-[#848E9C] text-sm">Reviewed By</div>
                    <div className="text-white font-mono text-sm">{invoice.reviewed_by}</div>
                  </div>
                )}
                {invoice.reviewed_at && (
                  <div>
                    <div className="text-[#848E9C] text-sm">Waktu Review</div>
                    <div className="text-white font-medium">
                      {new Date(invoice.reviewed_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                )}
                {invoice.review_note && (
                  <div>
                    <div className="text-[#848E9C] text-sm">Catatan</div>
                    <div className="text-white bg-[#2B3139]/50 rounded p-2">
                      {invoice.review_note}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader>
              <CardTitle className="text-white">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoice.status === 'PENDING_REVIEW' && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isApproving ? 'Menyetujui...' : 'Approve'}
                  </Button>
                  
                  <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1E2329] border-[#2B3139]">
                      <DialogHeader>
                        <DialogTitle className="text-white">Reject Invoice</DialogTitle>
                        <DialogDescription className="text-[#848E9C]">
                          Masukkan alasan penolakan invoice ini. Alasan akan disimpan untuk audit.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-[#848E9C] text-sm mb-2 block">Alasan Penolakan</label>
                          <Textarea
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="Masukkan alasan penolakan..."
                            className="bg-[#2B3139] border-[#3A3F47] text-white placeholder-[#848E9C]"
                            rows={3}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <div className="flex gap-3 w-full">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setRejectDialogOpen(false);
                              setRejectNote('');
                            }}
                            className="flex-1 border-[#2B3139] text-[#848E9C]"
                          >
                            Batal
                          </Button>
                          <Button
                            onClick={handleReject}
                            disabled={isRejecting || !rejectNote.trim()}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                          >
                            {isRejecting ? 'Menolak...' : 'Reject'}
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              
              {invoice.status === 'PAID' && (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-medium">Invoice telah disetujui</p>
                </div>
              )}
              
              {invoice.status === 'CANCELLED' && (
                <div className="text-center py-4">
                  <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                  <p className="text-red-400 font-medium">Invoice telah ditolak</p>
                  {invoice.review_note && (
                    <p className="text-[#848E9C] text-sm mt-2">{invoice.review_note}</p>
                  )}
                </div>
              )}
              
              {invoice.status === 'UNPAID' && (
                <div className="text-center py-4">
                  <Clock className="h-12 w-12 text-[#848E9C] mx-auto mb-2" />
                  <p className="text-[#848E9C] font-medium">Menunggu pembayaran</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
