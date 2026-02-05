import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Clock, CheckCircle, XCircle, AlertTriangle, Wallet, CreditCard, ExternalLink, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatRupiah, formatNumberID } from '@/lib/number';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateProofFilePath, getInvoiceProofUrl } from '@/lib/storage/getInvoiceProofUrl';
import { normalizeProofUrl } from '@/lib/normalizeProofUrl';
import { uploadProofFile, updateInvoiceProof, parseLegacyProofUrlToBucketPath, getProofPublicUrl } from '@/lib/storageProof';
import { getDestination } from '@/config/paymentDestinations';
import { ErrorCard, LoadingCard } from '@/components/member/MemberUIStates';

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
  proof_url?: string | null;
  proof_bucket?: string | null;
  proof_path?: string | null;
  proof_uploaded_at?: string | null;
  submitted_at?: string | null;
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
  const { invoiceNo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [paymentSettings, setPaymentSettings] = useState({
    idrBankName: 'BCA',
    idrAccountNo: '7892088406',
    idrAccountName: 'ARSYAD',
    solAddress: '5AeayrU2pdy6yNBeiUpTXkfMxw3VpDQGUHC6kXrBt5vw',
    usdcChain: 'Solana (SPL)',
    usdcAddress: '5AeayrU2pdy6yNBeiUpTXkfMxw3VpDQGUHC6kXrBt5vw'
  });

  const fetchInvoice = async () => {
    if (!invoiceNo) {
      setIsLoading(false);
      setError('Invoice tidak valid');
      return;
    }
    
    if (!user) {
      setIsLoading(false);
      setError('User tidak terautentikasi');
      return;
    }
    
    try {
      setError(null);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_no', invoiceNo)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching invoice:', error);
        setError('Gagal memuat invoice.');
        return;
      }
      
      if (!data) {
        setError('Invoice tidak ditemukan.');
        return;
      }
      
      setInvoice(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan yang tidak terduga.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [invoiceNo, user, navigate, toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: 'File Terlalu Besar', 
        description: 'Ukuran file maksimal 5MB.',
        variant: 'destructive' 
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedFile || !invoice || !user) {
      toast({ 
        title: 'File Belum Dipilih', 
        description: 'Silakan pilih file bukti pembayaran terlebih dahulu.',
        variant: 'destructive' 
      });
      return;
    }

    // Check if invoice status allows upload
    if (invoice.status !== 'UNPAID') {
      toast({ 
        title: 'Tidak Dapat Upload', 
        description: 'Bukti pembayaran hanya dapat diunggah untuk invoice yang belum dibayar.',
        variant: 'destructive' 
      });
      return;
    }

    setUploadingFile(true);
    try {
      console.log('[PROOF_UPLOAD] Starting upload:', {
        invoiceId: invoice.id,
        userId: user.id,
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      });

      // Upload proof file using canonical helper
      const { bucket, path, publicUrl } = await uploadProofFile(
        user.id, 
        invoice.id, 
        selectedFile
      );
      
      // Update invoice with proof information
      await updateInvoiceProof(invoice.id, bucket, path, publicUrl);

      // Clear selected file and preview
      setSelectedFile(null);
      setPreviewUrl(null);

      // Refresh invoice data
      await fetchInvoice();
      
      toast({ 
        title: 'Upload Berhasil!', 
        description: 'Bukti pembayaran berhasil dikirim. Admin akan segera memverifikasi.' 
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Gagal Upload', 
        description: 'Terjadi kesalahan saat mengunggah bukti pembayaran.',
        variant: 'destructive' 
      });
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

  if (isLoading) {
    return (
      <div className="mobile-container pt-6 pb-28 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-4">
          <h1 className="text-2xl font-bold text-white mb-6">Detail Invoice</h1>
          <LoadingCard message="Memuat detail invoice..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-container pt-6 pb-28 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-4">
          <h1 className="text-2xl font-bold text-white mb-6">Detail Invoice</h1>
          <ErrorCard 
            title="Gagal Memuat Invoice" 
            message={error}
            onRetry={() => {
              setIsLoading(true);
              setError(null);
              fetchInvoice();
            }}
          />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="mobile-container pt-6 pb-28 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="px-4">
          <h1 className="text-2xl font-bold text-white mb-6">Detail Invoice</h1>
          <ErrorCard 
            title="Invoice Tidak Ditemukan" 
            message="Invoice yang Anda cari tidak tersedia."
            onRetry={() => navigate('/id/member/invoices')}
            retryText="Kembali ke Daftar Invoice"
          />
        </div>
      </div>
    );
  }

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

                {/* Tujuan Pembayaran */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Tujuan Pembayaran</h3>
          
          {invoice.base_currency === 'IDR' && (
            <div className="space-y-3">
              <div>
                <div className="text-[#848E9C] text-xs mb-1">Bank</div>
                <div className="text-white font-medium">{paymentSettings.idrBankName}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#848E9C] text-xs mb-1">Nomor Rekening</div>
                  <div className="text-white font-mono text-sm">{paymentSettings.idrAccountNo}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(paymentSettings.idrAccountNo, 'idr-account')}
                  className="text-[#F0B90B] hover:text-[#F0B90B]/80 hover:bg-[#F0B90B]/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <div className="text-[#848E9C] text-xs mb-1">Nama Penerima</div>
                <div className="text-white font-medium">{paymentSettings.idrAccountName}</div>
              </div>
            </div>
          )}

          {invoice.base_currency === 'SOL' && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#848E9C] text-xs mb-1">Solana Address</div>
                <div className="text-white font-mono text-sm">{paymentSettings.solAddress}</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(paymentSettings.solAddress, 'sol-address')}
                className="text-[#F0B90B] hover:text-[#F0B90B]/80 hover:bg-[#F0B90B]/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          {invoice.base_currency === 'USDC' && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#848E9C] text-xs mb-1">USDC ({paymentSettings.usdcChain})</div>
                <div className="text-white font-mono text-sm">{paymentSettings.usdcAddress}</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(paymentSettings.usdcAddress, 'usdc-address')}
                className="text-[#F0B90B] hover:text-[#F0B90B]/80 hover:bg-[#F0B90B]/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          {!paymentSettings.idrBankName && !paymentSettings.solAddress && !paymentSettings.usdcAddress && (
            <div className="text-[#848E9C] text-sm">
              Tujuan pembayaran belum dikonfigurasi. Hubungi admin.
            </div>
          )}
        </div>

        {/* Payment Proof Upload - Only show for UNPAID */}
        {invoice.status === 'UNPAID' && (
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Upload Bukti Pembayaran</h3>
            
            {/* File Upload */}
            <div className="space-y-4">
              <div>
                <label className="text-[#848E9C] text-sm mb-2 block">Bukti Pembayaran</label>
                <div className="border-2 border-dashed border-[#3A3F47] rounded-lg p-4">
                  <input
                    id="proof-file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploadingFile}
                  />
                  <label
                    htmlFor="proof-file"
                    className={`flex flex-col items-center justify-center cursor-pointer ${uploadingFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadingFile ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B] mb-2"></div>
                        <span className="text-[#848E9C] text-sm">Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-[#848E9C] mb-2" />
                        <span className="text-[#848E9C] text-sm">Klik untuk upload bukti</span>
                        <span className="text-[#848E9C] text-xs">JPG, PNG, PDF max 5MB</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* File Preview */}
              {selectedFile && (
                <div className="space-y-3">
                  <div className="bg-[#2B3139]/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">File Terpilih:</span>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-[#848E9C] hover:text-white text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="text-[#848E9C] text-xs">{selectedFile.name}</div>
                    <div className="text-[#848E9C] text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>

                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="bg-[#2B3139]/50 rounded-lg p-3">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitProof}
                    disabled={uploadingFile || !selectedFile}
                    className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-medium"
                  >
                    {uploadingFile ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proof Display - Show if proof exists */}
        {(invoice.proof_url || invoice.proof_path) && (() => {
          let proofUrl: string | null = null;
          let shouldUpdateDb = false;

          // Priority 1: Use canonical proof_bucket + proof_path
          if (invoice.proof_bucket && invoice.proof_path) {
            proofUrl = getProofPublicUrl(invoice.proof_bucket, invoice.proof_path);
            console.log('[STORAGE] Using canonical proof:', { bucket: invoice.proof_bucket, path: invoice.proof_path, url: proofUrl });
          }
          // Priority 2: Parse legacy proof_url
          else if (invoice.proof_url) {
            const parsed = parseLegacyProofUrlToBucketPath(invoice.proof_url);
            if (parsed) {
              proofUrl = getProofPublicUrl(parsed.bucket, parsed.path);
              shouldUpdateDb = true; // Mark for DB update
              console.log('[STORAGE] Using parsed legacy proof:', { parsed, url: proofUrl });
              
              // Background update DB with canonical info (best effort)
              setTimeout(async () => {
                try {
                  await (supabase.from('invoices') as any).update({
                    proof_bucket: parsed.bucket,
                    proof_path: parsed.path
                  }).eq('id', invoice.id);
                  console.log('[STORAGE] Updated invoice with canonical proof info');
                } catch (error: any) {
                  console.warn('[STORAGE] Failed to update invoice with canonical proof info:', error);
                }
              }, 0);
            } else {
              console.error('[STORAGE] Failed to parse legacy proof URL:', invoice.proof_url);
            }
          }

          if (!proofUrl) {
            return (
              <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">Bukti Pembayaran</h3>
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertDescription className="text-red-400">
                    Bukti pembayaran tidak ditemukan. Silakan upload ulang bukti pembayaran.
                  </AlertDescription>
                </Alert>
              </div>
            );
          }
          
          return (
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4">Bukti Pembayaran</h3>
              <div className="space-y-3">
                <div className="bg-[#2B3139]/50 rounded-lg p-3">
                  <a 
                    href={proofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-[#F0B90B] hover:text-[#F8D56B] transition-colors"
                  >
                    <span className="text-sm">Lihat Bukti Pembayaran</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {shouldUpdateDb && (
                  <div className="text-xs text-gray-400">
                    Bukti pembayaran sedang diperbarui ke format baru...
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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
