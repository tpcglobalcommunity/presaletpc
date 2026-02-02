import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, ArrowRight, Loader2, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatInputNumber, parseNumberID, formatNumberID, formatRupiah } from '@/lib/number';
import { calculateTPCFromUSD, calculateSponsorBonus, fetchSOLPrice, convertSOLToUSD, convertIDRToUSD, BASE_TPC_PRICE_USD, FIXED_IDR_RATE, LOCKED_SPONSOR_COMMISSION_PERCENTAGE } from '@/config/pricing';
import { formatIdr, parseIdr, formatUsdc, parseUsdc, formatSol, parseSol, formatTpc, clampDecimals } from '@/lib/formatters';
import { getSolUsdPrice } from '@/lib/prices';
import { calcTpc, USD_IDR, TPC_PRICE_USDC } from '@/lib/tpcPricing';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { SEO } from '@/lib/seo';
import CountdownCard from '@/components/CountdownCard';
import tpcLogo from '@/assets/tpc.png';

type Currency = "IDR" | "USDC" | "SOL";

interface PresaleConfig {
  stage1_started_at: number;
  stage1_duration_days: number;
  stage1_supply: number;
  stage1_price_usd: number;
  stage2_supply: number;
  stage2_price_usd: number;
  listing_price_usd: number;
}

export default function BuyTPCPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Presale configuration from environment variables
  const endAt = import.meta.env.VITE_PRESALE_END_AT ?? "2026-08-02T19:49:30+08:00";
  const label = import.meta.env.VITE_PRESALE_LABEL ?? "Presale Stage 1 Berakhir Dalam";
  
  // Fallback constants for presale config
  const FALLBACK_STAGE1_STARTED_AT = new Date('2026-02-02T00:00:00Z').getTime();
  
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [amountRaw, setAmountRaw] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [solUsdPrice, setSolUsdPrice] = useState<number | null>(null);
  const [solPriceLoading, setSolPriceLoading] = useState(false);
  const [presaleConfig, setPresaleConfig] = useState<PresaleConfig | null>(null);
  const [isPresaleConfigLoading, setIsPresaleConfigLoading] = useState(true);

  // Navigation helpers
  const goToTerms = () => navigate('/id/syarat-ketentuan');
  const goToPrivacy = () => navigate('/id/kebijakan-privasi');

  // Currency-specific input handlers
  const handleAmountChange = (value: string) => {
    if (currency === 'IDR') {
      const v = parseIdr(value);
      setAmountValue(v);
      setAmountRaw(formatIdr(v));  // OK to format live for IDR
    } else if (currency === 'USDC') {
      const cleaned = value.replace(/,/g, '');
      const clamped = clampDecimals(cleaned, 2);
      setAmountRaw(clamped);       // keep user typing smooth
      setAmountValue(parseUsdc(clamped));
    } else if (currency === 'SOL') {
      const clamped = clampDecimals(value, 4);
      setAmountRaw(clamped);
      setAmountValue(parseSol(clamped));
    }
  };

  const handleAmountBlur = () => {
    if (currency === 'USDC') {
      setAmountRaw(formatUsdc(amountValue));
    } else if (currency === 'SOL') {
      setAmountRaw(formatSol(amountValue)); // always 4 decimals
    }
  };

  // Fetch SOL price when currency is SOL
  useEffect(() => {
    if (currency === 'SOL') {
      setSolPriceLoading(true);
      getSolUsdPrice().then(price => {
        setSolUsdPrice(price);
        setSolPriceLoading(false);
      });
    }
  }, [currency]);

  // Placeholder per currency
  const placeholder =
    currency === "IDR" ? "10.000" :
    currency === "USDC" ? "1,000.00" :
    "0.0010";

  // Fetch presale config
  useEffect(() => {
    const fetchPresaleConfig = async () => {
      try {
        setIsPresaleConfigLoading(true);
        // For now, use fallback config
        const config: PresaleConfig = {
          stage1_started_at: FALLBACK_STAGE1_STARTED_AT,
          stage1_duration_days: 30,
          stage1_supply: 100000000,
          stage1_price_usd: 0.001,
          stage2_supply: 100000000,
          stage2_price_usd: 0.002,
          listing_price_usd: 0.005
        };
        setPresaleConfig(config);
      } catch (error) {
        console.error('Failed to fetch presale config:', error);
      } finally {
        setIsPresaleConfigLoading(false);
      }
    };

    fetchPresaleConfig();
  }, []);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        setEmail(user.email || '');
      }
    };
    getCurrentUser();
  }, []);

  // Calculate derived values
  const tpcAmount = calcTpc(currency, amountValue, solUsdPrice);
  const sponsorBonus = amountValue >= 1000000 ? calculateSponsorBonus(amountValue) : 0;
  const totalTPC = tpcAmount + sponsorBonus;

  const isValid = amountValue > 0 && email.includes('@') && agreed;

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      // Call locked RPC function instead of direct insert
      const { data, error } = await supabase.rpc('create_invoice_locked', {
        p_email: email.toLowerCase().trim(),
        p_referral_code: referralCode.toUpperCase().trim(),
        p_base_currency: currency,
        p_amount_input: amountValue
      });

      if (error) {
        console.error('RPC Error:', error);
        toast({
          title: "Error",
          description: error.message || "Gagal membuat invoice. Silakan coba lagi.",
          variant: "destructive",
        });
        return;
      }

      if (!data || Array.isArray(data) && data.length === 0) {
        throw new Error('No invoice data returned');
      }

      const invoice = Array.isArray(data) ? data[0] : data;

      toast({
        title: "Invoice Berhasil Dibuat",
        description: `Invoice #${invoice.invoice_no} telah dibuat.`,
      });

      // Navigate to success page with invoice data
      navigate('/id/buytpc/success', { 
        state: { invoice },
        replace: true 
      });

    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currencyLabels = {
    IDR: { label: 'IDR', symbol: 'Rp' },
    USDC: { label: 'USDC', symbol: '$' },
    SOL: { label: 'SOL', symbol: 'SOL' }
  } as const;

  return (
    <>
      <SEO 
        title="Beli TPC - Bergabung dengan Ekosistem TPC Global"
        description="Beli token TPC sekarang dengan harga presale terbaik. Proses aman, transparan, dan edukasi-only. Bergabung dengan komunitas TPC Global hari ini."
        path="/id/buytpc"
      />
      <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Strip */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0B90B]/10 via-transparent to-transparent h-1" />
        
        <div className="relative bg-[#1E2329]/80 backdrop-blur-sm border-b border-[#2B3139] px-4 py-6">
          <div className="max-w-[430px] mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 p-3 shadow-lg">
                  <img
                    src={tpcLogo}
                    alt="TPC Global"
                    className="h-10 w-10 object-contain"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">Beli TPC</h1>
                <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30 text-xs">
                  Verified Presale
                </Badge>
              </div>
              <p className="text-[#848E9C] text-sm">
                Bergabung dengan ekosistem TPC Global sebelum listing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="max-w-[430px] mx-auto px-4 pb-6">
        <CountdownCard 
          label={label}
          targetIso={endAt}
        />
      </div>

      <div className="max-w-[430px] mx-auto px-4 py-6 space-y-6">
        {/* Presale Info Card */}
        <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Coins className="h-5 w-5 text-[#F0B90B]" />
                Informasi Presale
              </CardTitle>
              <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-400/30">
                {presaleConfig?.stage1_started_at ? 'Tahap 1 Aktif' : 'Tahap 2 Aktif'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Countdown handled by CountdownCard component above */}
            
            <Separator className="bg-[#1F2A33]" />
            
            {/* Supply Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#848E9C]">Tahap 1:</span>
                <span className="text-sm font-medium text-white">
                  {presaleConfig ? formatNumberID(presaleConfig.stage1_supply) : '100.000.000'} TPC — ${presaleConfig?.stage1_price_usd || '0.001'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#848E9C]">Tahap 2:</span>
                <span className="text-sm font-medium text-white">
                  {presaleConfig ? formatNumberID(presaleConfig.stage2_supply) : '100.000.000'} TPC — ${presaleConfig?.stage2_price_usd || '0.002'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#848E9C]">Listing:</span>
                <span className="text-sm font-medium text-emerald-400">
                  ${presaleConfig?.listing_price_usd || '0.005'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-[#F0B90B]" />
              Pilih Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(currencyLabels).map(([curr, info]) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr as Currency)}
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-200 text-center",
                    currency === curr
                      ? "bg-[#F0B90B]/20 border-[#F0B90B]/50 text-[#F0B90B]"
                      : "bg-[#1E2329] border-[#2B3139] text-[#848E9C] hover:border-[#F0B90B]/30 hover:text-white"
                  )}
                >
                  <div className="font-semibold">{info.label}</div>
                  <div className="text-xs mt-1">{info.hint}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Form Card */}
        <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Coins className="h-5 w-5 text-[#F0B90B]" />
              Buat Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Jumlah {currencyLabels[currency].label}
              </label>
              <input
                type="text"
                placeholder={placeholder}
                value={amountRaw}
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={handleAmountBlur}
                className="w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50"
              />
            </div>

            {/* Referral Code */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Kode Referral (Opsional)
              </label>
              <input
                type="text"
                placeholder="Masukkan kode referral"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] uppercase focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50"
              />
            </div>

            {/* Summary */}
            {(amountValue > 0) && (
              <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#848E9C]">Jumlah {currencyLabels[currency].label}:</span>
                  <span className="text-white font-medium">
                    {currency === 'IDR' ? formatRupiah(amountValue) : `${amountValue} ${currency}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#848E9C]">TPC yang akan didapat:</span>
                  <span className="text-[#F0B90B] font-medium">
                    {formatTpc(tpcAmount)} TPC
                  </span>
                </div>
                {amountValue >= 1000000 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#848E9C]">Bonus Sponsor:</span>
                    <span className="text-emerald-400 font-medium">
                      +{formatTpc(sponsorBonus)} TPC
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
          <CardContent className="p-4 space-y-2">
            <div className="text-xs text-[#848E9C] space-y-1">
              <div>Kurs: 1 USDC = Rp {USD_IDR.toLocaleString('id-ID')}</div>
              <div>Harga TPC: {TPC_PRICE_USDC} USDC</div>
              {currency === 'SOL' && (
                <div>
                  {solPriceLoading ? 'Mengambil harga SOL...' : 
                   solUsdPrice ? `Harga SOL realtime: $${solUsdPrice.toFixed(2)}` : 
                   'Harga SOL belum tersedia'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer text-[#848E9C]">
                Saya telah membaca dan menyetujui{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); goToTerms(); }}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goToTerms()}
                  className="text-[#F0B90B] font-medium hover:underline cursor-pointer"
                >
                  Syarat & Ketentuan
                </span>{' '}
                serta{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); goToPrivacy(); }}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goToPrivacy()}
                  className="text-[#F0B90B] font-medium hover:underline cursor-pointer"
                >
                  Kebijakan Privasi
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Safety & Trust Card */}
        <Card className="bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Keamanan & Transparansi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-[#848E9C]">Edukasi-only, tidak ada jaminan profit</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-[#848E9C]">Selalu verifikasi wallet resmi</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-[#848E9C]">Jangan bagikan OTP/seed phrase</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-[#848E9C]">Konfirmasi invoice ID sebelum bayar</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/id/transparansi')}
            className="bg-[#11161C]/50 border-[#1F2A33] text-[#848E9C] hover:bg-[#1F2A33] hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Transparansi
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/id/anti-scam')}
            className="bg-[#11161C]/50 border-[#1F2A33] text-[#848E9C] hover:bg-[#1F2A33] hover:text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Anti-Scam
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/id/faq')}
            className="bg-[#11161C]/50 border-[#1F2A33] text-[#848E9C] hover:bg-[#1F2A33] hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            FAQ
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full h-12 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#F8D56B] hover:to-[#F0B90B] transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Coins className="h-4 w-4 mr-2" />
              Beli TPC Sekarang
            </>
          )}
        </Button>
      </div>
    </div>
    </>
  );
}
