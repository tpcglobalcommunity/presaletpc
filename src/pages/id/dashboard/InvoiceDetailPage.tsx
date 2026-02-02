import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Coins, Wallet, Upload, Check, Loader2, 
  Copy, AlertCircle, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { PROOF_BUCKET } from '@/config/storage';
import { generateProofFilePath } from '@/lib/storage/getProofPublicUrl';

type TransferMethod = 'USDC' | 'SOL' | 'BCA' | 'OVO';

interface Invoice {
  id: string;
  invoice_no: string;
  email: string;
  referral_code: string;
  base_currency: string;
  amount_input: number;
  amount_usd: number;
  tpc_amount: number;
  status: 'UNPAID' | 'PENDING_REVIEW' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  transfer_method: TransferMethod | null;
  wallet_tpc: string | null;
  proof_url: string | null;
  created_at: string;
  expires_at: string;
  rejected_reason?: string;
  rejected_at?: string;
}

const TRANSFER_INFO: Record<TransferMethod, { label: string; destination: string; hint: string }> = {
  USDC: { 
    label: 'USDC (Solana)', 
    destination: 'GkXn6...p8F2q', 
    hint: 'Network: Solana' 
  },
  SOL: { 
    label: 'SOL', 
    destination: 'GkXn6...p8F2q', 
    hint: 'Network: Solana' 
  },
  BCA: { 
    label: 'BCA Transfer', 
    destination: '8810xxxx4567', 
    hint: 'a.n. PT Token Prima' 
  },
  OVO: { 
    label: 'OVO', 
    destination: '0812xxxx5678', 
    hint: 'a.n. TPC Official' 
  },
};

export default function InvoiceDetailPage() {
  const { invoiceNo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [transferMethod, setTransferMethod] = useState<TransferMethod | null>(null);
  const [walletTPC, setWalletTPC] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!invoiceNo || !user) return;

    const fetchInvoice = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_no', invoiceNo)
        .maybeSingle();

      if (error) {
        console.error('Error fetching invoice:', error);
        toast({ title: 'Invoice tidak ditemukan', variant: 'destructive' });
        navigate('/id/dashboard');
        return;
      }

      setInvoice(data);
      if (data?.transfer_method) setTransferMethod(data.transfer_method as TransferMethod);
      if (data?.wallet_tpc) setWalletTPC(data.wallet_tpc);
      setIsLoading(false);
    };

    fetchInvoice();
  }, [invoiceNo, user, navigate, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Format file tidak valid', description: 'Gunakan JPG, PNG, atau PDF', variant: 'destructive' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File terlalu besar', description: 'Maksimal 5MB', variant: 'destructive' });
      return;
    }

    setProofFile(file);
    if (file.type.startsWith('image/')) {
      setProofPreview(URL.createObjectURL(file));
    } else {
      setProofPreview(null);
    }
  };

  const isValidSolanaAddress = (address: string) => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  const canSubmit = transferMethod && walletTPC && isValidSolanaAddress(walletTPC) && (proofFile || invoice?.proof_url);

  const handleSubmit = async () => {
    if (!canSubmit || !invoice || !user) return;

    setIsSubmitting(true);
    try {
      let proofPath = invoice.proof_url; // This column now stores path only

      // Upload proof if new file selected
      if (proofFile) {
        const filePath = generateProofFilePath(invoice.id, user.id, proofFile);

        const { error: uploadError } = await supabase.storage
          .from(PROOF_BUCKET)
          .upload(filePath, proofFile, { 
            upsert: true, 
            contentType: proofFile.type 
          });

        if (uploadError) throw uploadError;

        // Store only the path, not the full URL
        proofPath = filePath;
      }

      // Update invoice
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          transfer_method: transferMethod,
          wallet_tpc: walletTPC,
          proof_url: proofPath,
          status: 'PENDING_REVIEW',
        })
        .eq('id', invoice.id);

      if (updateError) throw updateError;

      toast({ title: 'Konfirmasi berhasil dikirim!' });
      navigate('/id/dashboard');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({ 
        title: 'Gagal mengirim konfirmasi', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
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

  if (!invoice) {
    return null;
  }

  const isPending = invoice.status === 'PENDING_REVIEW';
  const isPaid = invoice.status === 'PAID';

  return (
    <div className="mobile-container pt-4">
      {/* Header */}
      <button
        onClick={() => navigate('/id/dashboard')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Kembali</span>
      </button>

      <h1 className="text-title mb-1">Konfirmasi Pembayaran</h1>
      <p className="text-sm text-muted-foreground mb-6">{invoice.invoice_no}</p>

      {/* Status Banner */}
      {isPending && (
        <div className="bg-info/10 border border-info/30 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-info animate-spin" />
          <div>
            <div className="font-medium text-info">Menunggu Review</div>
            <div className="text-xs text-muted-foreground">Admin sedang memproses pembayaran Anda</div>
          </div>
        </div>
      )}

      {isPaid && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-success" />
          <div>
            <div className="font-medium text-success">Pembayaran Berhasil</div>
            <div className="text-xs text-muted-foreground">TPC akan dikirim ke wallet Anda</div>
          </div>
        </div>
      )}

      {/* Invoice Summary */}
      <div className="glass-card mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground">Nominal</span>
          <span className="font-medium">{formatCurrency(Number(invoice.amount_input), invoice.base_currency)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground">Nilai USD</span>
          <span className="font-medium">${Number(invoice.amount_usd).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="font-semibold">TPC yang Didapat</span>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold text-primary">{formatNumberID(Number(invoice.tpc_amount))}</span>
          </div>
        </div>

        {invoice.status === 'UNPAID' && (
          <div className="flex items-center gap-2 mt-4 text-xs text-warning">
            <Clock className="h-4 w-4" />
            <span>Berlaku hingga {format(new Date(invoice.expires_at), 'd MMM yyyy, HH:mm', { locale: id })}</span>
          </div>
        )}
      </div>

      {/* Only show form if UNPAID */}
      {invoice.status === 'UNPAID' && (
        <>
          {/* Transfer Method Selection */}
          <div className="mb-6">
            <label className="input-label">Metode Transfer</label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(TRANSFER_INFO) as TransferMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setTransferMethod(method)}
                  className={`currency-pill ${transferMethod === method ? 'active' : ''}`}
                >
                  <div className="font-semibold text-sm">{TRANSFER_INFO[method].label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Destination */}
          {transferMethod && (
            <div className="glass-card mb-6 animate-fade-in">
              <div className="text-sm text-muted-foreground mb-2">Transfer ke:</div>
              <div className="font-mono font-bold text-lg mb-1">{TRANSFER_INFO[transferMethod].destination}</div>
              <div className="text-xs text-muted-foreground">{TRANSFER_INFO[transferMethod].hint}</div>
            </div>
          )}

          {/* Wallet TPC Input */}
          <div className="mb-6">
            <label className="input-label">Wallet TPC (Solana)</label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Alamat wallet Solana Anda"
                value={walletTPC}
                onChange={(e) => setWalletTPC(e.target.value.trim())}
                className="input-gold pl-12 font-mono text-sm"
              />
            </div>
            {walletTPC && !isValidSolanaAddress(walletTPC) && (
              <div className="flex items-center gap-2 mt-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Alamat wallet tidak valid</span>
              </div>
            )}
          </div>

          {/* Reject Reason Display */}
          {invoice.status === 'CANCELLED' && (
            <div className="mb-8">
              <div className="glass-card p-6 border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Invoice Ditolak</h3>
                </div>
                {invoice.rejected_reason ? (
                  <div>
                    <p className="text-white mb-2">Alasan Penolakan:</p>
                    <p className="text-[#848E9C] bg-[#2B3139]/50 rounded p-3">{invoice.rejected_reason}</p>
                    {invoice.rejected_at && (
                      <p className="text-[#848E9C] text-xs mt-2">
                        Ditolak pada: {new Date(invoice.rejected_at).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[#848E9C]">Tidak ada alasan tersimpan</p>
                )}
              </div>
            </div>
          )}

          {/* Proof Upload - Disabled if cancelled */}
          {invoice.status !== 'CANCELLED' && (
            <div className="mb-8">
              <label className="input-label">Bukti Transfer</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {proofPreview ? (
              <div className="relative">
                <img
                  src={proofPreview}
                  alt="Proof preview"
                  className="w-full h-48 object-cover rounded-xl border border-border"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-background/80 backdrop-blur px-3 py-1 rounded-lg text-sm"
                >
                  Ganti
                </button>
              </div>
            ) : proofFile ? (
              <div className="glass-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-sm truncate max-w-[200px]">{proofFile.name}</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary text-sm"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <div className="font-medium">Upload Bukti Transfer</div>
                  <div className="text-xs text-muted-foreground">JPG, PNG, atau PDF (max 5MB)</div>
                </div>
              </button>
            )}
          </div>
            )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="btn-gold w-full text-lg py-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Check className="h-6 w-6" />
                Kirim Konfirmasi Pembayaran
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
