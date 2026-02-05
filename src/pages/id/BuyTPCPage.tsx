import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { buildLoginUrl } from '@/lib/authRedirect';
import { saveBuyDraft, loadBuyDraft, clearBuyDraft } from '@/lib/buyDraft';
import CountdownCard from '@/components/CountdownCard';
import tpcLogo from '@/assets/tpc.png';
import { Sparkles, TrendingUp, Shield, Clock, Star, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// PUBLIC BUY FLOW - NO AUTH DEPENDENCY
type Currency = 'IDR' | 'USDC' | 'SOL';

function sanitizeReferral(raw: string) {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 32);
}

export default function BuyTPCPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { lang = 'id' } = useParams<{ lang: string }>();
  const { toast } = useToast();
  
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
  const [solUsdPrice] = useState(150);
  const [isSponsorValid, setIsSponsorValid] = useState(true);
  const [sponsorError, setSponsorError] = useState('');
  const [defaultSponsor, setDefaultSponsor] = useState('');

  // Helper function
  const t = (key: string, en: string, id: string) => lang === 'en' ? en : id;

  // Load draft from URL/localStorage
  useEffect(() => {
    const draft = loadBuyDraft();
    if (draft) {
      setAmountValue(draft.amount_input || '');
      setCurrency(draft.currency || 'IDR');
      setWalletAddress(draft.wallet_address || '');
    }
  }, [searchParams]);

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
        amount_input: amountValue,
        currency,
        wallet_address: walletAddress,
      });
    }
  }, [amountValue, currency, walletAddress]);

  const handleBuyRedirect = () => {
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


    const returnTo = encodeURIComponent(`/${lang}/member/buytpc${location.search ?? ''}`);
    navigate(`/${lang}/login?returnTo=${returnTo}`);
  };

  const endTime = new Date(endAt).getTime();
  const timeLeft = Math.max(0, endTime - Date.now());
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.03)%22%20stroke-width%3D%221%22%3E%3Cpath%20d%3D%22M0%2030h60M30%200v60%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 p-4 shadow-2xl backdrop-blur-sm">
                  <img
                    src={tpcLogo}
                    alt="TPC"
                    className="h-12 w-12 object-contain"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent mb-4">
              {t('heroTitle', 'Join TPC Presale Now', 'Bergabung dengan TPC Presale Sekarang')}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle', 'Get TPC tokens at the best price before listing on DEX', 'Dapatkan token TPC dengan harga terbaik sebelum listing di DEX')}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <CountdownCard endTime={endAt} label={label} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                      {t('backToForm', 'Back to Form', 'Kembali ke Form')}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-amber-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Preview Mode</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Amount Input */}
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-lg font-medium text-gray-200">
                      {t('investmentAmount', 'Investment Amount', 'Jumlah Investasi')}
                    </Label>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {t('investmentSummary', 'Investment Summary', 'Ringkasan Investasi')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t('startFrom100kIDR', 'Start from 100.000 IDR (~$6 USD)', 'Mulai dari 100.000 IDR (~$6 USD)')}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          value={amountValue}
                          onChange={(e) => setAmountValue(e.target.value)}
                          placeholder={t('enterAmount', 'Enter amount', 'Masukkan jumlah')}
                          className="bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-400 text-lg h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                        />
                        {amountValue && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-medium">
                            ≈ {amountUsd.toFixed(2)} USD
                          </div>
                        )}
                      </div>
                    </div>
                    {amountValue && (
                      <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>{t('estimatedTPC', 'Estimated TPC', 'Estimasi TPC')}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-amber-400 font-bold text-lg">{tpcAmount.toFixed(2)} TPC</div>
                            <div className="text-xs text-gray-400">{t('atTPCPrice', '@ $0.10/TPC', '@ $0.10/TPC')}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="currency" className="text-lg font-medium text-gray-200">
                      {t('currency', 'Currency', 'Mata Uang')}
                    </Label>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {t('proceedToBuy', 'Proceed to Buy', 'Lanjut Beli')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t('chooseSafeCurrency', 'Choose currency that suits you best', 'Pilih mata uang yang nyaman untuk Anda')}
                          </p>
                        </div>
                      </div>
                      <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IDR">
                            <div className="flex items-center gap-2">
                              <span>IDR</span>
                              <span className="text-xs text-gray-400">- {t('indonesianRupiah', 'Indonesian Rupiah', 'Rupiah Indonesia')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="USDC">
                            <div className="flex items-center gap-2">
                              <span>USDC</span>
                              <span className="text-xs text-gray-400">- {t('usdStablecoin', 'USD Stablecoin', 'Stablecoin USD')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="SOL">
                            <div className="flex items-center gap-2">
                              <span>SOL</span>
                              <span className="text-xs text-gray-400">- {t('solanaToken', 'Solana Token', 'Token Solana')}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div className="space-y-3">
                    <Label htmlFor="wallet" className="text-lg font-medium text-gray-200">
                      {t('walletAddress', 'Wallet Address', 'Alamat Wallet')}
                    </Label>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {t('cancel', 'Cancel', 'Batal')}, {t('investmentDetails', 'Investment Details', 'Detail Investasi')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t('solanaNetwork', 'Solana Network - Ensure correct wallet address', 'Jaringan Solana - Pastikan alamat wallet benar')}
                          </p>
                        </div>
                      </div>
                      <Input
                        id="wallet"
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder={t('enterWalletAddress', 'Enter wallet address', 'Masukkan alamat wallet')}
                        className="bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-400 text-lg h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div className="space-y-3">
                    <Label htmlFor="sponsor" className="text-lg font-medium text-gray-200">
                      {t('referralCode', 'Referral Code', 'Kode Referal')} ({defaultSponsor && (
                        <span className="text-green-400 ml-2">
                          {t('autoAssigned', 'Auto-assigned', 'Ter-otomatis')}
                        </span>
                      )})
                    </Label>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {t('bonusReferral', 'Referral Bonus', 'Bonus Referal')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t('getAdditionalBonus', 'Get additional bonus from referral code', 'Dapatkan bonus tambahan dari kode referal')}
                          </p>
                        </div>
                      </div>
                      <Input
                        id="sponsor"
                        type="text"
                        value={sponsorCode}
                        onChange={(e) => setSponsorCode(e.target.value)}
                        placeholder={defaultSponsor || (t('enterReferralCode', 'Enter referral code', 'Masukkan kode referal'))}
                        className="bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-400 text-lg h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                      />
                      {sponsorError && (
                        <div className="mt-2 flex items-center gap-2 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{sponsorError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              {/* Security Card */}
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl border border-green-500/30 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-lg font-bold text-green-400">{t('secureTransactions', 'Secure Transactions', 'Transaksi Aman')}</h3>
                      <p className="text-sm text-gray-300">{t('allTransactionsSecure', 'All transactions are secure and verified', 'Semua transaksi aman dan terverifikasi')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Early Bird Bonus Card */}
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-xl border border-amber-500/30 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-8 h-8 text-amber-400" />
                    <div>
                      <h3 className="text-lg font-bold text-amber-400">{t('earlyBirdBonus', 'Early Bird Bonus', 'Bonus Early Bird')}</h3>
                      <p className="text-sm text-gray-300">{t('limitedTimeBonus', 'Limited time bonus for early participants', 'Bonus waktu terbatas untuk peserta awal')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400">{t('verifiedProject', 'Verified Project', 'Proyek Terverifikasi')}</h4>
                        <p className="text-xs text-gray-400">{t('auditedSmartContract', 'Audited smart contract', 'Kontrak pintar diaudit')}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400">{t('communityTrusted', 'Community Trusted', 'Komunitas Dipercaya')}</h4>
                        <p className="text-xs text-gray-400">{t('thousandsOfUsers', 'Thousands of users trust us', 'Ribuan pengguna mempercayai kami')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-10 h-10 text-amber-400" />
                    <div>
                      <h3 className="text-xl font-bold text-amber-400">{t('securityGuaranteed', 'Security Guaranteed', 'Keamanan Terjamin')}</h3>
                      <p className="text-sm text-gray-300">{t('encryptedPaymentSystem', 'Encrypted payment system and verified smart contracts', 'Sistem pembayaran terenkripsi dan kontrak pintar terverifikasi')}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleBuyRedirect}
                    disabled={timeLeft <= 0}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-4 px-6 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      <span>{t('buyTPCNow', 'Buy TPC Now', 'Beli TPC Sekarang')}</span>
                    </div>
                  </Button>
                  
                  <div className="text-sm text-gray-400 mt-4">
                    {t('loginRequired', 'Login diperlukan untuk menyelesaikan pembelian')}
                  </div>
                  
                  <div className="text-xs text-gray-300">
                    {t('ctaDescription', 'Click the button above to login to your account and continue with TPC purchase. Your investment details will be saved and available after login.', 'Klik tombol di atas untuk login ke akun Anda dan melanjutkan dengan pembelian TPC. Detail investasi Anda akan disimpan dan tersedia setelah login.')}
                  </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
