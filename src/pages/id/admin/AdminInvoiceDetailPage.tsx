import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, User, Hash, Wallet, CreditCard, FileImage, Check, X, Loader2, ExternalLink, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Invoice {
  id: string;
  invoice_no: string;
  email: string;
  referral_code: string;
  base_currency: string;
  amount_input: number;
  amount_usd: number;
  tpc_amount: number;
  status: string;
  transfer_method: string | null;
  wallet_tpc: string | null;
  proof_url: string | null;
  created_at: string;
  expires_at: string;
  reviewed_at?: string;
  review_note?: string;
  reviewed_by?: string;
}

export default function AdminInvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [currentTime] = useState(new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    if (!id) return;
    const fetchInvoice = async () => {
      // Fetch ONLY by UUID using RPC
      const { data, error } = await supabase.rpc('admin_get_invoice_by_id', { p_id: id });
      
      if (error) {
        console.error('Error fetching invoice by ID:', error);
        toast({ title: 'Invoice tidak ditemukan', variant: 'destructive' });
        navigate('/id/admin/invoices');
        return;
      }
      
      if (!data) {
        toast({ title: 'Invoice tidak ditemukan', variant: 'destructive' });
        navigate('/id/admin/invoices');
        return;
      }
      
      setInvoice(data);
      setIsLoading(false);
    };
    fetchInvoice();
  }, [id, navigate, toast]);

  const handleApprove = async () => {
    if (!invoice) return;
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.rpc('admin_approve_invoice', { p_id: invoice.id });
      
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
        setInvoice(data); // Update UI instantly
        toast({ title: 'Invoice berhasil diapprove!' });
        navigate('/id/admin/invoices');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({ title: 'Gagal approve invoice', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setShowApproveDialog(false);
    }
  };

  const handleReject = async () => {
    if (!invoice) return;
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          status: 'CANCELLED',
          rejected_reason: rejectNote.trim(),
          rejected_at: new Date().toISOString(),
        })
        .eq('id', invoice.id)
        .select()
        .single();
      
      if (error) {
        console.error('Reject error:', error);
        toast({ title: 'Gagal reject invoice', description: error.message, variant: 'destructive' });
        return;
      }
      
      if (data) {
        setInvoice(data); // Update UI instantly
        toast({ title: 'Invoice berhasil ditolak' });
        navigate('/id/admin/invoices');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({ title: 'Gagal reject invoice', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setShowRejectDialog(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID': return { color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/20', label: 'Paid' };
      case 'PENDING_REVIEW': return { color: 'text-amber-400', bgColor: 'bg-amber-400/10', borderColor: 'border-amber-400/20', label: 'Pending Review' };
      case 'UNPAID': return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: 'Unpaid' };
      case 'CANCELLED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Cancelled' };
      default: return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: status };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F0B90B]" />
      </div>
    );
  }

  if (!invoice) return null;
  const statusConfig = getStatusConfig(invoice.status);

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      {/* Header */}
      <div className="bg-[#1E2329] border-b border-[#2B3139] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/id/admin/invoices')} className="flex items-center gap-2 text-[#848E9C] hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Back to Invoices</span>
            </button>
            <div className="h-8 w-px bg-[#2B3139]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center">
                <FileImage className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Invoice Detail</h1>
                <p className="text-[#848E9C] text-xs font-mono">{invoice.invoice_no}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#848E9C] text-sm">
            <Clock className="h-4 w-4" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#848E9C] text-sm">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                  {invoice.status === 'PENDING_REVIEW' && <AlertTriangle className="h-4 w-4" />}
                  {invoice.status === 'PAID' && <Check className="h-4 w-4" />}
                  {invoice.status === 'CANCELLED' && <X className="h-4 w-4" />}
                  {statusConfig.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2B3139]">
                <div>
                  <div className="text-[#848E9C] text-xs mb-1">Created At</div>
                  <div className="text-white text-sm">{new Date(invoice.created_at).toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <div className="text-[#848E9C] text-xs mb-1">Expires At</div>
                  <div className="text-white text-sm">{new Date(invoice.expires_at).toLocaleString('id-ID')}</div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#F0B90B]" />
                User Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center">
                    <User className="h-5 w-5 text-[#848E9C]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#848E9C] text-xs mb-1">Email</div>
                    <div className="text-white font-medium">{invoice.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center">
                    <Hash className="h-5 w-5 text-[#848E9C]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#848E9C] text-xs mb-1">Referral Code</div>
                    <div className="text-white font-mono">{invoice.referral_code}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-[#F0B90B]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#848E9C] text-xs mb-1">TPC Wallet Address</div>
                    {invoice.wallet_tpc ? (
                      <div className="bg-[#2B3139]/50 rounded-lg p-3 border border-[#F0B90B]/20">
                        <div className="flex items-center justify-between">
                          <div className="text-white font-mono text-sm break-all flex-1 mr-2">{invoice.wallet_tpc}</div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(invoice.wallet_tpc!);
                              // You could add a toast notification here
                            }}
                            className="p-2 rounded-lg bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 text-[#F0B90B] transition-colors flex-shrink-0"
                            title="Copy wallet address"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <a 
                            href={`https://explorer.solana.com/address/${invoice.wallet_tpc}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-[#F0B90B] hover:text-[#F8D56B] transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View on Solana Explorer
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[#848E9C] italic">No wallet address provided</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#F0B90B]" />
                Payment Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-[#848E9C]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#848E9C] text-xs mb-1">Transfer Method</div>
                    <div className="text-white font-medium">{invoice.transfer_method || '-'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2B3139]">
                  <div>
                    <div className="text-[#848E9C] text-xs mb-1">Amount ({invoice.base_currency})</div>
                    <div className="text-white font-bold text-lg">
                      {invoice.base_currency === 'IDR' ? formatRupiah(invoice.amount_input) : `$${invoice.amount_usd?.toFixed(2)}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#848E9C] text-xs mb-1">USD Value</div>
                    <div className="text-white font-medium">${invoice.amount_usd?.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof of Payment */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FileImage className="h-5 w-5 text-[#F0B90B]" />
                Proof of Payment
              </h3>
              {invoice.proof_url ? (
                <div className="space-y-4">
                  <div className="bg-[#2B3139]/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#848E9C] text-sm">File URL:</span>
                      <a 
                        href={invoice.proof_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-[#F0B90B] hover:text-[#F8D56B] transition-colors text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in New Tab
                      </a>
                    </div>
                    
                    {invoice.proof_url.includes('.pdf') ? (
                      <div className="text-center py-8 bg-[#2B3139]/50 rounded-xl border-2 border-dashed border-[#F0B90B]/30">
                        <FileImage className="h-12 w-12 text-[#F0B90B] mx-auto mb-3" />
                        <p className="text-white font-medium mb-2">PDF Document</p>
                        <a 
                          href={invoice.proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0B90B] text-black rounded-lg font-medium hover:bg-[#F8D56B] transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View PDF Proof
                        </a>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={invoice.proof_url} 
                          alt="Proof of Payment" 
                          className="w-full rounded-xl border-2 border-[#2B3139] hover:border-[#F0B90B] transition-all duration-300 cursor-pointer"
                          onClick={() => window.open(invoice.proof_url, '_blank')}
                        />
                        <div className="absolute top-2 right-2 bg-black/70 rounded-lg p-2">
                          <ExternalLink className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-[#2B3139]/30 rounded-xl border-2 border-dashed border-[#848E9C]/30">
                  <FileImage className="h-12 w-12 text-[#848E9C] mx-auto mb-3" />
                  <p className="text-[#848E9C] font-medium">No proof of payment uploaded</p>
                  <p className="text-[#848E9C] text-sm mt-1">User hasn't uploaded payment proof yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* TPC Summary Card */}
            <div className="bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0B90B] flex items-center justify-center">
                  <Coins className="h-6 w-6 text-black" />
                </div>
                <div>
                  <div className="text-[#848E9C] text-sm">TPC to Send</div>
                  <div className="text-3xl font-bold text-white">{formatNumberID(invoice.tpc_amount || 0)}</div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#F0B90B]/20">
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C] text-sm">Status</span>
                  <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {invoice.status === 'PENDING_REVIEW' && (
              <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Admin Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowApproveDialog(true)} 
                    disabled={isProcessing || invoice.status !== 'PENDING_REVIEW'} 
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Approve & Send TPC</>}
                  </button>
                  <button 
                    onClick={() => setShowRejectDialog(true)} 
                    disabled={isProcessing || invoice.status !== 'PENDING_REVIEW'} 
                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <X className="h-5 w-5" /> Reject Invoice
                  </button>
                </div>
              </div>
            )}

            {/* Review History */}
            {(invoice.reviewed_at || invoice.review_note) && (
              <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Review History</h3>
                <div className="space-y-3 text-sm">
                  {invoice.reviewed_at && (
                    <div className="flex items-center gap-2 text-[#848E9C]">
                      <Calendar className="h-4 w-4" />
                      <span>Reviewed: {new Date(invoice.reviewed_at).toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {invoice.review_note && (
                    <div className="bg-[#2B3139] rounded-lg p-3">
                      <div className="text-[#848E9C] text-xs mb-1">Note</div>
                      <div className="text-white">{invoice.review_note}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="bg-[#1E2329] border-[#2B3139]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription className="text-[#848E9C]">
              Tindakan ini akan menyetujui invoice dan menandainya sebagai lunas. TPC akan dikirim ke wallet user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2B3139] border-[#3A3F47] text-white hover:bg-[#3A3F47]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-emerald-500 hover:bg-emerald-600 text-white">Yes, Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="bg-[#1E2329] border-[#2B3139]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Reject Invoice</AlertDialogTitle>
            <AlertDialogDescription className="text-[#848E9C]">
              Masukkan alasan penolakan invoice ini. Alasan akan disimpan untuk audit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea 
            placeholder="Masukkan alasan penolakan..." 
            value={rejectNote} 
            onChange={(e) => setRejectNote(e.target.value)} 
            className="bg-[#2B3139] border-[#3A3F47] text-white mb-4" 
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2B3139] border-[#3A3F47] text-white hover:bg-[#3A3F47]">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject} 
              disabled={!rejectNote.trim()}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
