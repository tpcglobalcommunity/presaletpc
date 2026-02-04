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
  
  // NEW REFERRAL STATE IMPLEMENTATION
  const refFromUrlRaw = (searchParams.get('ref') || '').trim();
  const refFromUrl = refFromUrlRaw ? refFromUrlRaw.toUpperCase() : '';
  const isUrlReferral = !!refFromUrl;

  const [referral, setReferral] = useState<string>(refFromUrl);
  const [referralConfirmed, setReferralConfirmed] = useState<boolean>(isUrlReferral);
  const [referralValid, setReferralValid] = useState<boolean>(false);
  const [referralChecking, setReferralChecking] = useState<boolean>(false);
  const [referralError, setReferralError] = useState<string>('');

  const [suggestedReferral, setSuggestedReferral] = useState<string>('');
  const [suggestionLoading, setSuggestionLoading] = useState<boolean>(false);

  const debounceRef = useRef<number | null>(null);

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
        // For now, use fallback config
        const config: PresaleConfig = {
          stage1_started_at: FALLBACK_STAGE1_STARTED_AT,
          stage1_duration_days: 30,
          stage1_supply: 100000000,
          stage1_price_usd: 0.001,
          stage2_supply: 200000000,
          stage2_price_usd: 0.002,
          listing_price_usd: 0.005
        };
        setPresaleConfig(config);
      } catch (error) {
        console.error('Failed to fetch presale config:', error);
      }
    };

    fetchPresaleConfig();
  }, []);

  // Get current user and ensure sponsor assignment
  useEffect(() => {
    const ensureSponsorAssignment = async () => {
      if (sponsorEnsured.current) return; // Only run once per session
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserEmail(user.email || null);

      try {
        // Get ref from URL
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get("ref");

        // Assign sponsor (server-side)
        const { data: assigned, error: assignErr } = await supabase.rpc('assign_sponsor', { 
          p_ref_code: refCode ?? null 
        });

        if (assignErr) {
          console.error('Sponsor assignment error:', assignErr);
        }

        // Fetch sponsor from DB
        const { data: sponsorRow, error: sponsorErr } = await supabase.rpc('get_my_sponsor');
        const sponsor = Array.isArray(sponsorRow) ? sponsorRow[0] : sponsorRow;

        if (sponsorErr) {
          console.error('Sponsor fetch error:', sponsorErr);
          return;
        }

        if (sponsor && sponsor.sponsor_code) {
          setReferralCode(sponsor.sponsor_code);
          setSponsorLocked(true);
          
          // Set sponsor source from assignment reason
          const reason = assigned?.[0]?.reason || 'assigned_hrw';
          setSponsorSource(reason);
          
          sponsorEnsured.current = true;
          console.log('[SPONSOR] Ensured:', {
            sponsorCode: sponsor.sponsor_code,
            source: reason,
            locked: true
          });
        } else {
          // No sponsor available
          setSponsorSource('no_eligible_sponsor');
          sponsorEnsured.current = true;
        }
      } catch (error) {
        console.error('Sponsor ensure error:', error);
        sponsorEnsured.current = true; // Don't retry on error
      }
    };

    ensureSponsorAssignment();
  }, []);

  // Referral validation with debounce
  useEffect(() => {
    const validateReferral = async () => {
      // Get current user to check self-referral
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      try {
        const result = await validateSponsor(referralCode);
        
        // Debug: log validation result
        console.log('[REFERRAL] check', result.code, { 
          found: result.found, 
          sponsorId: result.sponsorId, 
          hasError: !!result.error 
        });

        if (!result.found) {
          // If sponsor is empty, it's optional - no error
          if (result.code === '') {
            setReferralValid(null);
            setReferralError('');
            setSponsorInfo(null);
          } else {
            setReferralValid(false);
            setReferralError('Kode referral tidak terdaftar');
            setSponsorInfo(null);
          }
          return;
        }

        // Check self-referral
        if (result.sponsorId === currentUserId) {
          setReferralValid(false);
          setReferralError('Tidak boleh pakai kode sendiri');
          setSponsorInfo(null);
          return;
        }

        setReferralValid(true);
        setReferralError('');
        setSponsorInfo({ member_code: result.code, id: result.sponsorId });
      } catch (error) {
        setReferralValid(false);
        setReferralError('Gagal memvalidasi referral');
        setSponsorInfo(null);
      }
    };

    const timeoutId = setTimeout(validateReferral, 500);
    return () => clearTimeout(timeoutId);
  }, [referralCode]);

  // Helper function to normalize sponsor code
const normalizeSponsor = (v: string) => v.trim().toUpperCase();

// Helper function to validate sponsor via RPC (RLS-safe)
async function validateSponsor(codeRaw: string) {
  const code = normalizeSponsor(codeRaw || "");
  if (!code) {
    return { found: true, sponsorId: null, code: "" }; // sponsor optional
  }

  const { data, error } = await supabase
    .rpc('public_validate_member_code', { p_code: code })
    .maybeSingle();

  // RLS-safe: error biasanya null, data null jika tidak ada
  if (error) {
    return { found: false, sponsorId: null, code, error };
  }

  if (!data?.id) {
    return { found: false, sponsorId: null, code, error: null };
  }

  return { found: true, sponsorId: data.id, code, error: null };
}

// Calculate derived values
  const tpcAmount = calcTpc(currency, amountValue, solUsdPrice);
  const sponsorBonus = amountValue >= 1000000 ? calculateSponsorBonus(amountValue) : 0;
  const sponsorBonusAmount = typeof sponsorBonus === 'number' ? sponsorBonus : sponsorBonus?.bonus_amount || 0;
  const totalTPC = tpcAmount + sponsorBonusAmount;

  const isValid = amountValue > 0 && walletTpc.trim().length >= 20 && agreed && userEmail !== null;

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

    // Hard block: Ensure sponsor is assigned
    if (!referralCode) {
      toast({
        title: "Error",
        description: "Kode referral tidak boleh kosong. Sistem sedang menentukan sponsor, coba refresh atau hubungi admin.",
        variant: "destructive",
      });
      return;
    }

    if (sponsorSource === 'no_eligible_sponsor') {
      toast({
        title: "Error", 
        description: "Sponsor belum tersedia. Hubungi admin untuk bantuan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Assign sponsor using HRW algorithm (double-check)
      const referralClean = referralCode ? sanitizeReferral(referralCode) : null;
      
      const { data: sponsorData, error: sponsorError } = await supabase.rpc('assign_sponsor', {
        p_ref_code: referralClean
      });

      if (sponsorError) {
        console.error('Sponsor assignment error:', sponsorError);
      } else if (sponsorData && Array.isArray(sponsorData) && sponsorData.length > 0) {
        const sponsor = sponsorData[0];
        console.log('Sponsor assignment:', {
          assigned: sponsor.assigned,
          sponsorCode: sponsor.sponsor_code,
          reason: sponsor.reason
        });
        
        // Show toast for different assignment reasons
        if (sponsor.reason === 'assigned_from_ref') {
          toast({
            title: "Referral Valid",
            description: `Sponsor: ${sponsor.sponsor_code}`,
          });
        } else if (sponsor.reason === 'assigned_hrw') {
          toast({
            title: "Sistem Assign Sponsor",
            description: `Sponsor otomatis: ${sponsor.sponsor_code}`,
          });
        } else if (sponsor.reason === 'already_assigned') {
          console.log('Already assigned to:', sponsor.sponsor_code);
        }
      }

      // Call locked RPC function instead of direct insert
      const { data, error } = await supabase.rpc('create_invoice_locked', {
        p_email: userEmail.toLowerCase().trim(),
        p_referral_code: referralClean,          // ✅ WAJIB, tidak null
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
      
      // Type guard untuk memastikan invoice memiliki invoice_no
      if (!invoice || typeof invoice !== 'object' || !('invoice_no' in invoice)) {
        throw new Error('Invalid invoice data returned');
      }

      // Check referral validation feedback
      if (invoice.referral_valid === false && referralCode) {
        toast({
          title: "Peringatan Referral",
          description: `Kode referral "${referralCode}" tidak ditemukan. Invoice dibuat tanpa bonus sponsor.`,
          variant: "default",
        });
      } else if (invoice.referral_valid === true && referralCode) {
        toast({
          title: "Referral Valid",
          description: `Kode referral "${referralCode}" valid! Bonus sponsor ditambahkan.`,
          variant: "default",
        });
      }

      // Update wallet_tpc after invoice is created
      if (invoice && 'invoice_no' in invoice) {
        const { error: updateError } = await supabase
          .from('invoices')
          .update({ wallet_tpc: walletTpc.trim() })
          .eq('invoice_no', invoice.invoice_no);

        if (updateError) {
          console.error('Error updating wallet_tpc:', updateError);
          // Continue anyway, invoice is created
        }
      }

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
      <Helmet>
        <title>Beli TPC - Bergabung dengan Ekosistem TPC Global</title>
        <meta name="description" content="Beli token TPC sekarang dengan harga presale terbaik. Proses aman, transparan, dan edukasi-only. Bergabung dengan komunitas TPC Global hari ini." />
        <meta property="og:title" content="Beli TPC - Bergabung dengan Ekosistem TPC Global" />
        <meta property="og:description" content="Beli token TPC sekarang dengan harga presale terbaik. Proses aman, transparan, dan edukasi-only. Bergabung dengan komunitas TPC Global hari ini." />
        <meta property="og:url" content="https://tpcglobal.io/id/buytpc" />
        <meta property="og:image" content="https://tpcglobal.io/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Beli TPC - Bergabung dengan Ekosistem TPC Global" />
        <meta name="twitter:description" content="Beli token TPC sekarang dengan harga presale terbaik. Proses aman, transparan, dan edukasi-only. Bergabung dengan komunitas TPC Global hari ini." />
        <meta name="twitter:image" content="https://tpcglobal.io/og.png" />
      </Helmet>
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
                  {presaleConfig ? presaleConfig.stage1_supply.toLocaleString('id-ID') : '100.000.000'} TPC — ${presaleConfig?.stage1_price_usd || '0.001'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#848E9C]">Tahap 2:</span>
                <span className="text-sm font-medium text-white">
                  {presaleConfig ? presaleConfig.stage2_supply.toLocaleString('id-ID') : '100.000.000'} TPC — ${presaleConfig?.stage2_price_usd || '0.002'}
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
                  <div className="text-xs mt-1">{info.symbol}</div>
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

            {/* Wallet TPC Input */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Alamat Wallet TPC
              </label>
              <input
                type="text"
                placeholder="Masukkan alamat wallet TPC"
                value={walletTpc}
                onChange={(e) => setWalletTpc(e.target.value)}
                className="w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50"
              />
              {walletTpc && walletTpc.trim().length < 20 && (
                <p className="mt-1 text-xs text-red-400">
                  Alamat wallet TPC wajib diisi (minimal 20 karakter)
                </p>
              )}
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

            {/* Referral Code */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Kode Referral (Sponsor)
              </label>

              <input
                type="text"
                placeholder={sponsorLocked ? "Loading sponsor..." : "Masukkan kode referral"}
                value={referralCode}
                onChange={(e) => setReferralCode(sanitizeReferral(e.target.value))}
                readOnly={sponsorLocked || !!refFromUrl}
                className={cn(
                  "w-full px-4 py-3 bg-[#1E2329] border border-[#2B3139] rounded-xl text-white placeholder-[#848E9C] uppercase focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50",
                  (sponsorLocked || !!refFromUrl) && "opacity-90 cursor-not-allowed bg-[#2B3139]",
                  sponsorSource === 'no_eligible_sponsor' && "border-red-500/50",
                  sponsorLocked && "border-emerald-500/50"
                )}
              />

              {/* Sponsor Source Badge */}
              {sponsorSource && (
                <div className="mt-2">
                  {sponsorSource === 'assigned_from_ref' && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                      Sponsor otomatis
                    </Badge>
                  )}
                  {sponsorSource === 'assigned_hrw' && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      Sponsor sistem
                    </Badge>
                  )}
                  {sponsorSource === 'already_assigned' && (
                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                      Sponsor sudah ada
                    </Badge>
                  )}
                  {sponsorSource === 'no_eligible_sponsor' && (
                    <div className="text-xs text-red-400">
                      ⚠️ Sponsor belum tersedia, hubungi admin
                    </div>
                  )}
                </div>
              )}

              {/* Referral Validation Status (Legacy) */}
              {referralCode.trim() && !sponsorLocked && (
                <div className="mt-2">
                  {referralValid === true && sponsorInfo && (
                    <div className="text-xs text-emerald-400">
                      ✅ Referral valid - Sponsor: {sponsorInfo.member_code}
                    </div>
                  )}
                  {referralValid === false && referralError && (
                    <div className="text-xs text-red-400">
                      ❌ {referralError}
                    </div>
                  )}
                </div>
              )}

              {refFromUrl && (
                <p className="mt-2 text-xs text-[#F0B90B]">
                  Referral terisi otomatis dari link.
                </p>
              )}
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
                      +{formatTpc(sponsorBonusAmount)} TPC
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
