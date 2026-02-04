import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Clock, CheckCircle, XCircle, AlertTriangle, Wallet, CreditCard, ExternalLink, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatRupiah, formatNumberID } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDestination } from '@/config/paymentDestinations';

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
  transfer_method?: string;
  wallet_tpc?: string;
  proof_url?: string;
  submitted_at?: string;
  rejected_reason?: string;
  rejected_at?: string;
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

const transferMethods = {
  BCA: { name: 'BCA Transfer', account: '1234567890', holder: 'PT TPC GLOBAL' },
  OVO: { name: 'OVO', account: '08123456789', holder: 'TPC GLOBAL' },
  USDC: { name: 'USDC', account: 'XYZ...ABC', holder: 'TPC Global Wallet' },
  SOL: { name: 'SOL', account: 'SOL...XYZ', holder: 'TPC Global Wallet' }
};

export default function MemberInvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching invoice:', error);
          toast({ title: 'Invoice tidak ditemukan', variant: 'destructive' });
          navigate('/id/member/invoices');
          return;
        }
        
        if (!data) {
          toast({ title: 'Invoice tidak ditemukan', variant: 'destructive' });
          navigate('/id/member/invoices');
          return;
        }
        
        // Security check: ensure user owns this invoice
        if (data.email !== user.email) {
          toast({ title: 'Akses ditolak', variant: 'destructive' });
          navigate('/id/member/invoices');
          return;
        }
        
        setInvoice(data);
      } catch (error) {
        console.error('Error:', error);
        toast({ title: 'Terjadi kesalahan', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id, navigate, toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !invoice || !user) return;

    setUploadingFile(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${invoice.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invoice-proofs')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      return filePath;
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Gagal upload file', variant: 'destructive' });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      toast({ title: 'Tersalin!', description: 'Berhasil menyalin ke clipboard' });
      setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      toast({ title: 'Gagal menyalin', variant: 'destructive' });
    }
  };

  const handleSubmitProof = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!invoice || !selectedMethod || !walletAddress) {
      toast({ title: 'Mohon lengkapi semua field', variant: 'destructive' });
      return;
    }

    const fileInput = document.getElementById('proof-file') as HTMLInputElement;
    const filePath = await handleFileUpload({ target: fileInput } as React.ChangeEvent<HTMLInputElement>);
    
    if (!filePath) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('member_submit_payment_proof', {
        p_id: invoice.id,
        p_transfer_method: selectedMethod,
        p_wallet_tpc: walletAddress,
        p_proof_url: filePath
      });

      if (error) {
        toast({ title: 'Gagal submit bukti', description: error.message, variant: 'destructive' });
        return;
      }

      if (data) {
        setInvoice(prev => ({ ...prev, ...data }));
        toast({ title: 'Bukti pembayaran berhasil dikirim!' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({ title: 'Terjadi kesalahan', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
      </div>
    );
  }

  if (!invoice) return null;

  const statusConfig = getStatusConfig(invoice.status);
  const Icon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-[#0B0E11] pb-20">
      {/* Header */}
      <div className="bg-[#1E2329] border-b border-[#2B3139] px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/id/member/invoices')} className="text-[#848E9C]">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-white font-semibold text-lg">Detail Invoice</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-white font-medium">{invoice.invoice_no}</div>
              <div className="text-[#848E9C] text-xs">
                {new Date(invoice.created_at).toLocaleString('id-ID')}
              </div>
            </div>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
              <Icon className="h-4 w-4" />
              {statusConfig.label}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#2B3139]">
            <div>
              <div className="text-[#848E9C] text-xs mb-1">Nominal</div>
              <div className="text-white font-bold text-lg">
                {invoice.base_currency === 'IDR' 
                  ? formatRupiah(invoice.amount_input)
                  : `$${invoice.amount_usd?.toFixed(2)}`
                }
              </div>
            </div>
            <div>
              <div className="text-[#848E9C] text-xs mb-1">TPC</div>
              <div className="text-white font-bold text-lg">{formatNumberID(invoice.tpc_amount)}</div>
            </div>
          </div>
        </div>

        {/* Payment Destination Card - Only show for UNPAID or PENDING_REVIEW */}
        {(invoice.status === 'UNPAID' || invoice.status === 'PENDING_REVIEW') && (() => {
          const destination = getDestination(invoice.base_currency);
          return (
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
              <h3 className="text-white font-semibold mb-1">{destination.title}</h3>
              {destination.subtitle && (
                <p className="text-[#848E9C] text-sm mb-4">{destination.subtitle}</p>
              )}
              
              <div className="space-y-3">
                {destination.lines.map((line, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-[#848E9C] text-xs">{line.label}</div>
                      <div className="text-white font-mono text-sm">{line.value}</div>
                    </div>
                    {line.copy && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(line.value, `line-${index}`)}
                        className="text-[#F0B90B] hover:text-[#F0B90B]/80 hover:bg-[#F0B90B]/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {destination.note && (
                <div className="mt-4 pt-3 border-t border-[#2B3139]">
                  <p className="text-[#848E9C] text-xs">{destination.note}</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Payment Proof Upload - Only show for UNPAID */}
        {invoice.status === 'UNPAID' && (
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Upload Bukti Pembayaran</h3>
            
            <form onSubmit={handleSubmitProof} className="space-y-4">
              {/* Transfer Method */}
              <div>
                <label className="text-[#848E9C] text-sm mb-2 block">Metode Transfer</label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger className="bg-[#2B3139] border-[#3A3F47] text-white">
                    <SelectValue placeholder="Pilih metode transfer" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E2329] border-[#2B3139]">
                    {Object.entries(transferMethods).map(([key, method]) => (
                      <SelectItem key={key} value={key} className="text-white">
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transfer Destination */}
              {selectedMethod && transferMethods[selectedMethod] && (
                <div className="bg-[#2B3139]/50 rounded-lg p-3 border border-[#F0B90B]/20">
                  <div className="text-[#848E9C] text-xs mb-1">Transfer ke:</div>
                  <div className="text-white font-mono text-sm">{transferMethods[selectedMethod].account}</div>
                  <div className="text-[#848E9C] text-xs mt-1">{transferMethods[selectedMethod].holder}</div>
                </div>
              )}

              {/* TPC Wallet Address */}
              <div>
                <label className="text-[#848E9C] text-sm mb-2 block">Alamat Wallet TPC (Solana)</label>
                <Input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Masukkan alamat wallet Solana Anda"
                  className="bg-[#2B3139] border-[#3A3F47] text-white placeholder-[#848E9C]"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-[#848E9C] text-sm mb-2 block">Bukti Pembayaran</label>
                <div className="border-2 border-dashed border-[#3A3F47] rounded-lg p-4">
                  <input
                    id="proof-file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="proof-file"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-[#848E9C] mb-2" />
                    <span className="text-[#848E9C] text-sm">Klik untuk upload bukti</span>
                    <span className="text-[#848E9C] text-xs">JPG, PNG, PDF max 5MB</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || uploadingFile || !selectedMethod || !walletAddress}
                className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-medium"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
              </Button>
            </form>
          </div>
        )}

        {/* Proof Preview - Show for non-UNPAID status */}
        {invoice.status !== 'UNPAID' && invoice.proof_url && (
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Bukti Pembayaran</h3>
            <div className="bg-[#2B3139]/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#848E9C] text-sm">File terupload</span>
                <button className="text-[#F0B90B] hover:text-[#F8D56B] text-sm">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              <div className="text-white text-sm">Bukti pembayaran telah diupload</div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        {(invoice.transfer_method || invoice.wallet_tpc) && (
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Informasi Pembayaran</h3>
            <div className="space-y-3">
              {invoice.transfer_method && (
                <div>
                  <div className="text-[#848E9C] text-xs mb-1">Metode Transfer</div>
                  <div className="text-white font-medium">{transferMethods[invoice.transfer_method]?.name || invoice.transfer_method}</div>
                </div>
              )}
              {invoice.wallet_tpc && (
                <div>
                  <div className="text-[#848E9C] text-xs mb-1">Wallet TPC</div>
                  <div className="text-white font-mono text-sm bg-[#2B3139]/50 rounded p-2">
                    {invoice.wallet_tpc}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
