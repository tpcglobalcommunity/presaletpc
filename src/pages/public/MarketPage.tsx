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
      
      <div className="min-h-screen bg-[#0B0E11]">
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          {/* HERO SECTION */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/20 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm">
              <TrendingUp className="h-12 w-12 text-[#F0B90B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">{c.title}</h1>
            <p className="text-2xl text-[#F0B90B] font-medium mb-3">{c.subtitle}</p>
            <p className="text-[#848E9C] text-lg max-w-2xl mx-auto">{c.supporting}</p>
          </div>

          {/* PRODUCT CATEGORIES */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">{c.products}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => {
                const Icon = product.icon;
                return (
                  <div key={product.id} className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl ${getBgColor(product.color)} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-7 w-7 ${getIconColor(product.color)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                        <p className="text-[#848E9C] text-sm leading-relaxed mb-3">{product.description}</p>
                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                          {product.status}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/${safeLang}/market/tpc-akademi`)}
                      className="w-full mt-4 px-4 py-3 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 text-[#F0B90B] rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      {product.cta}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRUST & SAFETY SECTION */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{c.safetyTransparency}</h2>
                <p className="text-[#C9D1D9] text-lg mb-6">{c.safetyDesc}</p>
                <button
                  onClick={() => navigate(`/${safeLang}/anti-scam`)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium"
                >
                  <Shield className="h-5 w-5" />
                  {c.antiScam}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="bg-[#1C2128] border border-[#30363D]/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#848E9C] leading-relaxed">{c.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
