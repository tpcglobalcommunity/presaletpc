import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { saveBuyDraft, loadBuyDraft, clearBuyDraft } from '@/lib/buyDraft';
import CountdownCard from '@/components/CountdownCard';
import tpcLogo from '@/assets/tpc.png';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// MEMBER BUY FLOW - AUTH REQUIRED
type Currency = 'IDR' | 'USDC' | 'SOL';

function sanitizeReferral(raw: string) {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 32);
}

export default function BuyTPCMemberPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang = 'id' } = useParams<{ lang: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Presale configuration
  const endAt = import.meta.env.VITE_PRESALE_END_AT ?? "2026-08-02T19:49:30+08:00";
  const label = import.meta.env.VITE_PRESALE_LABEL ?? "Presale Stage 1 Berakhir Dalam";
  
  // Form state
  const [amountValue, setAmountValue] = useState('');
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [walletAddress, setWalletAddress] = useState('');
  const [sponsorCode, setSponsorCode] = useState('');
  const [amountUsd, setAmountUsd] = useState(0);
  const [tpcAmount, setTpcAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solUsdPrice] = useState(150);

  // Auth check - redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      const returnTo = encodeURIComponent(`/${lang}/member/buytpc${location.search ?? ''}`);
      navigate(`/${lang}/login?returnTo=${returnTo}`);
    }
  }, [user, lang, navigate, location.search]);

  // Load draft from localStorage
  useEffect(() => {
    const draft = loadBuyDraft();
    if (draft) {
      setAmountValue(draft.amount_input || '');
      setCurrency(draft.currency || 'IDR');
      setWalletAddress(draft.wallet_address || '');
      setSponsorCode(draft.ref_code || '');
    }
  }, []);

  // Calculate USD and TPC amounts when inputs change
  useEffect(() => {
    let usd = 0;
    
    switch (currency) {
      case 'USDC':
        usd = parseFloat(amountValue) || 0;
        break;
      case 'IDR':
        usd = (parseFloat(amountValue) || 0) / 17000;
        break;
      case 'SOL':
        usd = (parseFloat(amountValue) || 0) * solUsdPrice;
        break;
    }

    setAmountUsd(usd);
    const tpc = usd / 0.10;
    setTpcAmount(tpc);
  }, [amountValue, currency, solUsdPrice]);

  // Save draft on form changes
  useEffect(() => {
    if (amountValue || walletAddress) {
      saveBuyDraft({
        ref_code: sponsorCode,
        amount_input: amountValue,
        currency,
        wallet_address: walletAddress,
      });
    }
  }, [amountValue, currency, walletAddress, sponsorCode]);

  const handleCreateInvoice = async () => {
    // Validation
    if (!amountValue || parseFloat(amountValue) <= 0) {
      toast({
        title: lang === 'id' ? "Error" : "Error",
        description: lang === 'id' ? "Masukkan jumlah yang valid" : "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: lang === 'id' ? "Error" : "Error",
        description: lang === 'id' ? "Masukkan alamat wallet" : "Please enter wallet address",
        variant: "destructive",
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: lang === 'id' ? "Error" : "Error",
        description: lang === 'id' ? "User tidak terautentikasi" : "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use member-safe RPC for invoice creation
      const { data, error } = await supabase.rpc('create_invoice_locked', {
        p_email: user.email,
        p_referral_code: sponsorCode.trim().toUpperCase() || 'TPC-GLOBAL',
        p_base_currency: currency,
        p_amount_input: parseFloat(amountValue),
        p_wallet_tpc: walletAddress.trim(),
        p_guest_id: crypto.randomUUID() // Required for 6-param signature
      });

      if (error) {
        console.error("[INVOICE] Error creating invoice:", error);
        toast({
          title: lang === 'id' ? "Error" : "Error",
          description: error.message || (lang === 'id' ? "Gagal membuat invoice" : "Failed to create invoice"),
          variant: "destructive",
        });
        return;
      }

      const invoiceData = Array.isArray(data) ? data[0] : data;
      
      if (!invoiceData) {
        toast({
          title: lang === 'id' ? "Error" : "Error",
          description: lang === 'id' ? "Invoice tidak dibuat" : "Invoice not created",
          variant: "destructive",
        });
        return;
      }

      clearBuyDraft();
      toast({
        title: lang === 'id' ? "Invoice Berhasil" : "Invoice Created",
        description: lang === 'id' ? `Invoice ${invoiceData.invoice_no} berhasil dibuat` : `Invoice ${invoiceData.invoice_no} created successfully`,
      });

      navigate(`/${lang}/member/invoices/${invoiceData.invoice_no}`);
    } catch (error) {
      console.error("[INVOICE] Fatal error:", error);
      toast({
        title: lang === 'id' ? "Error" : "Error",
        description: lang === 'id' ? "Terjadi kesalahan" : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate(`/${lang}/dashboard/member/dashboard`);
  };

  const endTime = new Date(endAt).getTime();
  const timeLeft = Math.max(0, endTime - Date.now());
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const t = (key: string, en: string, id: string) => lang === 'en' ? en : id;

  // Don't render if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#1a2332] to-[#0B0E11]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <img src={tpcLogo} alt="TPC" className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('Beli TPC', 'Buy TPC')}
            </h1>
            <p className="text-gray-300">
              {t('Presale Stage 1 - Member Area', 'Presale Stage 1 - Member Area')}
            </p>
            {timeLeft > 0 && (
              <div className="mt-4">
                <CountdownCard 
                  endTime={endAt}
                  label={label}
                />
              </div>
            )}
          </div>

          <Card className="bg-[#1a2332] border-[#2a3f42] text-white">
            <CardHeader>
              <CardTitle className="text-xl">
                {t('Form Pembelian Member', 'Member Purchase Form')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {t('Jumlah', 'Amount')}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                  placeholder={t('Masukkan jumlah', 'Enter amount')}
                  className="bg-[#0B0E11] border-[#2a3f42] text-white placeholder-gray-400"
                />
                <div className="text-sm text-gray-300">
                  ≈ {amountUsd.toFixed(2)} USD | {tpcAmount.toFixed(2)} TPC
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">
                  {t('Mata Uang', 'Currency')}
                </Label>
                <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                  <SelectTrigger className="bg-[#0B0E11] border-[#2a3f42] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-[#2a3f42]">
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="SOL">SOL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">
                  {t('Alamat Wallet TPC', 'TPC Wallet Address')}
                </Label>
                <Input
                  id="wallet"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={t('Masukkan alamat wallet TPC', 'Enter TPC wallet address')}
                  className="bg-[#0B0E11] border-[#2a3f42] text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsor">
                  {t('Kode Referal (Opsional)', 'Referral Code (Optional)')}
                </Label>
                <Input
                  id="sponsor"
                  type="text"
                  value={sponsorCode}
                  onChange={(e) => setSponsorCode(sanitizeReferral(e.target.value))}
                  placeholder={t('TPC-GLOBAL', 'TPC-GLOBAL')}
                  className="bg-[#0B0E11] border-[#2a3f42] text-white placeholder-gray-400"
                />
              </div>

              <Separator className="bg-[#2a3f42]" />

              <div className="space-y-4">
                <Button
                  onClick={handleCreateInvoice}
                  disabled={isSubmitting || timeLeft <= 0}
                  className="w-full bg-[#F0B90B] hover:bg-[#e0990c] text-white"
                >
                  {isSubmitting ? (
                    <span>{t('Memproses...', 'Processing...')}</span>
                  ) : (
                    <span>{t('Buat Invoice & Lanjut Pembayaran', 'Create Invoice & Continue Payment')}</span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="w-full border-[#2a3f42] text-white hover:bg-[#2a3f42]"
                >
                  {t('Kembali ke Dashboard', 'Back to Dashboard')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
