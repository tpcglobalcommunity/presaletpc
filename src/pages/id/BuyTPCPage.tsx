import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Coins, ArrowRight, Loader2, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { formatRupiah } from '@/lib/number';
import { calculateSponsorBonus } from '@/config/pricing';
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

function sanitizeReferral(raw: string) {
  // Aman: hanya huruf, angka, dash, underscore. max 32 char
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
  const { toast } = useToast();
  
  // Presale configuration from environment variables
  const endAt = import.meta.env.VITE_PRESALE_END_AT ?? "2026-08-02T19:49:30+08:00";
  const label = import.meta.env.VITE_PRESALE_LABEL ?? "Presale Stage 1 Berakhir Dalam";
  
  // Fallback constants for presale config
  const FALLBACK_STAGE1_STARTED_AT = new Date('2026-02-02T00:00:00Z').getTime();
  
  // PENDING SPONSOR LOGIC
  const LS_KEY = 'tpc_pending_sponsor_code';
  const refFromUrl = (searchParams.get('ref') || '').trim().toUpperCase();
  
  const [sponsorCode, setSponsorCode] = useState<string>('');
  const [sponsorLoading, setSponsorLoading] = useState<boolean>(false);
  const [sponsorError, setSponsorError] = useState<string>('');

  // EXISTING STATE
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [amountRaw, setAmountRaw] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [walletTpc, setWalletTpc] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [solUsdPrice, setSolUsdPrice] = useState<number | null>(null);
  const [solPriceLoading, setSolPriceLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [presaleConfig, setPresaleConfig] = useState<PresaleConfig | null>(null);

  // Navigation helpers
  const goToTerms = () => navigate('/id/syarat-ketentuan');
  const goToPrivacy = () => navigate('/id/kebijakan-privasi');

  // Initialize pending sponsor
  useEffect(() => {
    console.log('[ACTIVE_PAGE] BuyTPCPage ACTIVE: src/pages/id/BuyTPCPage.tsx');
    console.log('[ACTIVE_PAGE] BuyTPCPage @ FILE_PATH_HERE');
    console.log('[ACTIVE_PAGE] BuyTPCPage @ src/pages/id/BuyTPCPage.tsx');
    
    let cancelled = false;

    async function initSponsor() {
      console.log('[SPONSOR] init start');

      setSponsorLoading(true);
      setSponsorError('');

      const params = new URLSearchParams(window.location.search);
      const refFromUrl = (params.get('ref') || '').trim().toUpperCase();

      if (refFromUrl) {
        console.log('[SPONSOR] from URL:', refFromUrl);
        localStorage.setItem(LS_KEY, refFromUrl);
        if (!cancelled) {
          setSponsorCode(refFromUrl);
          setSponsorLoading(false);
        }
        return;
      }

      const existing = (localStorage.getItem(LS_KEY) || '').trim().toUpperCase();
      if (existing) {
        console.log('[SPONSOR] from localStorage:', existing);
        if (!cancelled) {
          setSponsorCode(existing);
          setSponsorLoading(false);
        }
        return;
      }

      console.log('[SPONSOR] fetching random sponsor via RPC...');
      const { data, error } = await supabase.rpc('get_random_referral_code');

      if (cancelled) return;

      if (error) {
        console.error('[SPONSOR] RPC error:', error.message);
        setSponsorError('Gagal menentukan sponsor otomatis. Silakan refresh halaman.');
        setSponsorLoading(false);
        return;
      }

      const code = (data || '').toString().trim().toUpperCase();

      if (!code) {
        console.error('[SPONSOR] RPC returned empty');
        setSponsorError('Sponsor otomatis belum tersedia. Silakan refresh atau coba lagi nanti.');
        setSponsorLoading(false);
        return;
      }

      console.log('[SPONSOR] random sponsor result:', code);
      localStorage.setItem(LS_KEY, code);
      setSponsorCode(code);
      setSponsorLoading(false);
    }

    initSponsor();

    return () => { cancelled = true; };
  }, []);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch presale config
  useEffect(() => {
    const fetchPresaleConfig = async () => {
      try {
        const config = {
          stage1_started_at: FALLBACK_STAGE1_STARTED_AT,
          stage1_duration_days: 30,
          stage1_supply: 100000000,
          stage1_price_usd: 0.01,
          stage2_supply: 50000000,
          stage2_price_usd: 0.02,
          listing_price_usd: 0.05,
        };
        setPresaleConfig(config);
      } catch (error) {
        console.error('Failed to fetch presale config:', error);
      }
    };

    fetchPresaleConfig();
  }, []);

  // Fetch SOL price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        setSolPriceLoading(true);
        const price = await getSolUsdPrice();
        setSolUsdPrice(price);
      } catch (error) {
        console.error('Failed to fetch SOL price:', error);
      } finally {
        setSolPriceLoading(false);
      }
    };

    fetchSolPrice();
  }, []);

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
      setAmountRaw(formatSol(amountValue));
    }
  };

  // Calculate derived values
  const tpcAmount = calcTpc(currency, amountValue, solUsdPrice);
  const sponsorBonus = amountValue >= 1000000 ? calculateSponsorBonus(amountValue) : 0;
  const sponsorBonusAmount = typeof sponsorBonus === 'number' ? sponsorBonus : sponsorBonus?.bonus_amount || 0;
  const totalTPC = tpcAmount + sponsorBonusAmount;

  const isValid = amountValue > 0 && walletTpc.trim().length >= 20 && agreed && userEmail !== null && sponsorCode && !sponsorLoading && !sponsorError;

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;

    if (!userEmail) {
      toast({
        title: "Error",
        description: "Harus login untuk membeli TPC",
        variant: "destructive",
      });
      return;
    }

    if (sponsorLoading || !sponsorCode) {
      toast({
        title: "Error",
        description: 'Sponsor belum siap. Tunggu sebentar...',
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create invoice with pending sponsor
      const referralClean = sponsorCode.trim().toUpperCase();
      
      const { data, error } = await supabase.rpc('create_invoice_locked', {
        p_email: userEmail.toLowerCase().trim(),
        p_referral_code: referralClean,
        p_base_currency: currency,
        p_amount_input: amountValue
      });

      if (error) {
        console.error('Invoice creation error:', error);
        toast({
          title: "Error",
          description: error.message || "Gagal membuat invoice",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const invoice = data[0];
        
        // Show referral status messages
        if (invoice.referral_valid === false && sponsorCode) {
          toast({
            title: "Peringatan Referral",
            description: `Kode referral "${sponsorCode}" tidak ditemukan. Invoice dibuat tanpa bonus sponsor.`,
            variant: "default",
          });
        } else if (invoice.referral_valid === true && sponsorCode) {
          toast({
            title: "Referral Valid",
            description: `Kode referral "${sponsorCode}" valid! Bonus sponsor ditambahkan.`,
            variant: "default",
          });
        }

        toast({
          title: "Invoice Berhasil Dibuat",
          description: `Invoice #${invoice.invoice_no} telah dibuat. Silakan lanjut ke pembayaran.`,
        });

        // Navigate to invoice detail
        navigate(`/id/invoice/${invoice.invoice_no}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat invoice",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // UI helpers
  const currencyLabels = {
    IDR: { label: 'Rupiah (IDR)', symbol: 'Rp', placeholder: '0' },
    USDC: { label: 'USDC', symbol: '$', placeholder: '0.00' },
    SOL: { label: 'SOL', symbol: 'SOL', placeholder: '0.0000' }
  };

  const placeholder = currencyLabels[currency].placeholder;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C]">
      <Helmet>
        <title>Beli TPC - TPC Global</title>
        <meta name="description" content="Beli token TPC di presale stage 1 dengan harga terbaik" />
      </Helmet>

      {/* Header */}
      <div className="bg-[#1E2329]/80 backdrop-blur-sm border-b border-[#2B3139]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={tpcLogo} alt="TPC" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-white">TPC Global</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/id')}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1E2329]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden">
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

                {/* Wallet TPC Input */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Alamat Wallet TPC
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan alamat wallet TPC Anda"
                    value={walletTpc}
                    onChange={(e) => setWalletTpc(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50"
                  />
                  <p className="text-xs text-[#848E9C] mt-2">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Pastikan alamat wallet benar. Transaksi tidak bisa dibatalkan.
                  </p>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/id/tutorial/phantom-wallet')}
                      className="text-xs text-[#F0B90B] hover:text-[#F8D56B] transition-colors"
                    >
                      Belum punya wallet? Lihat tutorial Phantom →
                    </button>
                  </div>
                </div>

                {/* Sponsor Code - AUTO ASSIGNMENT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white/90">
                      Kode Referral / Sponsor <span className="text-[#F0B90B]">*</span>
                    </div>
                    {refFromUrl ? (
                      <span className="text-[11px] text-white/50">Dari link sponsor</span>
                    ) : (
                      <span className="text-[11px] text-white/50">Auto assignment</span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={sponsorCode}
                    readOnly
                    placeholder="SPONSOR AKAN DITENTUKAN OTOMATIS"
                    className="w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] uppercase opacity-90 cursor-not-allowed"
                  />

                  {sponsorLoading && (
                    <div className="text-xs text-white/60 mt-2">Menentukan sponsor...</div>
                  )}

                  {!sponsorLoading && sponsorError && (
                    <div className="text-xs text-red-400 mt-2">{sponsorError}</div>
                  )}

                  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white/90">Sistem Sponsor Otomatis</div>
                        <div className="text-xs text-white/60">
                          {refFromUrl 
                            ? `Sponsor dari link: ${refFromUrl}`
                            : "Sponsor ditentukan otomatis untuk memastikan semua member memiliki upline."
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agreement */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agreement"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-sm text-[#848E9C]">
                    Saya menyetujui <button type="button" onClick={goToTerms} className="text-[#F0B90B] hover:underline">Syarat & Ketentuan</button> dan <button type="button" onClick={goToPrivacy} className="text-[#F0B90B] hover:underline">Kebijakan Privasi</button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-white font-semibold py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Lanjutkan Pembelian
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Helper Message */}
                {!sponsorCode && !sponsorLoading && (
                  <div className="text-center text-sm text-red-400">
                    {sponsorError || 'Menunggu penentuan sponsor otomatis...'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Countdown Card */}
            <CountdownCard
              targetDate={new Date(endAt)}
              title={label}
              className="bg-[#1E2329]/50 backdrop-blur-xl border border-[#1F2A33]"
            />

            {/* Token Info */}
            <Card className="bg-[#1E2329]/50 backdrop-blur-xl border border-[#1F2A33]">
              <CardHeader>
                <CardTitle className="text-white text-lg">Token Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C]">Harga Stage 1</span>
                  <span className="text-white font-semibold">$0.01</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C]">Total Supply Stage 1</span>
                  <span className="text-white font-semibold">100M TPC</span>
                </div>
                <Separator className="bg-[#2B3139]" />
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C]">Listing Price</span>
                  <span className="text-[#F0B90B] font-semibold">$0.05</span>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Preview */}
            {amountValue > 0 && (
              <Card className="bg-[#1E2329]/50 backdrop-blur-xl border border-[#1F2A33]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Perhitungan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">Jumlah {currencyLabels[currency].label}</span>
                    <span className="text-white font-semibold">
                      {currency === 'IDR' ? formatIdr(amountValue) : 
                       currency === 'USDC' ? formatUsdc(amountValue) : 
                       formatSol(amountValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">TPC yang Dapat</span>
                    <span className="text-white font-semibold">{formatTpc(tpcAmount)}</span>
                  </div>
                  {sponsorBonusAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#F0B90B]">Bonus Sponsor</span>
                      <span className="text-[#F0B90B] font-semibold">{formatTpc(sponsorBonusAmount)}</span>
                    </div>
                  )}
                  <Separator className="bg-[#2B3139]" />
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total TPC</span>
                    <span className="text-[#F0B90B] font-bold text-lg">{formatTpc(totalTPC)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
