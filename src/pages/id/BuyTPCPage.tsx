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
import { Sparkles, TrendingUp, Shield, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';

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

  // Load draft from URL/localStorage
  useEffect(() => {
    const draft = loadBuyDraft();
    if (draft) {
      setAmountValue(draft.amount_input || '');
      setCurrency(draft.currency || 'IDR');
      setWalletAddress(draft.wallet_address || '');
      setSponsorCode(draft.ref_code || '');
    }
    
    const urlRef = searchParams.get('ref');
    if (urlRef) {
      setSponsorCode(sanitizeReferral(urlRef));
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
        ref_code: sponsorCode,
        amount_input: amountValue,
        currency,
        wallet_address: walletAddress,
      });
    }
  }, [amountValue, currency, walletAddress, sponsorCode]);

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

  const t = (key: string, en: string, id: string) => lang === 'en' ? en : id;

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

            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent mb-4">
                {t('Beli TPC', 'Buy TPC')}
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-full">
                  <span className="text-amber-400 text-sm font-medium">Verified Presale</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t('Bergabung dengan ekosistem TPC Global sebelum listing', 'Join the TPC Global ecosystem before listing')}
              </p>
            </div>

            {/* Countdown Timer */}
            {timeLeft > 0 && (
              <div className="mb-8">
                <CountdownCard 
                  targetIso={endAt}
                  label={label}
                />
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Features */}
            <div className="lg:col-span-1 space-y-6">
              {/* Feature Cards */}
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold">Early Bird Bonus</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Dapatkan harga spesial stage 1 dengan bonus eksklusif untuk early adopters.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold">Secure & Trusted</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Transaksi aman dengan sistem yang sudah terverifikasi dan diawasi oleh tim profesional.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold">Limited Time</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Kesempatan terbatas untuk bergabung dengan harga presale sebelum naik ke stage berikutnya.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Center Column - Main Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                      {t('Form Pembelian', 'Purchase Form')}
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
                      {t('Jumlah Investasi', 'Investment Amount')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        value={amountValue}
                        onChange={(e) => setAmountValue(e.target.value)}
                        placeholder={t('Masukkan jumlah', 'Enter amount')}
                        className="bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-400 text-lg h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                      />
                      {amountValue && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-medium">
                          ≈ {amountUsd.toFixed(2)} USD
                        </div>
                      )}
                    </div>
                    {amountValue && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>Estimasi TPC: <span className="text-amber-400 font-semibold">{tpcAmount.toFixed(2)} TPC</span></span>
                      </div>
                    )}
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="currency" className="text-lg font-medium text-gray-200">
                      {t('Pilih Mata Uang', 'Select Currency')}
                    </Label>
                    <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                        <SelectItem value="IDR">🇮🇩 IDR - Rupiah Indonesia</SelectItem>
                        <SelectItem value="USDC">💵 USDC - USD Coin</SelectItem>
                        <SelectItem value="SOL">◎ SOL - Solana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Wallet Address */}
                  <div className="space-y-3">
                    <Label htmlFor="wallet" className="text-lg font-medium text-gray-200">
                      {t('Alamat Wallet TPC', 'TPC Wallet Address')}
                    </Label>
                    <Input
                      id="wallet"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder={t('Masukkan alamat wallet untuk menerima TPC', 'Enter wallet address to receive TPC')}
                      className="bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-400 text-lg h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* Referral Code */}
                  <div className="space-y-3">
                    <Label htmlFor="sponsor" className="text-lg font-medium text-gray-200">
                      {t('Kode Referal (Opsional)', 'Referral Code (Optional)')}
                    </Label>
                    <Input
                      id="sponsor"
                      type="text"
                      value={sponsorCode}
                      onChange={(e) => setSponsorCode(sanitizeReferral(e.target.value))}
                      placeholder={t('TPC-GLOBAL', 'TPC-GLOBAL')}
                      className="bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-400 text-lg h-12 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <Separator className="bg-slate-700/50" />

                  {/* CTA Section */}
                  <div className="space-y-6">
                    <Button
                      onClick={handleBuyRedirect}
                      disabled={timeLeft <= 0}
                      className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-lg rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span>{t('Login untuk Beli TPC', 'Login to Buy TPC')}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Button>

                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <p className="text-sm text-gray-300">
                          {t('Untuk keamanan, pembelian hanya bisa dilakukan setelah login.', 'For security, purchases are available after login.')}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{t('Aman', 'Secure')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{t('Tercepat', 'Fast')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{t('Terpercaya', 'Trusted')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
