import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from '@/components/ui/separator';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Clock, 
  TrendingUp, 
  Target, 
  Zap, 
  Rocket, 
  DollarSign,
  BarChart3,
  Calendar,
  Globe,
  Shield,
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
  const [presaleConfig, setPresaleConfig] = useState<PresaleConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback configuration
  const fallbackConfig: PresaleConfig = {
    stage1_started_at: new Date('2026-02-01T00:00:00+07:00').getTime(),
    stage1_duration_days: 180, // 6 months
    stage1_supply: 200000000, // 200 million
    stage1_price_usd: 0.001,
    stage2_supply: 100000000, // 100 million
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

  // Calculate ROI
  const stage1ROI = ((config.listing_price_usd - config.stage1_price_usd) / config.stage1_price_usd) * 100;
  const stage2ROI = ((config.listing_price_usd - config.stage2_price_usd) / config.stage2_price_usd) * 100;

  // Helper functions
  const formatMillions = (n: number) => `${(n / 1_000_000).toFixed(0)}M`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated Background - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-96 md:h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.03)%22%20stroke-width%3D%221%22%3E%3Cpath%20d%3D%22M0%2030h60M30%200v60%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section - Mobile Optimized */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center mb-4 md:mb-6">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 p-3 md:p-4 shadow-2xl backdrop-blur-sm ring-2 ring-amber-500/20">
                  <img
                    src={tpcLogo}
                    alt="TPC Logo"
                    className="h-10 w-10 md:h-12 md:w-12 object-contain"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-4 h-4 md:w-6 md:h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent mb-3 md:mb-4 px-2">
              {t('TPC Presale Information', 'Informasi Presale TPC')}
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              {t('Join the future of decentralized finance with TPC token presale', 'Bergabung dengan masa depan keuangan terdesentralisasi dengan presale token TPC')}
            </p>
          </div>

          {/* Key Highlights - Mobile Optimized Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl border border-green-500/30 text-white overflow-hidden">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-green-400 mb-1 md:mb-2">{t('Verified On-Chain', 'Terverifikasi On-Chain')}</h3>
                <p className="text-sm text-gray-400">{t('Audit Smart Contract (Q2 2026)', 'Audit Smart Contract (Q2 2026)')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 text-white overflow-hidden">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-blue-400 mb-1 md:mb-2">{t('Transparent Wallets', 'Wallet Transparan')}</h3>
                <p className="text-xs md:text-sm text-gray-400">{t('All transactions are publicly visible', 'Semua transaksi terlihat publik')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 text-white overflow-hidden">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-purple-400 mb-1 md:mb-2">{t('Anti-Scam Policy', 'Kebijakan Anti-Scam')}</h3>
                <p className="text-xs md:text-sm text-gray-400">{t('Zero tolerance for fraudulent activities', 'Toleransi nol untuk aktivitas penipuan')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-xl border border-amber-500/30 text-white overflow-hidden">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Rocket className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-amber-400 mb-1 md:mb-2">{t('Community First', 'Komunitas Utama')}</h3>
                <p className="text-xs md:text-sm text-gray-400">{t('Built for and by the community', 'Dibangun untuk dan oleh komunitas')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Countdown Timer - Mobile Optimized */}
          <div className="mb-8 md:mb-12">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-2xl">
              <CardContent className="p-4 md:p-8">
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 md:mb-6">
                    <Clock className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
                    <h2 className="text-lg md:text-2xl font-bold">
                      {t('Presale Ends In', 'Presale Berakhir Dalam')}
                    </h2>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs md:text-sm">
                      {t('Jakarta Timezone', 'Waktu Jakarta')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl md:rounded-2xl p-3 md:p-6 border border-slate-700/50 shadow-lg">
                      <div className="text-2xl md:text-4xl font-bold text-amber-400 mb-1 md:mb-2">{countdown.days}</div>
                      <div className="text-xs md:text-sm text-gray-400">{t('Days', 'Hari')}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl md:rounded-2xl p-3 md:p-6 border border-slate-700/50 shadow-lg">
                      <div className="text-2xl md:text-4xl font-bold text-amber-400 mb-1 md:mb-2">{countdown.hours}</div>
                      <div className="text-xs md:text-sm text-gray-400">{t('Hours', 'Jam')}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl md:rounded-2xl p-3 md:p-6 border border-slate-700/50 shadow-lg">
                      <div className="text-2xl md:text-4xl font-bold text-amber-400 mb-1 md:mb-2">{countdown.minutes}</div>
                      <div className="text-xs md:text-sm text-gray-400">{t('Minutes', 'Menit')}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl md:rounded-2xl p-3 md:p-6 border border-slate-700/50 shadow-lg">
                      <div className="text-2xl md:text-4xl font-bold text-amber-400 mb-1 md:mb-2">{countdown.seconds}</div>
                      <div className="text-xs md:text-sm text-gray-400">{t('Seconds', 'Detik')}</div>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-gray-400">
                    {t('Total Duration: 6 Months', 'Total Durasi: 6 Bulan')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Presale Stages - Mobile Optimized */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Stage 1 */}
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl border border-green-500/30 text-white overflow-hidden shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
                    <Rocket className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                    {t('Stage 1 - Active', 'Tahap 1 - Aktif')}
                  </CardTitle>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs md:text-sm w-fit">
                    {t('LIVE', 'BERLANGSUNG')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <div className="text-xs md:text-sm text-gray-400 mb-1">{t('Supply', 'Suplai')}</div>
                    <div className="text-lg md:text-2xl font-bold text-green-400">
                      {formatMillions(config.stage1_supply)} TPC
                    </div>
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400 mb-1">{t('Price', 'Harga')}</div>
                    <div className="text-lg md:text-2xl font-bold text-green-400">
                      ${config.stage1_price_usd.toFixed(3)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-2">
                    <span>{t('Progress', 'Progres')}</span>
                    <span>{stage1Progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={stage1Progress} className="h-2 md:h-3 bg-slate-700" />
                  <div className="text-xs text-gray-400 mt-1">
                    {t(`${formatMillions(stage1Raised)} / ${formatMillions(config.stage1_supply)} TPC raised`, `${formatMillions(stage1Raised)} / ${formatMillions(config.stage1_supply)} TPC terkumpul`)}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    <span className="text-sm md:text-base font-semibold">{t('Expected ROI', 'ROI yang Diharapkan')}</span>
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-green-400">
                    +{stage1ROI.toFixed(0)}%
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">
                    {t(`At listing price $${config.listing_price_usd.toFixed(3)}`, `Pada harga listing $${config.listing_price_usd.toFixed(3)}`)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 2 */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 text-white overflow-hidden shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                    {t('Stage 2 - Upcoming', 'Tahap 2 - Akan Datang')}
                  </CardTitle>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs md:text-sm w-fit">
                    {t('UPCOMING', 'AKAN DATANG')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <div className="text-xs md:text-sm text-gray-400 mb-1">{t('Supply', 'Suplai')}</div>
                    <div className="text-lg md:text-2xl font-bold text-blue-400">
                      {formatMillions(config.stage2_supply)} TPC
                    </div>
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400 mb-1">{t('Price', 'Harga')}</div>
                    <div className="text-lg md:text-2xl font-bold text-blue-400">
                      ${config.stage2_price_usd.toFixed(3)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    <span className="text-sm md:text-base font-semibold">{t('Starts After Stage 1', 'Dimulai Setelah Tahap 1')}</span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">
                    {t('Duration: 3 months', 'Durasi: 3 bulan')}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    <span className="text-sm md:text-base font-semibold">{t('Expected ROI', 'ROI yang Diharapkan')}</span>
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-blue-400">
                    +{stage2ROI.toFixed(0)}%
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">
                    {t(`At listing price $${config.listing_price_usd.toFixed(3)}`, `Pada harga listing $${config.listing_price_usd.toFixed(3)}`)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Listing Target */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-xl border border-amber-500/30 text-white overflow-hidden mb-12 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Target className="w-8 h-8 text-amber-400" />
                {t('Listing Target', 'Target Listing')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">{t('Target Price', 'Harga Target')}</div>
                  <div className="text-3xl font-bold text-amber-400">
                    ${config.listing_price_usd.toFixed(3)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">{t('Platform', 'Platform')}</div>
                  <div className="text-2xl font-bold text-amber-400">
                    DEX
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">{t('Total Supply', 'Total Suplai')}</div>
                  <div className="text-2xl font-bold text-amber-400">
                    {formatMillions(config.stage1_supply + config.stage2_supply)} TPC
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="font-semibold">{t('Stage 1 Investors', 'Investor Tahap 1')}</span>
                  </div>
                  <div className="text-xl font-bold text-green-400 mb-1">+{stage1ROI.toFixed(0)}%</div>
                  <div className="text-sm text-gray-400">
                    {t(`$${config.stage1_price_usd.toFixed(3)} → $${config.listing_price_usd.toFixed(3)}`, `$${config.stage1_price_usd.toFixed(3)} → $${config.listing_price_usd.toFixed(3)}`)}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">{t('Stage 2 Investors', 'Investor Tahap 2')}</span>
                  </div>
                  <div className="text-xl font-bold text-blue-400 mb-1">+{stage2ROI.toFixed(0)}%</div>
                  <div className="text-sm text-gray-400">
                    {t(`$${config.stage2_price_usd.toFixed(3)} → $${config.listing_price_usd.toFixed(3)}`, `$${config.stage2_price_usd.toFixed(3)} → $${config.listing_price_usd.toFixed(3)}`)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tokenomics */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 text-white overflow-hidden mb-12 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                {t('Tokenomics', 'Tokenomika')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-400">66.7%</span>
                  </div>
                  <div className="font-semibold">{t('Stage 1', 'Tahap 1')}</div>
                  <div className="text-sm text-gray-400">{formatMillions(config.stage1_supply)} TPC</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-400">33.3%</span>
                  </div>
                  <div className="font-semibold">{t('Stage 2', 'Tahap 2')}</div>
                  <div className="text-sm text-gray-400">{formatMillions(config.stage2_supply)} TPC</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-amber-400">100%</span>
                  </div>
                  <div className="font-semibold">{t('Total Presale', 'Total Presale')}</div>
                  <div className="text-sm text-gray-400">{formatMillions(config.stage1_supply + config.stage2_supply)} TPC</div>
                </div>
              </div>

              <Separator className="bg-purple-700/50" />

              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold">{t('In Progress', 'Dalam Proses')}</div>
                  <div className="text-xs text-gray-400">{t('Smart Contract', 'Kontrak Pintar')}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold">{t('Global', 'Global')}</div>
                  <div className="text-xs text-gray-400">{t('Worldwide Access', 'Akses Global')}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold">{t('Fast', 'Cepat')}</div>
                  <div className="text-xs text-gray-400">{t('Instant Transactions', 'Transaksi Instan')}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                  <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold">{t('Secure', 'Aman')}</div>
                  <div className="text-xs text-gray-400">{t('Enterprise Grade', 'Kelas Enterprise')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section - Mobile Optimized */}
          <div className="text-center">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                  {t('Ready to Join the Presale?', 'Siap Bergabung dengan Presale?')}
                </h2>
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto px-2">
                  {t('Don\'t miss this opportunity to get TPC tokens at the best price before listing on DEX.', 
                     'Jangan lewatkan kesempatan ini untuk mendapatkan token TPC dengan harga terbaik sebelum listing di DEX.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-6 md:px-8 py-3 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] text-sm md:text-base"
                    onClick={() => window.location.href = `/${lang}/buytpc`}
                  >
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{t('Buy TPC Now', 'Beli TPC Sekarang')}</span>
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
                      <span>{t('Read Whitepaper', 'Baca Whitepaper')}</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
