import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Shield,
  CheckCircle,
  ArrowRight,
  Layers,
  FileText,
  Users,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Menu,
  Home,
  DollarSign,
  Lock,
  Target,
  Award,
  Brain,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';

export default function AcademyPage() {
  const navigate = useNavigate();

  const handleAccessAcademy = () => {
    navigate('/en/login?returnTo=%2Fen%2Facademy');
  };

  const scrollToCurriculum = () => {
    const element = document.getElementById('curriculum');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const curriculumModules = [
    {
      title: "Market Foundations",
      description: "Understanding market structure, participants, and basic mechanics",
      icon: Layers,
      duration: "4 weeks"
    },
    {
      title: "Risk Management Framework", 
      description: "Position sizing, stop-loss strategies, and portfolio protection",
      icon: Shield,
      duration: "3 weeks"
    },
    {
      title: "Technical Analysis Foundations",
      description: "Chart patterns, indicators, and price action basics",
      icon: BarChart3,
      duration: "5 weeks"
    },
    {
      title: "Psychology & Journaling",
      description: "Trading psychology, emotional control, and performance tracking",
      icon: Brain,
      duration: "3 weeks"
    }
  ];

  const learningFormats = [
    { title: "Video Lessons", icon: FileText, available: true },
    { title: "Worksheets & PDFs", icon: FileText, available: true },
    { title: "Case Studies", icon: Target, available: true },
    { title: "Community Discussion", icon: Users, available: true }
  ];

  const targetAudience = [
    "Beginners seeking structured education",
    "Intermediate traders wanting to fill knowledge gaps", 
    "Anyone interested in systematic trading approaches",
    "Students who prefer education over signals"
  ];

  return (
    <>
      <Helmet>
        <title>TPC Academy - Professional Trading Education</title>
        <meta name="description" content="Professional trading education built for real people — without signals, without promises. Learn market foundations, risk management, and technical analysis." />
      </Helmet>
      
      <div className="min-h-screen bg-[#0B0E11]">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
          
          {/* HERO SECTION */}
          <div className="relative mb-12">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/30 via-[#F0B90B]/5 to-[#161B22]/30 rounded-2xl md:rounded-3xl -z-10 backdrop-blur-xl border border-[#F0B90B]/10"></div>
            
            {/* Enhanced icon container */}
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-8 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm relative shadow-2xl shadow-[#F0B90B]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-2xl blur-xl md:blur-2xl"></div>
                <div className="absolute inset-0 bg-[#F0B90B]/10 rounded-2xl animate-pulse"></div>
                <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-[#F0B90B] relative z-10 drop-shadow-lg" />
              </div>
              
              <div className="mb-4 md:mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F0B90B] to-white mb-2 md:mb-4 tracking-tight leading-tight">
                  TPC Academy
                </h1>
                <div className="h-1 w-20 md:w-32 mx-auto bg-gradient-to-r from-[#F0B90B]/50 to-[#F8D56B]/50 rounded-full mb-4 md:mb-6"></div>
              </div>
              
              <p className="text-lg md:text-xl lg:text-2xl text-[#F0B90B] font-semibold mb-3 md:mb-4 leading-relaxed">
                Professional trading education built for real people
              </p>
              <p className="text-sm md:text-base lg:text-lg text-[#848E9C]/90 max-w-2xl md:max-w-3xl mx-auto leading-relaxed font-light mb-6 md:mb-8">
                — without signals, without promises.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={scrollToCurriculum}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#1C2128]/60 to-[#161B22]/60 hover:from-[#1C2128]/80 hover:to-[#161B22]/80 border border-[#30363D]/50 hover:border-[#F0B90B]/30 text-white rounded-lg md:rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                  Explore Curriculum
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleAccessAcademy}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] hover:from-[#F8D56B] hover:to-[#F0B90B] text-[#0B0E11] rounded-lg md:rounded-xl transition-all duration-300 font-black flex items-center justify-center gap-2 md:gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Lock className="h-4 w-4 md:h-5 md:w-5" />
                  Access Academy
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* WHAT YOU GET */}
          <div className="mb-12">
            <div className="text-center mb-6 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">What You Get</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">What You Get</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {curriculumModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <div key={index} className="relative group">
                    {/* Background hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                    
                    {/* Main card */}
                    <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#F0B90B]/10">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 flex items-center justify-center flex-shrink-0 shadow-lg border border-[#F0B90B]/30">
                            <Icon className="h-6 w-6 md:h-8 md:w-8 text-[#F0B90B]" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg blur-lg"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2">{module.title}</h3>
                          <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed mb-3">{module.description}</p>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-[#F0B90B]/80">
                            <Clock className="h-3 w-3 md:h-4 md:w-4" />
                            {module.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CURRICULUM PREVIEW */}
          <div id="curriculum" className="mb-12">
            <div className="text-center mb-6 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">Curriculum Preview</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Curriculum Preview</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30"></div>
              <div className="relative bg-gradient-to-br from-[#1C2128]/40 to-[#161B22]/40 rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#30363D]/50">
                <div className="space-y-4">
                  {curriculumModules.map((module, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 md:p-4 bg-[#0B0E11]/30 rounded-lg border border-[#30363D]/20">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/15 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#F0B90B] font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{module.title}</h4>
                        <p className="text-[#848E9C]/80 text-sm">{module.description}</p>
                      </div>
                      <div className="text-xs md:text-sm text-[#F0B90B]/80">
                        {module.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LEARNING FORMAT */}
          <div className="mb-12">
            <div className="text-center mb-6 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">Learning Format</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Learning Format</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {learningFormats.map((format, index) => {
                const Icon = format.icon;
                return (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-lg md:rounded-xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 border border-[#F0B90B]/30">
                        <Icon className="h-4 w-4 md:h-5 md:w-5 text-[#F0B90B]" />
                      </div>
                      <p className="text-white text-xs md:text-sm font-medium">{format.title}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                          <CheckCircle className="h-2 w-2" />
                          Member
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WHO THIS IS FOR */}
          <div className="mb-12">
            <div className="text-center mb-6 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">Who This Is For</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Who This Is For</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30"></div>
              <div className="relative bg-gradient-to-br from-[#1C2128]/40 to-[#161B22]/40 rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#30363D]/50">
                <ul className="space-y-3 md:space-y-4">
                  {targetAudience.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/15 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F0B90B]/30">
                        <CheckCircle className="h-3 w-3 text-[#F0B90B]" />
                      </div>
                      <span className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* TOKEN UTILITY */}
          <div className="mb-12">
            <div className="text-center mb-6 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">Token Utility</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Token Utility</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/10 via-[#F8D56B]/5 to-[#F0B90B]/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#F0B90B]/20"></div>
              <div className="relative bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#F0B90B]/30 shadow-2xl shadow-[#F0B90B]/10">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 border border-[#F0B90B]/30">
                      <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-[#F0B90B]" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg blur-lg"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">
                      TPC can be used as an access utility for advanced learning resources and governance participation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRUST BOX / DISCLAIMER */}
          <div className="mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-yellow-500/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-yellow-500/20"></div>
              <div className="relative bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 border border-yellow-500/30">
                      <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
                    </div>
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-lg blur-lg"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-3">Education Only</h3>
                    <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">
                      Not financial advice. No profit guarantees. Trading involves risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="text-center">
            <button
              onClick={handleAccessAcademy}
              className="w-full px-6 md:px-8 py-4 md:py-5 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] hover:from-[#F8D56B] hover:to-[#F0B90B] text-[#0B0E11] rounded-lg md:rounded-xl transition-all duration-300 font-black flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Lock className="h-5 w-5 md:h-6 md:w-6" />
              Login to Access Academy
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <a
                href="/en/anti-scam"
                className="flex items-center gap-2 text-[#848E9C] hover:text-[#F0B90B] transition-colors"
              >
                <Shield className="h-4 w-4" />
                Anti-Scam
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="/en/risk-disclosure"
                className="flex items-center gap-2 text-[#848E9C] hover:text-[#F0B90B] transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Risk Disclosure
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
