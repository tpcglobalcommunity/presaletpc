import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, ArrowRight, Shield, Clock, Users, Zap, CheckCircle, AlertTriangle, User, LogIn, Menu, FileText, BookOpen } from 'lucide-react';
import { presaleCopy } from '@/i18n/public/presale';
import { useState, useEffect } from 'react';
import { 
  PRESALE_STAGE_STARTED_AT_SG, 
  parseStartSG, 
  getPresaleEndTimeSG, 
  isPresaleActive,
  nowSG 
} from '@/lib/presaleTime';

// Presale stage status type
type PresaleStageStatus = 'ACTIVE' | 'COMPLETED' | 'UPCOMING';

// Presale data configuration using Singapore timezone
const startAt = parseStartSG(PRESALE_STAGE_STARTED_AT_SG);
const endAt = getPresaleEndTimeSG(startAt);

const presaleData = {
  stage1: {
    price: 0.001,
    supply: 200000000,
    status: 'COMPLETED' as PresaleStageStatus,
    endTime: startAt || new Date()
  },
  stage2: {
    price: 0.002,
    supply: 100000000,
    status: (endAt && isPresaleActive(endAt)) ? 'ACTIVE' as PresaleStageStatus : 'UPCOMING' as PresaleStageStatus,
    endTime: endAt || new Date()
  },
  totalSupply: 300000000
};

// Countdown timer hook with Singapore timezone
const useCountdown = (endTime: Date | null) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!endTime) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = nowSG();
      const difference = endTime.getTime() - now.getTime();
      
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
  const countdown = useCountdown(endAt);

  // Check if countdown should be displayed
  const shouldShowCountdown = endAt && isPresaleActive(endAt);

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
      
      <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0A0D0F] to-[#0C0F12]">
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          {/* HERO SECTION */}
          <div className="relative mb-20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/30 via-[#F0B90B]/5 to-[#161B22]/30 rounded-3xl -z-10 backdrop-blur-xl border border-[#F0B90B]/10"></div>
            
            {/* Enhanced icon container */}
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm relative shadow-2xl shadow-[#F0B90B]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-[#F0B90B]/10 rounded-3xl animate-pulse"></div>
                <Coins className="h-16 w-16 text-[#F0B90B] relative z-10 drop-shadow-lg" />
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F0B90B] to-white mb-4 tracking-tight leading-tight">
                  {c.title}
                </h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#F0B90B]/50 to-[#F8D56B]/50 rounded-full mb-6"></div>
              </div>
              <p className="text-2xl md:text-3xl text-[#F0B90B] font-semibold mb-6 leading-relaxed">{c.subtitle}</p>
              <p className="text-lg md:text-xl text-[#848E9C]/90 max-w-3xl mx-auto leading-relaxed font-light">{c.supporting}</p>
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
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/10 via-[#F8D56B]/5 to-[#F0B90B]/10 rounded-2xl -z-10 backdrop-blur-xl border border-[#F0B90B]/20"></div>
              <div className="bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-2xl p-8 backdrop-blur-sm border border-[#F0B90B]/30 shadow-2xl shadow-[#F0B90B]/10">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="relative">
                      <Clock className="h-6 w-6 text-[#F0B90B] drop-shadow-lg" />
                      <div className="absolute inset-0 bg-[#F0B90B]/20 rounded-full blur-md"></div>
                    </div>
                    <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider">
                      {c.stageEndsIn}
                    </p>
                  </div>

                  {shouldShowCountdown ? (
                    <div className="flex justify-center items-center gap-3 md:gap-6 text-2xl md:text-3xl font-bold text-white">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl p-4 md:p-6 border border-[#F0B90B]/30 shadow-lg">
                          <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] drop-shadow-lg">
                            {formatTime(countdown.days)}
                          </div>
                          <div className="text-sm md:text-base text-[#F0B90B]/80 font-medium mt-1">{c.days}</div>
                        </div>
                      </div>
                      <span className="text-[#F0B90B]/60 text-2xl md:text-3xl font-light animate-pulse">:</span>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl p-4 md:p-6 border border-[#F0B90B]/30 shadow-lg">
                          <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] drop-shadow-lg">
                            {formatTime(countdown.hours)}
                          </div>
                          <div className="text-sm md:text-base text-[#F0B90B]/80 font-medium mt-1">{c.hours}</div>
                        </div>
                      </div>
                      <span className="text-[#F0B90B]/60 text-2xl md:text-3xl font-light animate-pulse">:</span>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl p-4 md:p-6 border border-[#F0B90B]/30 shadow-lg">
                          <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] drop-shadow-lg">
                            {formatTime(countdown.minutes)}
                          </div>
                          <div className="text-sm md:text-base text-[#F0B90B]/80 font-medium mt-1">{c.minutes}</div>
                        </div>
                      </div>
                      <span className="text-[#F0B90B]/60 text-2xl md:text-3xl font-light animate-pulse">:</span>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl p-4 md:p-6 border border-[#F0B90B]/30 shadow-lg">
                          <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] drop-shadow-lg">
                            {formatTime(countdown.seconds)}
                          </div>
                          <div className="text-sm md:text-base text-[#F0B90B]/80 font-medium mt-1">{c.seconds}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <p className="text-lg text-[#848E9C]/80 font-medium">
                        {endAt ? c.stageCompleted : c.stageUpcoming}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-[#F0B90B]/20">
                    <p className="text-xs text-[#848E9C]/70 leading-relaxed">
                      {c.countdownDisclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {/* Stage 1 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#F0B90B]/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{c.stage1}</h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-[#F0B90B]/50 to-transparent rounded-full"></div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusColor(presaleData.stage1.status)}`}>
                      {getStatusText(presaleData.stage1.status)}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-[#0B0E11]/30 rounded-xl border border-[#30363D]/20">
                      <span className="text-[#848E9C] font-medium">{c.price}</span>
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F0B90B]/80">
                        ${presaleData.stage1.price.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#0B0E11]/30 rounded-xl border border-[#30363D]/20">
                      <span className="text-[#848E9C] font-medium">{c.supply}</span>
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F0B90B]/80">
                        {formatNumber(presaleData.stage1.supply)} TPC
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#F0B90B]/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{c.stage2}</h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-[#F0B90B]/50 to-transparent rounded-full"></div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusColor(presaleData.stage2.status)}`}>
                      {getStatusText(presaleData.stage2.status)}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-[#0B0E11]/30 rounded-xl border border-[#30363D]/20">
                      <span className="text-[#848E9C] font-medium">{c.price}</span>
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F0B90B]/80">
                        ${presaleData.stage2.price.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#0B0E11]/30 rounded-xl border border-[#30363D]/20">
                      <span className="text-[#848E9C] font-medium">{c.supply}</span>
                      <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F0B90B]/80">
                        {formatNumber(presaleData.stage2.supply)} TPC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Supply */}
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F0B90B]/10 via-[#F8D56B]/5 to-[#F0B90B]/10 rounded-2xl -z-10 backdrop-blur-xl border border-[#F0B90B]/20"></div>
              <div className="bg-gradient-to-r from-[#1C2128]/60 to-[#161B22]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#F0B90B]/30 text-center">
                <p className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] font-bold">
                  {c.totalSupply}
                </p>
              </div>
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
