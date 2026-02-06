import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, ArrowRight, Shield, Users, Wrench, TrendingUp, Target, Award, AlertTriangle, Info, ArrowLeft } from 'lucide-react';

// TPC Akademi page copy
const tpcAkademiCopy = {
  id: {
    title: 'TPC Akademi',
    subtitle: 'Platform edukasi trading & literasi market',
    supporting: 'Belajar bertahap, fokus pada skill, disiplin, dan manajemen risiko.',
    whatYouGet: 'Apa yang akan Anda dapatkan',
    structuredCurriculum: 'Kurikulum terstruktur',
    structuredCurriculumDesc: 'Dasar → Menengah → Lanjutan dengan pembelajaran sistematis.',
    learningMaterials: 'Materi pembelajaran',
    learningMaterialsDesc: 'Modul, rekaman video, dan referensi lengkap.',
    communityLearning: 'Pembelajaran komunitas',
    communityLearningDesc: 'Diskusi, review, dan sharing pengalaman.',
    toolsTemplates: 'Alat & template',
    toolsTemplatesDesc: 'Jurnal trading, checklist, dan alat bantu belajar.',
    learningPath: 'Jalur pembelajaran',
    step1: 'Fundamental',
    step1Desc: 'Pengenalan dasar trading dan konsep market.',
    step2: 'Struktur market',
    step2Desc: 'Memahami cara kerja pasar dan instrumen.',
    step3: 'Manajemen risiko',
    step3Desc: 'Teknik pengelolaan risiko yang efektif.',
    step4: 'Praktik & jurnal',
    step4Desc: 'Latihan praktik dan pencatatan jurnal.',
    step5: 'Review & perbaikan',
    step5Desc: 'Evaluasi progress dan perbaikan strategi.',
    safetyNotice: 'Perhatian keamanan',
    safetyDesc: 'Edukasi saja. Tidak ada jaminan hasil finansial. Keputusan & risiko ada pada masing-masing individu.',
    backToMarket: 'Kembali ke Market',
    antiScam: 'Anti-Scam',
    presale: 'Presale'
  },
  en: {
    title: 'TPC Akademi',
    subtitle: 'Trading education & market literacy platform',
    supporting: 'Structured learning focused on skills, discipline, and risk management.',
    whatYouGet: 'What you will get',
    structuredCurriculum: 'Structured curriculum',
    structuredCurriculumDesc: 'Basic → Intermediate → Advanced with systematic learning.',
    learningMaterials: 'Learning materials',
    learningMaterialsDesc: 'Modules, video recordings, and comprehensive references.',
    communityLearning: 'Community learning',
    communityLearningDesc: 'Discussions, reviews, and experience sharing.',
    toolsTemplates: 'Tools & templates',
    toolsTemplatesDesc: 'Trading journals, checklists, and learning aids.',
    learningPath: 'Learning path',
    step1: 'Fundamentals',
    step1Desc: 'Introduction to trading basics and market concepts.',
    step2: 'Market structure',
    step2Desc: 'Understanding market mechanics and instruments.',
    step3: 'Risk management',
    step3Desc: 'Effective risk management techniques.',
    step4: 'Practice & journaling',
    step4Desc: 'Practical exercises and journaling.',
    step5: 'Review & improvement',
    step5Desc: 'Progress evaluation and strategy refinement.',
    safetyNotice: 'Safety notice',
    safetyDesc: 'Educational only. No financial guarantees. Decisions and risks remain with each individual.',
    backToMarket: 'Back to Market',
    antiScam: 'Anti-Scam',
    presale: 'Presale'
  }
};

export default function TpcAkademiPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict lang validation: only "en" or "id" allowed
  const safeLang = lang === 'en' ? 'en' : 'id';
  const c = tpcAkademiCopy[safeLang];

  const features = [
    {
      icon: BookOpen,
      title: c.structuredCurriculum,
      description: c.structuredCurriculumDesc,
      color: 'emerald'
    },
    {
      icon: Wrench,
      title: c.learningMaterials,
      description: c.learningMaterialsDesc,
      color: 'blue'
    },
    {
      icon: Users,
      title: c.communityLearning,
      description: c.communityLearningDesc,
      color: 'purple'
    },
    {
      icon: Target,
      title: c.toolsTemplates,
      description: c.toolsTemplatesDesc,
      color: 'orange'
    }
  ];

  const learningSteps = [
    { step: 1, title: c.step1, description: c.step1Desc },
    { step: 2, title: c.step2, description: c.step2Desc },
    { step: 3, title: c.step3, description: c.step3Desc },
    { step: 4, title: c.step4, description: c.step4Desc },
    { step: 5, title: c.step5, description: c.step5Desc }
  ];

  const getIconColor = (color: string) => {
    const colors = {
      emerald: 'text-emerald-500',
      blue: 'text-blue-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };
    return colors[color as keyof typeof colors] || 'text-primary';
  };

  const getBgColor = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/10',
      blue: 'bg-blue-500/10',
      purple: 'bg-purple-500/10',
      orange: 'bg-orange-500/10'
    };
    return colors[color as keyof typeof colors] || 'bg-primary/10';
  };

  return (
    <>
      <Helmet>
        <title>{c.title} - TPC Global</title>
        <meta name="description" content={`TPC Global ${c.title} - ${c.subtitle}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0A0D0F] to-[#0C0F12]">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(`/${safeLang}/market`)}
            className="flex items-center gap-2 text-[#848E9C] hover:text-white transition-colors mb-6 md:mb-8 group"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm md:text-base">{c.backToMarket}</span>
          </button>

          {/* HERO SECTION */}
          <div className="relative mb-12 md:mb-16">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/30 via-[#F0B90B]/5 to-[#161B22]/30 rounded-2xl md:rounded-3xl -z-10 backdrop-blur-xl border border-[#F0B90B]/10"></div>
            
            {/* Enhanced icon container */}
            <div className="relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-8 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm relative shadow-2xl shadow-[#F0B90B]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-2xl blur-xl md:blur-2xl"></div>
                <div className="absolute inset-0 bg-[#F0B90B]/10 rounded-2xl animate-pulse"></div>
                <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-[#F0B90B] relative z-10 drop-shadow-lg" />
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-4 md:mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F0B90B] to-white mb-2 md:mb-6 tracking-tight leading-tight">
                  {c.title}
                </h1>
                <div className="h-1 w-20 md:w-32 mx-auto bg-gradient-to-r from-[#F0B90B]/50 to-[#F8D56B]/50 rounded-full mb-4 md:mb-6"></div>
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#F0B90B] font-semibold mb-3 md:mb-4 leading-relaxed">{c.subtitle}</p>
              <p className="text-sm md:text-base lg:text-lg text-[#848E9C]/90 max-w-2xl md:max-w-3xl mx-auto leading-relaxed font-light">{c.supporting}</p>
            </div>
          </div>

          {/* WHAT YOU GET */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-4 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">{c.whatYouGet}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 md:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="relative group">
                    {/* Background hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                    
                    {/* Main card */}
                    <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#F0B90B]/10">
                      <div className="flex items-start gap-4 md:gap-6">
                        <div className="relative">
                          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl ${getBgColor(feature.color)} flex items-center justify-center flex-shrink-0 shadow-lg border border-[#30363D]/30`}>
                            <Icon className={`h-6 w-6 md:h-8 md:w-8 ${getIconColor(feature.color)}`} />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg blur-lg"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LEARNING PATH */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-4 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">{c.learningPath}</p>
            </div>
            <div className="space-y-4 md:space-y-6">
              {learningSteps.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Background hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#F0B90B]/10 flex items-center gap-4 md:gap-6 md:gap-8">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-[#F0B90B]/30">
                        <span className="text-[#F0B90B] font-black text-lg md:text-xl font-bold">{step.step}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-lg blur-lg"></div>
                      <div className="absolute inset-0 bg-[#F0B90B]/10 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAFETY NOTICE */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-4 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600 uppercase tracking-wider mb-2">{c.safetyNotice}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-emerald-500/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-emerald-500/20"></div>
              <div className="relative bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 backdrop-blur-sm border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/20 rounded-lg md:rounded-xl flex items-center justify-center border border-emerald-500/30">
                      <Shield className="h-6 w-6 md:h-8 md:w-8 text-emerald-400" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-lg"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">Keamanan & Transparansi</h3>
                    <p className="text-[#C9D1D9]/90 text-sm md:text-base md:text-lg leading-relaxed">{c.safetyDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-4 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">Navigasi</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
              <button
                onClick={() => navigate(`/${safeLang}/market`)}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#1C2128]/60 to-[#161B22]/60 hover:from-[#1C2128]/80 hover:to-[#161B22]/80 border border-[#30363D]/50 hover:border-[#F0B90B]/30 text-white rounded-lg md:rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                {c.backToMarket}
              </button>
              <button
                onClick={() => navigate(`/${safeLang}/anti-scam`)}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg md:rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Shield className="h-4 w-4 md:h-5 md:w-5" />
                {c.antiScam}
              </button>
              <button
                onClick={() => navigate(`/${safeLang}/presale`)}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg md:rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                {c.presale}
              </button>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-xl -z-10 backdrop-blur-xl border border-[#30363D]/30"></div>
            <div className="relative bg-gradient-to-br from-[#1C2128]/40 to-[#161B22]/40 rounded-xl md:rounded-xl p-4 md:p-6 backdrop-blur-sm border border-[#30363D]/50">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/20 rounded-lg md:rounded-xl flex items-center justify-center border border-[#F0B90B]/30">
                    <Info className="h-5 w-5 md:h-6 md:w-6 text-[#F0B90B]" />
                  </div>
                  <div className="absolute inset-0 bg-[#F0B90B]/20 rounded-lg blur-lg"></div>
                </div>
                <p className="text-xs md:text-sm text-[#848E9C]/90 leading-relaxed flex-1">{c.safetyDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
