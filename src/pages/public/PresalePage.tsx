import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, ArrowRight, Shield, Clock, Users, Zap, CheckCircle, AlertTriangle, User, LogIn, Menu, FileText, BookOpen } from 'lucide-react';
import { presaleCopy } from '@/i18n/public/presale';
import { useState, useEffect } from 'react';

// Presale stage status type
type PresaleStageStatus = 'ACTIVE' | 'COMPLETED' | 'UPCOMING';

// Presale data (reused from existing config)
const presaleData = {
  stage1: {
    price: 0.001,
    supply: 200000000,
    status: 'COMPLETED' as PresaleStageStatus,
    endTime: new Date('2024-12-31T23:59:59Z') // Static config for demo
  },
  stage2: {
    price: 0.002,
    supply: 100000000,
    status: 'UPCOMING' as PresaleStageStatus,
    endTime: new Date('2025-01-31T23:59:59Z') // Static config for demo
  },
  totalSupply: 300000000
};

// Countdown timer hook
const useCountdown = (endTime: Date) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

export default function PresalePage() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  // 🔒 HARD LANGUAGE LOCK
  const safeLang: 'id' | 'en' = lang === 'en' ? 'en' : 'id';
  const c = presaleCopy[safeLang];

  // 🔒 AUTH
  const { user } = useAuth();

  // Get current stage data
  const getCurrentStage = () => {
    if (presaleData.stage2.status === 'ACTIVE') return presaleData.stage2;
    if (presaleData.stage1.status === 'ACTIVE') return presaleData.stage1;
    if (presaleData.stage1.status === 'COMPLETED') return presaleData.stage2;
    return presaleData.stage1;
  };

  const currentStage = getCurrentStage();
  const countdown = useCountdown(currentStage.endTime);

  const getStatusColor = (status: PresaleStageStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'COMPLETED':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'UPCOMING':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusText = (status: PresaleStageStatus) => {
    switch (status) {
      case 'ACTIVE':
        return c.active;
      case 'COMPLETED':
        return c.completed;
      case 'UPCOMING':
        return c.upcoming;
      default:
        return status;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const steps = [
    {
      icon: User,
      title: c.step1,
      description: c.step1Desc
    },
    {
      icon: FileText,
      title: c.step2,
      description: c.step2Desc
    },
    {
      icon: Coins,
      title: c.step3,
      description: c.step3Desc
    },
    {
      icon: Shield,
      title: c.step4,
      description: c.step4Desc
    },
    {
      icon: Zap,
      title: c.step5,
      description: c.step5Desc
    }
  ];

  const features = [
    {
      id: 'education',
      title: c.utilityEducation,
      description: c.utilityEducationDesc,
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'community',
      title: c.utilityCommunity,
      description: c.utilityCommunityDesc,
      icon: Users,
      color: 'purple'
    },
    {
      id: 'governance',
      title: c.utilityGovernance,
      description: c.utilityGovernanceDesc,
      icon: Shield,
      color: 'emerald'
    },
    {
      id: 'ecosystem',
      title: c.utilityEcosystem,
      description: c.utilityEcosystemDesc,
      icon: Zap,
      color: 'orange'
    },
    {
      id: 'contribution',
      title: c.utilityContribution,
      description: c.utilityContributionDesc,
      icon: Coins,
      color: 'yellow'
    }
  ];

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-500',
      purple: 'text-purple-500',
      emerald: 'text-emerald-500',
      orange: 'text-orange-500',
      yellow: 'text-yellow-500'
    };
    return colors[color as keyof typeof colors] || 'text-primary';
  };

  const getBgColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20',
      purple: 'bg-purple-500/20',
      emerald: 'bg-emerald-500/20',
      orange: 'bg-orange-500/20',
      yellow: 'bg-yellow-500/20'
    };
    return colors[color as keyof typeof colors] || 'bg-primary/10';
  };

  return (
    <>
      <Helmet>
        <title>{c.title} - TPC Global</title>
        <meta name="description" content={`TPC Global Presale - ${c.subtitle}`} />
      </Helmet>
      
      <div className="min-h-screen bg-[#0B0E11]">
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          {/* HERO SECTION */}
          <div className="relative mb-16">
            {/* Background gradient container */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128] via-[#0B0E11] to-[#161B22] rounded-3xl -z-10"></div>
            
            {/* Icon glow effect */}
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/20 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm relative">
                <div className="absolute inset-0 bg-[#F0B90B]/10 rounded-2xl blur-xl"></div>
                <Coins className="h-12 w-12 text-[#F0B90B] relative z-10" />
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <h1 className="text-6xl font-black text-white mb-6 tracking-tight">{c.title}</h1>
              <p className="text-3xl text-[#F0B90B] font-semibold mb-4">{c.subtitle}</p>
              <p className="text-lg text-[#848E9C]/80 max-w-2xl mx-auto leading-relaxed">{c.supporting}</p>
            </div>
          </div>

          {/* STAGES */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#F0B90B] uppercase tracking-wider mb-2">{c.stages}</p>
              <h2 className="text-3xl font-bold text-white">{c.stagesTitle}</h2>
            </div>
            
            {/* LISTING DISCLAIMER */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200 leading-relaxed">{c.listingDisclaimer}</p>
              </div>
            </div>

            {/* STAGES NARRATIVE */}
            <div className="bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-xl p-6 mb-8">
              <p className="text-[#C9D1D9] leading-relaxed text-center">{c.stagesNarrative}</p>
            </div>

            {/* COUNTDOWN TIMER */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
                    {c.stageEndsIn}
                  </p>
                  {/* DEV MARKER */}
                  {import.meta.env.DEV && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      COUNTDOWN_RENDERED ✓
                    </span>
                  )}
                </div>

                {currentStage.status === 'ACTIVE' ? (
                  <div className="flex justify-center items-center gap-4 text-2xl font-bold text-white">
                    <div className="text-center">
                      <div className="text-3xl font-black text-blue-500">{formatTime(countdown.days)}</div>
                      <div className="text-sm text-blue-200">{c.days}</div>
                    </div>
                    <span className="text-blue-500">:</span>
                    <div className="text-center">
                      <div className="text-3xl font-black text-blue-500">{formatTime(countdown.hours)}</div>
                      <div className="text-sm text-blue-200">{c.hours}</div>
                    </div>
                    <span className="text-blue-500">:</span>
                    <div className="text-center">
                      <div className="text-3xl font-black text-blue-500">{formatTime(countdown.minutes)}</div>
                      <div className="text-sm text-blue-200">{c.minutes}</div>
                    </div>
                    <span className="text-blue-500">:</span>
                    <div className="text-center">
                      <div className="text-3xl font-black text-blue-500">{formatTime(countdown.seconds)}</div>
                      <div className="text-sm text-blue-200">{c.seconds}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-blue-200">
                    {currentStage.status === 'COMPLETED'
                      ? c.stageCompleted
                      : c.stageUpcoming}
                  </p>
                )}

                <p className="mt-4 text-xs text-blue-200">
                  {c.countdownDisclaimer}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Stage 1 */}
              <div className="bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-2xl p-8 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">{c.stage1}</h3>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(presaleData.stage1.status)}`}>
                    {getStatusText(presaleData.stage1.status)}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">{c.price}:</span>
                    <span className="text-xl font-bold text-white">${presaleData.stage1.price.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">{c.supply}:</span>
                    <span className="text-xl font-bold text-white">{formatNumber(presaleData.stage1.supply)} TPC</span>
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-2xl p-8 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">{c.stage2}</h3>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(presaleData.stage2.status)}`}>
                    {getStatusText(presaleData.stage2.status)}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">{c.price}:</span>
                    <span className="text-xl font-bold text-white">${presaleData.stage2.price.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#848E9C]">{c.supply}:</span>
                    <span className="text-xl font-bold text-white">{formatNumber(presaleData.stage2.supply)} TPC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Supply */}
            <div className="text-center">
              <p className="text-lg text-[#F0B90B] font-medium">{c.totalSupply}</p>
            </div>
          </div>

          {/* UTILITY-FIRST POSITIONING */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#F0B90B] uppercase tracking-wider mb-2">{c.utility}</p>
              <h2 className="text-3xl font-bold text-white">{c.utilityTitle}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Education Access */}
                <div className="bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-xl p-6 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{c.utilityEducation}</h3>
                      <p className="text-[#C9D1D9] leading-relaxed">{c.utilityEducationDesc}</p>
                    </div>
                  </div>
                </div>

                {/* Community Membership */}
                <div className="bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-xl p-6 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{c.utilityCommunity}</h3>
                      <p className="text-[#C9D1D9] leading-relaxed">{c.utilityCommunityDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* DAO Lite Participation */}
                <div className="bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-xl p-6 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{c.utilityGovernance}</h3>
                      <p className="text-[#C9D1D9] leading-relaxed">{c.utilityGovernanceDesc}</p>
                    </div>
                  </div>
                </div>

                {/* Internal Ecosystem Usage */}
                <div className="bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-xl p-6 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{c.utilityEcosystem}</h3>
                      <p className="text-[#C9D1D9] leading-relaxed">{c.utilityEcosystemDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution & Reward Mechanics */}
            <div className="mt-8 bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-xl p-6 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#F0B90B]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Coins className="h-6 w-6 text-[#F0B90B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{c.utilityContribution}</h3>
                  <p className="text-[#C9D1D9] leading-relaxed">{c.utilityContributionDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#F0B90B] uppercase tracking-wider mb-2">{c.howItWorks}</p>
              <h2 className="text-3xl font-bold text-white">{c.howItWorksTitle}</h2>
            </div>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="bg-gradient-to-r from-[#1C2128] to-[#161B22] border border-[#30363D]/50 rounded-xl p-8 flex items-center gap-8 hover:border-[#F0B90B]/30 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-[#F0B90B]/30">
                      <Icon className="h-8 w-8 text-[#F0B90B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-[#C9D1D9] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RISK & ANTI-SCAM SECTION */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#F0B90B] uppercase tracking-wider mb-2">{c.riskAntiScam}</p>
              <h2 className="text-3xl font-bold text-white">{c.riskTitle}</h2>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-10 shadow-xl">
              <div className="space-y-6">
                {/* Financial Disclaimer */}
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{c.financialDisclaimer}</h3>
                    <p className="text-red-200 leading-relaxed">{c.riskDisclaimer}</p>
                  </div>
                </div>

                {/* Cryptocurrency Risk */}
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{c.cryptoRiskTitle}</h3>
                    <p className="text-red-200 leading-relaxed">{c.cryptoRisk}</p>
                  </div>
                </div>

                {/* Anti-Scam Warning */}
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{c.antiScamTitle}</h3>
                    <p className="text-red-200 leading-relaxed">{c.antiScamWarning}</p>
                  </div>
                </div>

                {/* Official Channels */}
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{c.officialChannelsTitle}</h3>
                    <p className="text-emerald-200 leading-relaxed">{c.officialChannels}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACCESS CTA */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#F0B90B] uppercase tracking-wider mb-2">{c.accessParticipation}</p>
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate(user ? '/member/dashboard' : `/${safeLang}/login`)}
                className="px-12 py-4 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] hover:from-[#F8D56B] hover:to-[#F0B90B] text-[#0B0E11] rounded-xl transition-all duration-300 font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl mx-auto"
              >
                {user ? <Users className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
                {user ? c.goToMemberArea : c.loginToParticipate}
              </button>
            </div>
          </div>

          
          {/* DISCLAIMER */}
          <div className="bg-[#1C2128] border border-[#30363D]/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#848E9C] leading-relaxed">{c.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
