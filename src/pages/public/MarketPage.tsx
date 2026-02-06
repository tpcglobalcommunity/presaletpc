import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { TrendingUp, Shield, ArrowRight, BookOpen, Users, Wrench, Calendar, CheckCircle, AlertTriangle, Info } from 'lucide-react';

// Market page copy
const marketCopy = {
  id: {
    title: 'Market',
    subtitle: 'Produk & layanan TPC',
    supporting: 'Jelajahi produk edukasi dan akses resmi TPC.',
    products: 'Produk',
    tpcAkademi: 'TPC Akademi',
    tpcAkademiDesc: 'Kelas dan materi edukasi trading & literasi market.',
    membershipAccess: 'Membership Access',
    membershipDesc: 'Akses komunitas belajar dan konten premium.',
    learningTools: 'Learning Tools',
    learningToolsDesc: 'Alat bantu belajar seperti jurnal dan template.',
    eventsPrograms: 'Events & Programs',
    eventsProgramsDesc: 'Workshop, bootcamp, dan kelas live (edukasi).',
    available: 'Tersedia',
    comingSoon: 'Segera hadir',
    viewDetails: 'Lihat detail',
    learnMore: 'Pelajari lebih lanjut',
    explore: 'Jelajahi',
    seePrograms: 'Lihat program',
    safetyTransparency: 'Keamanan & Transparansi',
    safetyDesc: 'Produk TPC bersifat edukasi. Selalu verifikasi informasi melalui sumber resmi.',
    antiScam: 'Anti-Scam',
    disclaimer: 'Semua informasi di halaman ini bersifat edukasi dan tidak menjanjikan hasil finansial.'
  },
  en: {
    title: 'Market',
    subtitle: 'TPC products & services',
    supporting: 'Explore TPC educational products and official access.',
    products: 'Products',
    tpcAkademi: 'TPC Akademi',
    tpcAkademiDesc: 'Courses and learning materials for trading & market literacy.',
    membershipAccess: 'Membership Access',
    membershipDesc: 'Access to learning community and premium content.',
    learningTools: 'Learning Tools',
    learningToolsDesc: 'Learning tools such as journals and templates.',
    eventsPrograms: 'Events & Programs',
    eventsProgramsDesc: 'Workshops, bootcamps, and live classes (educational).',
    available: 'Available',
    comingSoon: 'Coming soon',
    viewDetails: 'View details',
    learnMore: 'Learn more',
    explore: 'Explore',
    seePrograms: 'See programs',
    safetyTransparency: 'Safety & Transparency',
    safetyDesc: 'TPC products are educational. Always verify information through official sources.',
    antiScam: 'Anti-Scam',
    disclaimer: 'All information on this page is educational and does not promise financial outcomes.'
  }
};

export default function MarketPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict lang validation: only "en" or "id" allowed
  const safeLang = lang === 'en' ? 'en' : 'id';
  const c = marketCopy[safeLang];

  const products = [
    {
      id: 'akademi',
      title: c.tpcAkademi,
      description: c.tpcAkademiDesc,
      icon: BookOpen,
      status: c.available,
      cta: c.viewDetails,
      color: 'emerald'
    },
    {
      id: 'membership',
      title: c.membershipAccess,
      description: c.membershipDesc,
      icon: Users,
      status: c.comingSoon,
      cta: c.learnMore,
      color: 'purple'
    },
    {
      id: 'tools',
      title: c.learningTools,
      description: c.learningToolsDesc,
      icon: Wrench,
      status: c.comingSoon,
      cta: c.explore,
      color: 'blue'
    },
    {
      id: 'events',
      title: c.eventsPrograms,
      description: c.eventsProgramsDesc,
      icon: Calendar,
      status: c.comingSoon,
      cta: c.seePrograms,
      color: 'orange'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === c.available ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
  };

  const getIconColor = (color: string) => {
    const colors = {
      emerald: 'text-emerald-500',
      purple: 'text-purple-500',
      blue: 'text-blue-500',
      orange: 'text-orange-500'
    };
    return colors[color as keyof typeof colors] || 'text-primary';
  };

  const getBgColor = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/10',
      purple: 'bg-purple-500/10',
      blue: 'bg-blue-500/10',
      orange: 'bg-orange-500/10'
    };
    return colors[color as keyof typeof colors] || 'bg-primary/10';
  };

  return (
    <>
      <Helmet>
        <title>{c.title} - TPC Global</title>
        <meta name="description" content={`TPC Global Market - ${c.subtitle}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0A0D0F] to-[#0C0F12]">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
          {/* HERO SECTION */}
          <div className="relative mb-12 md:mb-16">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/30 via-[#F0B90B]/5 to-[#161B22]/30 rounded-2xl md:rounded-3xl -z-10 backdrop-blur-xl border border-[#F0B90B]/10"></div>
            
            {/* Enhanced icon container */}
            <div className="relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-8 rounded-2xl md:rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 via-[#F8D56B]/15 to-[#F0B90B]/10 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm relative shadow-2xl shadow-[#F0B90B]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-2xl blur-xl md:blur-2xl"></div>
                <div className="absolute inset-0 bg-[#F0B90B]/10 rounded-2xl animate-pulse"></div>
                <TrendingUp className="h-10 w-10 md:h-12 md:w-12 text-[#F0B90B] relative z-10 drop-shadow-lg" />
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-4 md:mb-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F0B90B] to-white mb-2 md:mb-4 tracking-tight leading-tight">
                  {c.title}
                </h1>
                <div className="h-1 w-20 md:w-32 mx-auto bg-gradient-to-r from-[#F0B90B]/50 to-[#F8D56B]/50 rounded-full mb-4 md:mb-6"></div>
              </div>
              <p className="text-lg md:text-2xl lg:text-3xl text-[#F0B90B] font-semibold mb-3 md:mb-4 leading-relaxed">{c.subtitle}</p>
              <p className="text-sm md:text-base lg:text-lg text-[#848E9C]/90 max-w-2xl md:max-w-3xl mx-auto leading-relaxed font-light">{c.supporting}</p>
            </div>
          </div>

          {/* PRODUCT CATEGORIES */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">{c.products}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{c.products}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {products.map((product) => {
                const Icon = product.icon;
                return (
                  <div key={product.id} className="relative group">
                    {/* Background hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                    
                    {/* Main card */}
                    <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#F0B90B]/10">
                      <div className="flex items-start gap-3 md:gap-4 mb-4">
                        <div className="relative">
                          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl ${getBgColor(product.color)} flex items-center justify-center flex-shrink-0 border border-[#30363D]/30`}>
                            <Icon className={`h-6 w-6 md:h-7 md:w-7 ${getIconColor(product.color)}`} />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg blur-lg"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-1">{product.title}</h3>
                          <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed mb-3">{product.description}</p>
                          <div className={`inline-flex px-2 py-1 md:px-3 py-1 rounded-full text-xs md:text-xs font-medium border backdrop-blur-sm ${getStatusColor(product.status)}`}>
                            {product.status}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/${safeLang}/market/tpc-akademi`)}
                        className="w-full mt-3 md:mt-4 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-[#F0B90B]/10 to-[#F8D56B]/10 hover:from-[#F0B90B]/20 hover:to-[#F8D56B]/20 text-[#F0B90B] rounded-lg md:rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#F0B90B]/20 transform hover:scale-105"
                      >
                        {product.cta}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRUST & SAFETY SECTION */}
          <div className="relative mb-8 md:mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-emerald-500/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-emerald-500/20"></div>
            <div className="relative bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-start gap-4 md:gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Shield className="h-6 w-6 md:h-8 md:w-8 text-emerald-400" />
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-lg"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{c.safetyTransparency}</h2>
                  <p className="text-[#C9D1D9]/90 text-sm md:text-base md:text-lg mb-4 md:mb-6 leading-relaxed">{c.safetyDesc}</p>
                  <button
                    onClick={() => navigate(`/${safeLang}/anti-scam`)}
                    className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg md:rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Shield className="h-4 w-4 md:h-5 md:w-5" />
                    {c.antiScam}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
                <p className="text-xs md:text-sm text-[#848E9C]/90 leading-relaxed flex-1">{c.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
