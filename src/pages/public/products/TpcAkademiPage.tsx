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
      
      <div className="min-h-screen bg-[#0B0E11]">
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(`/${safeLang}/market`)}
            className="flex items-center gap-2 text-[#848E9C] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{c.backToMarket}</span>
          </button>

          {/* HERO SECTION */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/20 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm">
              <BookOpen className="h-12 w-12 text-[#F0B90B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">{c.title}</h1>
            <p className="text-2xl text-[#F0B90B] font-medium mb-3">{c.subtitle}</p>
            <p className="text-[#848E9C] text-lg max-w-2xl mx-auto">{c.supporting}</p>
          </div>

          {/* WHAT YOU GET */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">{c.whatYouGet}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${getBgColor(feature.color)} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-7 w-7 ${getIconColor(feature.color)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-[#848E9C] text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LEARNING PATH */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">{c.learningPath}</h2>
            <div className="space-y-4">
              {learningSteps.map((step, index) => (
                <div key={index} className="bg-[#1C2128] border border-[#30363D] rounded-xl p-6 flex items-center gap-6">
                  <div className="w-12 h-12 bg-[#F0B90B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[#F0B90B] font-bold text-lg">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-[#848E9C] text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAFETY NOTICE */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-yellow-500 mb-3">{c.safetyNotice}</h2>
                <p className="text-yellow-200 leading-relaxed">{c.safetyDesc}</p>
              </div>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => navigate(`/${safeLang}/market`)}
              className="px-6 py-3 bg-[#1C2128] border border-[#30363D] hover:border-[#F0B90B]/30 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {c.backToMarket}
            </button>
            <button
              onClick={() => navigate(`/${safeLang}/anti-scam`)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" />
              {c.antiScam}
            </button>
            <button
              onClick={() => navigate(`/${safeLang}/presale`)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {c.presale}
            </button>
          </div>

          {/* DISCLAIMER */}
          <div className="bg-[#1C2128] border border-[#30363D]/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#848E9C] leading-relaxed">{c.safetyDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
