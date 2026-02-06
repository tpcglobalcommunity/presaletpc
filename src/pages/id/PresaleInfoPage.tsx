import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Clock, 
  TrendingUp, 
  Target, 
  Zap, 
  Rocket, 
  DollarSign,
  BarChart3,
  Shield,
  Globe,
  Star
} from 'lucide-react';
import tpcLogo from '@/assets/tpc.png';

interface PresaleConfig {
  stage1_started_at: number;
  stage1_duration_days: number;
  stage1_supply: number;
  stage1_price_usd: number;
  stage2_supply: number;
  stage2_price_usd: number;
  listing_price_usd: number;
}

export default function PresaleInfoPage() {
  const { lang = 'id' } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [presaleConfig, setPresaleConfig] = useState<PresaleConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback configuration
  const fallbackConfig: PresaleConfig = {
    stage1_started_at: new Date('2026-02-01T00:00:00+07:00').getTime(),
    stage1_duration_days: 180, // 6 months
    stage1_supply: 200000000, // 200 million
    stage1_price_usd: 0.001,
    stage2_supply: 100000000, // 100 million - next sale after stage 1
    stage2_price_usd: 0.002,
    listing_price_usd: 0.005
  };

  useEffect(() => {
    const fetchPresaleConfig = async () => {
      try {
        const { data, error } = await supabase.rpc('get_presale_stage_config' as any);
        if (error) {
          console.error('Error fetching presale config:', error);
          setPresaleConfig(fallbackConfig);
        } else if (data) {
          setPresaleConfig(data as PresaleConfig);
        } else {
          setPresaleConfig(fallbackConfig);
        }
      } catch (error) {
        console.error('Error:', error);
        setPresaleConfig(fallbackConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchPresaleConfig();
  }, []);

  const config = presaleConfig || fallbackConfig;
  
  // Calculate countdown
  const calculateCountdown = () => {
    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    const endTime = new Date(config.stage1_started_at + (config.stage1_duration_days * 24 * 60 * 60 * 1000));
    const timeLeft = endTime.getTime() - jakartaTime.getTime();
    
    if (timeLeft <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, expired: false };
  };

  const [countdown, setCountdown] = useState(calculateCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  // Calculate progress using config values
  const stage1Progress = countdown.expired ? 100 : Math.min(100, ((config.stage1_duration_days - countdown.days) / config.stage1_duration_days) * 100);
  const stage1Raised = (200000000 * stage1Progress) / 100;
  const stage2Raised = 0; // Stage 2 hasn't started

  // Helper functions
  const formatMillions = (n: number) => `${(n / 1_000_000).toFixed(0)}M`;

  // Handle buy button click with auth redirect
  const handleBuyClick = () => {
    if (isLoading) return; // Don't navigate while loading
    
    if (!user) {
      // Redirect to login with next parameter
      const nextPath = encodeURIComponent(`/${lang}/buytpc`);
      navigate(`/${lang}/login?next=${nextPath}`);
    } else {
      // Direct to buy page if authenticated
      navigate(`/${lang}/buytpc`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-96 md:h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section - Mobile Optimized */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center mb-3 md:mb-4">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 p-2 md:p-3 shadow-2xl backdrop-blur-sm ring-2 ring-amber-500/20">
                  <img
                    src={tpcLogo}
                    alt="TPC Logo"
                    className="h-8 w-8 md:h-12 md:w-12 object-contain"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent mb-2 md:mb-3 px-2">
              Presale TPC
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed px-2">
              Bergabung dengan masa depan keuangan terdesentralisasi
            </p>
          </div>

          {/* Presale Status Card - Compact */}
          <div className="mb-6 md:mb-8">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
              <CardContent className="p-4 md:p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-center mb-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs md:text-sm">
                    TAHAP 1 SEDANG BERLANGSUNG
                  </Badge>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-gray-400 mb-1">Total Presale</div>
                    <div className="text-xl md:text-2xl font-bold text-amber-400">300M TPC</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-gray-400 mb-1">Harga Tahap 1</div>
                    <div className="text-xl md:text-2xl font-bold text-amber-400">$0.001</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs md:text-sm mb-2">
                    <span>Progres</span>
                    <span>{stage1Progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={stage1Progress} className="h-2 md:h-3 bg-slate-700" />
                  <div className="text-xs text-gray-400 mt-1 text-center">
                    {formatMillions(stage1Raised)} / 200M TPC terkumpul
                  </div>
                </div>

                {/* Price Information - Legal Safe */}
                <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                    <span className="text-sm md:text-base font-semibold">Informasi Harga (Indikatif)</span>
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-amber-400 text-center">
                    $0.005
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 text-center">
                    Harga listing direncanakan di kisaran tertentu berdasarkan roadmap proyek.
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Informasi ini bersifat indikatif dan tidak mengikat. Harga dapat berubah mengikuti kondisi pasar.
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    Tidak menjamin keuntungan.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Countdown Timer - Mobile Optimized */}
          <div className="mb-6 md:mb-8">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
              <CardContent className="p-4 md:p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                    <Clock className="w-4 h-4 md:w-6 md:h-6 text-amber-400" />
                    <h2 className="text-lg md:text-xl font-bold">
                      Presale Berakhir Dalam
                    </h2>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs md:text-sm ml-2">
                      Waktu Jakarta
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700/50 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold text-amber-400 mb-1">{countdown.days}</div>
                      <div className="text-xs md:text-sm text-gray-400">Hari</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700/50 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold text-amber-400 mb-1">{countdown.hours}</div>
                      <div className="text-xs md:text-sm text-gray-400">Jam</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700/50 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold text-amber-400 mb-1">{countdown.minutes}</div>
                      <div className="text-xs md:text-sm text-gray-400">Menit</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700/50 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold text-amber-400 mb-1">{countdown.seconds}</div>
                      <div className="text-xs md:text-sm text-gray-400">Detik</div>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-gray-400">
                    Total Durasi: 6 Bulan
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tokenomics - Compact */}
          <div className="mb-6 md:mb-8">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 text-white overflow-hidden shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                  Tokenomika
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg md:text-xl font-bold text-green-400">66.7%</span>
                    </div>
                    <div className="font-semibold text-sm md:text-base">Tahap 1</div>
                    <div className="text-sm md:text-base text-gray-400">200M TPC</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg md:text-xl font-bold text-blue-400">33.3%</span>
                    </div>
                    <div className="font-semibold text-sm md:text-base">Tahap 2</div>
                    <div className="text-sm md:text-base text-gray-400">100M TPC</div>
                    <div className="text-xs text-gray-500 mt-1">Belum dimulai</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg md:text-xl font-bold text-amber-400">100%</span>
                    </div>
                    <div className="font-semibold text-sm md:text-base">Total Presale</div>
                    <div className="text-sm md:text-base text-gray-400">300M TPC</div>
                  </div>
                </div>

                {/* Tahap 2 Clarification */}
                <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    <span className="text-sm md:text-base font-semibold">Informasi Tahap 2</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    Total Presale terdiri dari Tahap 1 (200M TPC) dan Tahap 2 (100M TPC). Tahap 2 akan dibuka setelah Tahap 1 berakhir.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mt-4">
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    <Shield className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Terverifikasi</div>
                    <div className="text-xs text-gray-400">On-Chain</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    <Globe className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Akses Global</div>
                    <div className="text-xs text-gray-400">Worldwide</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    <Zap className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Transaksi Cepat</div>
                    <div className="text-xs text-gray-400">Instan</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    <Star className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Keamanan</div>
                    <div className="text-xs text-gray-400">Enterprise</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section - Mobile Optimized */}
          <div className="text-center">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                  Siap Bergabung dengan Presale?
                </h2>
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 max-w-xl mx-auto">
                  Jangan lewatkan kesempatan ini untuk mendapatkan token TPC dengan harga terbaik sebelum listing di DEX.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-6 md:px-8 py-3 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBuyClick}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2">
                      {isLoading ? (
                        <div className="w-4 h-4 md:w-5 md:h-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      ) : (
                        <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                      <span>{isLoading ? 'Memuat...' : 'Beli TPC Sekarang'}</span>
                    </div>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 px-6 md:px-8 py-3 rounded-xl transition-all duration-300 text-sm md:text-base"
                    onClick={() => window.location.href = `/${lang}/whitepaper`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Baca Whitepaper</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Disclaimer */}
          <div className="mb-6 md:mb-8">
            <div className="bg-slate-900/30 rounded-lg p-4 md:p-6 border border-slate-700/30">
              <p className="text-xs md:text-sm text-gray-400 text-center leading-relaxed">
                TPC adalah token utilitas untuk ekosistem edukasi dan komunitas. Bukan produk investasi dan tidak menjanjikan imbal hasil. Pembelian token memiliki risiko. Informasi yang disampaikan bukan nasihat keuangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
