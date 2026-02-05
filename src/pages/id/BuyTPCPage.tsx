import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { Coins, ArrowRight, Loader2, Shield, CheckCircle, ExternalLink, AlertTriangle, XCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID } from '@/lib/number';
import { calculateSponsorBonus } from '@/config/pricing';
import { formatIdr, parseIdr, formatUsdc, parseUsdc, formatSol, parseSol, formatTpc, clampDecimals } from '@/lib/formatters';
import { getSolUsdPrice } from '@/lib/prices';
import { calcTpc, USD_IDR, TPC_PRICE_USDC, TPC_PRICING, getTPCPriceInIDR } from '@/lib/tpcPricing';
import { getUsdToIdrRate } from '@/lib/fx';
import { getSolToUsdPrice } from '@/lib/cryptoPrice';
import { parseCurrencyInput, formatCurrencyInput, getCurrencyPlaceholder, getCurrencyHint, normalizeForSubmit, type Currency as MoneyCurrency } from '@/lib/money';
import { isValidSolanaAddress } from '@/lib/validators';
import { ORDER_RULES } from '@/lib/orderRules';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { buildLoginUrl } from '@/lib/authRedirect';
import { cn } from '@/lib/utils';
import CountdownCard from '@/components/CountdownCard';
import tpcLogo from '@/assets/tpc.png';

type Currency = MoneyCurrency;

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
  const { lang = 'id' } = useParams(); // Get lang from URL
  const { toast } = useToast();
  const { user } = useAuth(); // Auth guard
  
  // AUTH GUARD: Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: 'Login Diperlukan',
        description: 'Silakan login terlebih dahulu sebelum membuat invoice.',
        variant: 'destructive'
      });
      navigate(buildLoginUrl(lang, location.pathname + location.search));
      return;
    }
  }, [user, navigate, toast, lang, location.pathname, location.search]);
  
  // Early return if user not ready
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0F1D] flex items-center justify-center">
        <div className="text-white">Mengarahkan ke halaman login...</div>
      </div>
    );
  }
  
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
  const [sponsorFallback, setSponsorFallback] = useState<boolean>(false);

  // EXISTING STATE
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [amountRaw, setAmountRaw] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [walletTpc, setWalletTpc] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [presaleConfig, setPresaleConfig] = useState<PresaleConfig | null>(null);
  
  // FX Rate state
  const [usdIdrRate, setUsdIdrRate] = useState<number>(17000); // Start with fallback
  const [rateSource, setRateSource] = useState<'realtime' | 'fallback'>('fallback');
  const [rateUpdatedAt, setRateUpdatedAt] = useState<number>(Date.now());
  
  // SOL Price state
  const [solUsdPrice, setSolUsdPrice] = useState<number>(100); // Start with fallback
  const [solSource, setSolSource] = useState<'realtime' | 'fallback'>('fallback');
  const [solPriceLoading, setSolPriceLoading] = useState(false);
  
  // Calculation state
  const [amountUsd, setAmountUsd] = useState<number>(0);
  const [tpcAmount, setTpcAmount] = useState<number>(0);
  
  // Validation state
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showWhyLocked, setShowWhyLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Navigation helpers
  const goToTerms = () => navigate('/id/syarat-ketentuan');
  const goToPrivacy = () => navigate('/id/kebijakan-privasi');

  // Helper: normalize amount for submission
  const normalizeAmountForSubmit = (curr: Currency, v: number) => {
    if (!Number.isFinite(v) || v <= 0) return 0;
    if (curr === 'IDR') return Math.trunc(v);           // integer
    if (curr === 'USDC') return Number(v.toFixed(2));  // max 2 decimals
    if (curr === 'SOL') return Number(v.toFixed(4));   // max 4 decimals
    return v;
  };

  // Initialize pending sponsor
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[ACTIVE_PAGE] BuyTPCPage ACTIVE: src/pages/id/BuyTPCPage.tsx');
      console.log('[ACTIVE_PAGE] BuyTPCPage @ FILE_PATH_HERE');
      console.log('[ACTIVE_PAGE] BuyTPCPage @ src/pages/id/BuyTPCPage.tsx');
    }
    
    let cancelled = false;

    async function initSponsor() {
      if (import.meta.env.DEV) {
        console.log('[SPONSOR] init start');
      }

      setSponsorLoading(true);
      setSponsorError('');

      const params = new URLSearchParams(window.location.search);
      const refFromUrl = (params.get('ref') || '').trim().toUpperCase();

      if (refFromUrl) {
        if (import.meta.env.DEV) {
          console.log('[SPONSOR] from URL:', refFromUrl);
        }
        localStorage.setItem(LS_KEY, refFromUrl);
        if (!cancelled) {
          setSponsorCode(refFromUrl);
          setSponsorLoading(false);
        }
        return;
      }

      const existing = (localStorage.getItem(LS_KEY) || '').trim().toUpperCase();
      if (existing) {
        if (import.meta.env.DEV) {
          console.log('[SPONSOR] from localStorage:', existing);
        }
        if (!cancelled) {
          setSponsorCode(existing);
          setSponsorLoading(false);
        }
        return;
      }

      if (import.meta.env.DEV) {
        console.log('[SPONSOR] fetching random sponsor via RPC...');
      }
      const { data, error } = await supabase.rpc('get_random_referral_code' as any);

      if (cancelled) return;

      if (error) {
        console.error('[SPONSOR] RPC error:', error);
        console.error('[SPONSOR] RPC error details:', error.message);
        
        // Fallback to TPC-GLOBAL if RPC fails
        const fallbackCode = 'TPC-GLOBAL';
        if (import.meta.env.DEV) {
          console.log('[SPONSOR] Using fallback code:', fallbackCode);
        }
        localStorage.setItem(LS_KEY, fallbackCode);
        setSponsorCode(fallbackCode);
        setSponsorFallback(true);
        setSponsorLoading(false);
        return;
      }

      const code = (data || '').toString().trim().toUpperCase();
      if (import.meta.env.DEV) {
        console.log('[SPONSOR] RPC returned data:', data);
        console.log('[SPONSOR] Processed code:', code);
      }

      if (!code) {
        console.error('[SPONSOR] RPC returned empty data');
        
        // Fallback to TPC-GLOBAL if empty
        const fallbackCode = 'TPC-GLOBAL';
        if (import.meta.env.DEV) {
          console.log('[SPONSOR] Using fallback code for empty response:', fallbackCode);
        }
        localStorage.setItem(LS_KEY, fallbackCode);
        setSponsorCode(fallbackCode);
        setSponsorFallback(true);
        setSponsorLoading(false);
        return;
      }

      // Check if returned code is fallback
      const isFallback = code === 'TPC-GLOBAL';
      setSponsorFallback(isFallback);
      
      if (import.meta.env.DEV) {
        console.log('[SPONSOR] random sponsor result:', code, isFallback ? '(fallback)' : '(random)');
      }
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

  // Fetch FX rate (non-blocking)
  useEffect(() => {
    let cancelled = false;
    
    const fetchFxRate = async () => {
      try {
        const result = await getUsdToIdrRate();
        
        if (!cancelled) {
          setUsdIdrRate(result.rate);
          setRateSource(result.source);
          setRateUpdatedAt(Date.now());
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.debug('[FX] Rate fetch failed:', error);
        }
        // Keep fallback values if fetch fails
      }
    };
    
    // Start with fallback, then fetch realtime
    fetchFxRate();
    
    return () => { cancelled = true; };
  }, []);

  // Fetch SOL price (non-blocking)
  useEffect(() => {
    let cancelled = false;
    
    const fetchSolPrice = async () => {
      try {
        setSolPriceLoading(true);
        const result = await getSolToUsdPrice();
        
        if (!cancelled) {
          setSolUsdPrice(result.price);
          setSolSource(result.source);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.debug('[SOL] Price fetch failed:', error);
        }
        // Keep fallback values if fetch fails
      } finally {
        if (!cancelled) {
          setSolPriceLoading(false);
        }
      }
    };
    
    // Start with fallback, then fetch realtime
    fetchSolPrice();
    
    return () => { cancelled = true; };
  }, []);

  // Fetch presale config
  useEffect(() => {
    const fetchPresaleConfig = async () => {
      try {
        const config = {
          stage1_started_at: FALLBACK_STAGE1_STARTED_AT,
          stage1_duration_days: 30,
          stage1_supply: 200000000,
          stage1_price_usd: TPC_PRICING.stage1_usdc,
          stage2_supply: 50000000,
          stage2_price_usd: TPC_PRICING.stage2_usdc,
          listing_price_usd: TPC_PRICING.listing_target_usdc,
        };
        setPresaleConfig(config);
      } catch (error) {
        console.error('Failed to fetch presale config:', error);
      }
    };

    fetchPresaleConfig();
  }, []);

  // Calculate USD and TPC amounts when inputs change
  useEffect(() => {
    let usd = 0;
    
    // Calculate USD based on currency
    switch (currency) {
      case 'USDC':
        usd = amountValue;
        break;
      case 'IDR':
        usd = amountValue / usdIdrRate;
        break;
      case 'SOL':
        usd = amountValue * solUsdPrice;
        break;
    }
    
    setAmountUsd(usd);
    
    // Calculate TPC amount (using stage 1 price)
    const tpc = usd / TPC_PRICING.stage1_usdc;
    setTpcAmount(tpc);
  }, [amountValue, currency, usdIdrRate, solUsdPrice]);

  // Handle currency switching while preserving USD value
  useEffect(() => {
    if (amountUsd === 0) return;
    
    let newValue = 0;
    
    switch (currency) {
      case 'USDC':
        newValue = amountUsd;
        break;
      case 'IDR':
        newValue = amountUsd * usdIdrRate;
        break;
      case 'SOL':
        newValue = amountUsd / solUsdPrice;
        break;
    }
    
    setAmountValue(newValue);
    setAmountRaw(formatCurrencyInput(newValue, currency));
  }, [currency]); // Only run when currency changes

  // Currency-specific input handlers
  const handleAmountChange = (value: string) => {
    setAmountRaw(value);
    const parsedValue = parseCurrencyInput(value, currency);
    setAmountValue(parsedValue);
    setTouched(true);
  };

  const handleAmountBlur = () => {
    const formattedValue = formatCurrencyInput(amountValue, currency);
    setAmountRaw(formattedValue);
    setTouched(true);
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setTouched(true);
  };

  // Helper functions
  const isFiniteNumber = (n: number): boolean => {
    return typeof n === 'number' && isFinite(n) && !isNaN(n);
  };

  const safeNumber = (n: number): number => {
    return isFiniteNumber(n) ? n : 0;
  };

  // Quick-suggest chips handler
  const handleQuickSuggest = (targetTpc: number) => {
    const targetUsd = targetTpc * TPC_PRICING.stage1_usdc;
    let newValue = 0;
    
    switch (currency) {
      case 'USDC':
        newValue = targetUsd;
        break;
      case 'IDR':
        newValue = targetUsd * usdIdrRate;
        break;
      case 'SOL':
        newValue = targetUsd / solUsdPrice;
        break;
    }
    
    setAmountValue(newValue);
    setAmountRaw(formatCurrencyInput(newValue, currency));
    setTouched(true);
  };

  // Validation logic with useMemo to prevent re-renders
  const validation = useMemo(() => {
    const reasons: string[] = [];
    
    // Check terms agreement
    if (!agreed) {
      reasons.push("Setujui Syarat & Ketentuan terlebih dahulu.");
    }
    
    // Check amount value
    if (!isFiniteNumber(amountValue) || amountValue <= 0) {
      reasons.push("Masukkan jumlah pembelian.");
    }
    
    // Check wallet TPC
    if (!walletTpc || walletTpc.trim().length < 32) {
      reasons.push("Alamat wallet TPC wajib diisi (minimal 32 karakter).");
    } else if (!isValidSolanaAddress(walletTpc.trim())) {
      reasons.push("Alamat wallet tidak valid. Gunakan alamat Phantom Wallet (Solana / base58).");
    }
    
    // Check USD amount
    if (!isFiniteNumber(amountUsd) || amountUsd <= 0) {
      reasons.push("Jumlah USD tidak valid.");
    } else if (amountUsd < ORDER_RULES.MIN_USD_ORDER) {
      reasons.push(`Minimal pembelian setara ${ORDER_RULES.MIN_USD_ORDER} USDC.`);
    }
    
    // Check TPC amount
    if (!isFiniteNumber(tpcAmount) || tpcAmount <= 0) {
      reasons.push("Perhitungan TPC tidak valid.");
    } else if (tpcAmount < ORDER_RULES.MIN_TPC_ORDER) {
      reasons.push(`Minimal pembelian ${ORDER_RULES.MIN_TPC_ORDER.toLocaleString('id-ID')} TPC.`);
    }
    
    return {
      ok: reasons.length === 0,
      reasons
    };
  }, [agreed, amountValue, amountUsd, tpcAmount]);

  const ctaDisabled = !validation.ok;

  // Wallet validation
  const walletClean = walletTpc.trim();
  const walletBase58Ok = isValidSolanaAddress(walletClean);

  // Derived checklist for "Why locked?" panel
  const validationChecklist = useMemo(() => {
    return {
      termsOk: agreed,
      amountOk: isFiniteNumber(amountValue) && amountValue > 0,
      walletOk: walletBase58Ok,
      minUsdOk: isFiniteNumber(amountUsd) && amountUsd >= ORDER_RULES.MIN_USD_ORDER,
      minTpcOk: isFiniteNumber(tpcAmount) && tpcAmount >= ORDER_RULES.MIN_TPC_ORDER,
    };
  }, [agreed, amountValue, amountUsd, tpcAmount, walletBase58Ok]);

  // Calculate derived values
  const sponsorBonus = amountValue >= 1000000 ? calculateSponsorBonus(amountValue) : 0;
  const sponsorBonusAmount = typeof sponsorBonus === 'number' ? sponsorBonus : sponsorBonus?.bonus_amount || 0;
  const totalTPC = tpcAmount + sponsorBonusAmount;

  const amountSubmit = useMemo(() => normalizeAmountForSubmit(currency, amountValue), [currency, amountValue]);

  const isValid = amountSubmit > 0 && walletBase58Ok && agreed && !!userEmail && !!sponsorCode && !sponsorLoading && !sponsorError;

  const handleContinue = async () => {
    setSubmitAttempted(true);
    setSubmitError(null);

    if (!validation.ok) {
      // Auto-open "Why locked?" panel if validation fails
      setShowWhyLocked(true);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Prepare payload
      if (!userEmail) {
        setSubmitError('User email tidak ditemukan. Silakan login kembali.');
        return;
      }

      if (sponsorLoading || !sponsorCode) {
        setSubmitError('Sponsor belum siap. Tunggu sebentar...');
        return;
      }

      // Create invoice using existing RPC
      const referralClean = sponsorCode.trim().toUpperCase();
      
      const { data, error } = await supabase.rpc('create_invoice_locked', {
        p_email: userEmail.toLowerCase().trim(),
        p_referral_code: referralClean,
        p_base_currency: currency,
        p_amount_input: amountSubmit,
        p_wallet_tpc: walletClean
      });

      if (error) {
        console.error('Invoice creation error:', error);
        
        // Handle auth required error
        if (error.message?.includes('AUTH_REQUIRED')) {
          toast({
            title: 'Login Diperlukan',
            description: 'Silakan login dulu sebelum membuat invoice.',
            variant: 'destructive'
          });
          navigate(buildLoginUrl(lang, location.pathname + location.search));
          return;
        }
        
        // Human-friendly error messages
        if (error.message?.includes('Wallet TPC wajib diisi')) {
          setSubmitError('Wallet TPC wajib diisi (minimal 32 karakter).');
        } else if (currency === 'IDR' && error.message?.includes('Nominal IDR')) {
          setSubmitError('Nominal IDR harus tanpa desimal. Contoh: 10.000.000');
        } else if (currency === 'USDC' && error.message?.includes('2 angka desimal')) {
          setSubmitError('USDC maksimal 2 angka desimal. Contoh: 1000.00');
        } else if (currency === 'SOL' && error.message?.includes('4 angka desimal')) {
          setSubmitError('SOL maksimal 4 angka desimal. Contoh: 0.0010');
        } else {
          setSubmitError(error.message || 'Gagal membuat invoice. Coba lagi beberapa saat.');
        }
        return;
      }

      if (data) {
        // FIX: Handle SETOF return type - data could be array or single object
        const invoice = Array.isArray(data) ? data[0] : data;
        
        // DEV-only debug log
        if (import.meta.env.DEV) {
          console.log('[INVOICE_RPC]', invoice);
        }
        
        // HARD ERROR: Validate invoice has valid invoice_no
        if (!invoice || typeof invoice.invoice_no !== 'string') {
          setSubmitError('Invoice berhasil dibuat, tapi ID tidak valid. Hubungi admin.');
          console.error('[INVOICE_ERROR] Invalid invoice data:', invoice);
          return;
        }
        
        // Show referral status messages (if available)
        if ('referral_valid' in invoice) {
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
        }

        toast({
          title: "Invoice Berhasil Dibuat",
          description: `Invoice #${invoice.invoice_no} telah dibuat. Silakan lanjut ke pembayaran.`,
        });

        // Navigate to member invoice detail (AUTHENTICATED ONLY)
        const safeLang = lang === 'en' ? 'en' : 'id';
        console.log(`[BUY_TPC] Redirecting to member invoice detail: /${safeLang}/member/invoices/${invoice.invoice_no}`);
        navigate(`/${safeLang}/member/invoices/${invoice.invoice_no}`, { replace: true });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Gagal membuat invoice. Coba lagi atau periksa koneksi.');
      if (import.meta.env.DEV) console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI helpers
  const currencyLabels = {
    IDR: { label: 'Rupiah (IDR)', symbol: 'Rp' },
    USDC: { label: 'USDC', symbol: '$' },
    SOL: { label: 'SOL', symbol: 'SOL' }
  };

  const placeholder = getCurrencyPlaceholder(currency);
  const hint = getCurrencyHint(currency);

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

      {/* Countdown Section - Top */}
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <CountdownCard
            targetIso={endAt}
            label={label}
            className="bg-[#1E2329]/50 backdrop-blur-xl border border-[#1F2A33]"
          />
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
                  <p className="text-xs text-[#848E9C] mt-2">
                    {hint}
                  </p>
                  
                  {/* Quick-suggest chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleQuickSuggest(1000)}
                      className="px-3 py-1 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 border border-[#F0B90B]/30 rounded-lg text-xs text-[#F0B90B] transition-colors"
                    >
                      Pas 1.000 TPC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSuggest(2500)}
                      className="px-3 py-1 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 border border-[#F0B90B]/30 rounded-lg text-xs text-[#F0B90B] transition-colors"
                    >
                      2.500 TPC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSuggest(5000)}
                      className="px-3 py-1 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 border border-[#F0B90B]/30 rounded-lg text-xs text-[#F0B90B] transition-colors"
                    >
                      5.000 TPC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSuggest(10000)}
                      className="px-3 py-1 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 border border-[#F0B90B]/30 rounded-lg text-xs text-[#F0B90B] transition-colors"
                    >
                      10.000 TPC
                    </button>
                  </div>
                </div>

                {/* Wallet TPC Input */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Alamat Wallet TPC (Phantom / Solana)
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan alamat wallet pribadi Anda"
                    value={walletTpc}
                    onChange={(e) => setWalletTpc(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50"
                  />
                  <p className="text-xs text-[#848E9C] mt-2">
                    Masukkan alamat wallet pribadi Anda (Phantom – jaringan Solana).
                    Token TPC akan dikirim ke alamat ini setelah pembayaran diverifikasi.
                  </p>
                  <p className="text-xs text-amber-400 mt-1">
                    ⚠️ Pastikan alamat benar. Token yang sudah dikirim tidak dapat dibatalkan.
                  </p>
                  {walletTpc && !walletBase58Ok && (
                    <p className="mt-1 text-xs text-red-400">
                      Alamat wallet tidak valid. Gunakan alamat Phantom Wallet (Solana / base58).
                    </p>
                  )}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/id/tutorial/phantom-wallet')}
                      className="text-xs text-[#F0B90B] hover:text-[#F8D56B] transition-colors"
                    >
                      Belum punya wallet Phantom? Pelajari cara membuatnya di sini →
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-[#848E9C]">
                    💡 TPC adalah token non-custodial.
                    Hanya wallet yang Anda miliki private key-nya yang bisa menerima token.
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

                  {!sponsorLoading && sponsorFallback && (
                    <div className="text-xs text-amber-400 mt-2">Fallback sponsor dipakai</div>
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
                    onCheckedChange={(checked) => {
                      setAgreed(checked as boolean);
                      setTouched(true);
                    }}
                    className="mt-1"
                  />
                  <div className="text-sm text-[#848E9C]">
                    Saya menyetujui <button type="button" onClick={goToTerms} className="text-[#F0B90B] hover:underline">Syarat & Ketentuan</button> dan <button type="button" onClick={goToPrivacy} className="text-[#F0B90B] hover:underline">Kebijakan Privasi</button>
                  </div>
                </div>

                {/* Error Message */}
                {(touched || submitAttempted) && !validation.ok && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-400">
                      {validation.reasons[0]}
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="button"
                  disabled={ctaDisabled || isSubmitting}
                  onClick={handleContinue}
                  className={cn(
                    "w-full font-semibold py-3 transition-all",
                    ctaDisabled 
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50" 
                      : "bg-[#F0B90B] hover:bg-[#F8D56B] text-white"
                  )}
                >
                  {isSubmitting ? (
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

                {/* Submit Error */}
                {submitError && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-400">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Why locked? panel */}
                {ctaDisabled && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowWhyLocked(!showWhyLocked)}
                      className="text-xs text-[#848E9C] hover:text-[#F0B90B] transition-colors flex items-center gap-1"
                    >
                      Kenapa tombol terkunci?
                      <ArrowRight className={`h-3 w-3 transition-transform ${showWhyLocked ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {showWhyLocked && (
                      <div className="mt-3 bg-[#1E2329]/50 backdrop-blur-xl border border-[#2B3139] rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          {validationChecklist.termsOk ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${validationChecklist.termsOk ? 'text-green-400' : 'text-red-400'}`}>
                            Syarat & Ketentuan disetujui
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {validationChecklist.amountOk ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${validationChecklist.amountOk ? 'text-green-400' : 'text-red-400'}`}>
                            Jumlah input valid
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {validationChecklist.walletOk ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${validationChecklist.walletOk ? 'text-green-400' : 'text-red-400'}`}>
                            Alamat Wallet TPC terisi
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {validationChecklist.minUsdOk ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${validationChecklist.minUsdOk ? 'text-green-400' : 'text-red-400'}`}>
                            Minimal 10 USDC
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {validationChecklist.minTpcOk ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${validationChecklist.minTpcOk ? 'text-green-400' : 'text-red-400'}`}>
                            Minimal 1.000 TPC
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
            {/* Token Info */}
            <Card className="bg-[#1E2329]/50 backdrop-blur-xl border border-[#1F2A33]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-lg">Token Info</CardTitle>
                  <Badge 
                    variant={rateSource === 'realtime' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs px-2 py-1",
                      rateSource === 'realtime' 
                        ? "bg-green-500/20 text-green-400 border-green-500/30" 
                        : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    )}
                  >
                    {rateSource === 'realtime' ? 'Realtime FX' : 'Fallback FX'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C]">Harga Stage 1</span>
                  <div className="text-right">
                    <span className="text-white font-semibold">${TPC_PRICING.stage1_usdc.toFixed(3)}</span>
                    <div className="text-[#848E9C] text-xs">≈ Rp {formatNumberID(getTPCPriceInIDR(usdIdrRate, 'stage1_usdc'))}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C]">Harga Stage 2</span>
                  <div className="text-right">
                    <span className="text-white font-semibold">${TPC_PRICING.stage2_usdc.toFixed(3)}</span>
                    <div className="text-[#848E9C] text-xs">≈ Rp {formatNumberID(getTPCPriceInIDR(usdIdrRate, 'stage2_usdc'))}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C]">Total Supply Stage 1</span>
                  <span className="text-white font-semibold">200M TPC</span>
                </div>
                <Separator className="bg-[#2B3139]" />
                <div className="flex justify-between items-center">
                  <span className="text-[#848E9C]">Target Listing DEX</span>
                  <div className="text-right">
                    <span className="text-[#F0B90B] font-semibold">${TPC_PRICING.listing_target_usdc.toFixed(3)}</span>
                    <div className="text-[#848E9C] text-xs">≈ Rp {formatNumberID(getTPCPriceInIDR(usdIdrRate, 'listing_target_usdc'))}</div>
                  </div>
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
                    <span className="text-[#848E9C]">Jumlah Input</span>
                    <span className="text-white font-semibold">
                      {formatCurrencyInput(amountValue, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">Estimasi USD</span>
                    <span className="text-white font-semibold">
                      ${amountUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">TPC yang didapat</span>
                    <span className="text-white font-semibold">
                      {safeNumber(tpcAmount) <= 0 ? '0' : 
                       safeNumber(tpcAmount) >= 1000 ? safeNumber(tpcAmount).toFixed(2) : safeNumber(tpcAmount).toFixed(4)}
                    </span>
                  </div>
                  
                  {/* Progress bar towards minimum order */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#848E9C]">Progress minimal</span>
                      <span className="text-[#848E9C]">
                        {safeNumber(tpcAmount).toLocaleString('id-ID')} / {ORDER_RULES.MIN_TPC_ORDER.toLocaleString('id-ID')} TPC
                      </span>
                    </div>
                    <div className="w-full bg-[#2B3139] rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (safeNumber(tpcAmount) / ORDER_RULES.MIN_TPC_ORDER) * 100)}%` }}
                      />
                    </div>
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
                  
                  {/* Price source badges */}
                  <div className="flex gap-2 pt-2">
                    <Badge 
                      variant={rateSource === 'realtime' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs px-2 py-1",
                        rateSource === 'realtime' 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      )}
                    >
                      FX: {rateSource === 'realtime' ? 'Realtime FX' : 'Fallback FX'}
                    </Badge>
                    <Badge 
                      variant={solSource === 'realtime' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs px-2 py-1",
                        solSource === 'realtime' 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      )}
                    >
                      SOL: {solSource === 'realtime' ? 'Realtime SOL' : 'Fallback SOL'}
                    </Badge>
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
