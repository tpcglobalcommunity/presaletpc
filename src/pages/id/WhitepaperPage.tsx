import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  ChevronRight, 
  Shield, 
  BookOpen, 
  Target, 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  ArrowRight,
  Globe,
  Lightbulb,
  Zap,
  Clock,
  TrendingUp,
  BarChart3,
  Database,
  Settings,
  Lock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// i18n translations
const translations = {
  id: {
    pageTitle: 'Whitepaper - TPC Global',
    pageSubtitle: 'Dokumen lengkap tentang ekosistem, token, dan visi TPC',
    backToHome: 'Kembali ke Home',
    downloadPDF: 'Unduh PDF',
    sections: 'Bagian',
    ringkasan: 'Ringkasan',
    ekosistem: 'Ekosistem',
    token: 'Token TPC',
    presale: 'Presale',
    tokenomics: 'Tokenomics',
    dao: 'DAO Lite',
    roadmap: 'Roadmap',
    risiko: 'Risiko & Disclaimer',
    educationFirst: 'Education-first',
    noProfitPromise: 'Tanpa janji profit',
    riskManagement: 'Fokus manajemen risiko',
    communityDriven: 'Community-driven',
    transparency: 'Transparansi',
    legalCompliance: 'Kepatuhan hukum',
    lastUpdated: 'Terakhir diperbarui',
    tableOfContents: 'Daftar Isi',
    scrollToSection: 'Scroll ke bagian'
  },
  en: {
    pageTitle: 'Whitepaper - TPC Global',
    pageSubtitle: 'Complete document about TPC ecosystem, token, and vision',
    backToHome: 'Back to Home',
    downloadPDF: 'Download PDF',
    sections: 'Sections',
    ringkasan: 'Summary',
    ekosistem: 'Ecosystem',
    token: 'TPC Token',
    presale: 'Presale',
    tokenomics: 'Tokenomics',
    dao: 'DAO Lite',
    roadmap: 'Roadmap',
    risiko: 'Risk & Disclaimer',
    educationFirst: 'Education-first',
    noProfitPromise: 'No profit promises',
    riskManagement: 'Risk management focus',
    communityDriven: 'Community-driven',
    transparency: 'Transparency',
    legalCompliance: 'Legal compliance',
    lastUpdated: 'Last updated',
    tableOfContents: 'Table of Contents',
    scrollToSection: 'Scroll to section'
  }
};

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
  { id: 'ringkasan', label: 'Ringkasan', icon: FileText },
  { id: 'ekosistem', label: 'Ekosistem', icon: Globe },
  { id: 'token', label: 'Token TPC', icon: Target },
  { id: 'presale', label: 'Presale', icon: Award },
  { id: 'tokenomics', label: 'Tokenomics', icon: BarChart3 },
  { id: 'dao', label: 'DAO Lite', icon: Users },
  { id: 'roadmap', label: 'Roadmap', icon: Clock },
  { id: 'risiko', label: 'Risiko & Disclaimer', icon: AlertTriangle }
];

export default function WhitepaperPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  const t = translations[lang];
  const [activeSection, setActiveSection] = useState('ringkasan');
  
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const isEN = lang === 'en';

  // Dynamic nav items based on language
  const dynamicNavItems = navItems.map(item => ({
    ...item,
    label: t[item.id as keyof typeof t] || item.label
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const item of dynamicNavItems) {
        const element = sectionsRef.current[item.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dynamicNavItems]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_50%_-100px,rgba(240,185,11,0.08),transparent),linear-gradient(to_bottom,#0B0E11,black)]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E11]/75 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/55">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate(`/${lang}`)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span className="font-medium">{t.backToHome}</span>
              </button>

              <div className="hidden md:block h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/10 border border-orange-500/20">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-base md:text-lg truncate">{t.pageTitle}</h1>
                  <p className="text-[#848E9C] text-xs truncate">{t.pageSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                {t.educationFirst}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                {t.noProfitPromise}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                {t.riskManagement}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full">
              {isEN ? 'Official Document' : 'Dokumen Resmi'}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            {isEN ? 'TPC Whitepaper' : 'Whitepaper TPC'}
          </h1>
          
          <p className="text-[#848E9C] text-base leading-relaxed mb-6">
            {isEN 
              ? 'Official document explaining the vision, ecosystem, utility token, governance, and development direction of Trader Professional Community.'
              : 'Dokumen resmi yang menjelaskan visi, ekosistem, token utilitas, tata kelola, dan arah pengembangan Trader Professional Community.'
            }
          </p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-[#848E9C]">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Version: v1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{t.lastUpdated}: {getCurrentDate()}</span>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex gap-3">
            <button 
              disabled
              className="flex-1 bg-[#1E2329] border border-[#2B3139] text-[#848E9C] font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              {t.downloadPDF}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">{t.tableOfContents}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dynamicNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeSection === item.id
                    ? 'border-orange-500/50 bg-orange-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-[#848E9C] hover:text-white hover:border-orange-500/30'
                }`}
              >
                <item.icon className="h-5 w-5 mb-2 mx-auto" />
                <div className="text-sm font-medium">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Ringkasan */}
          <section 
            ref={(el) => { sectionsRef.current['ringkasan'] = el; }}
            id="ringkasan"
            className="scroll-mt-24"
          >
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-orange-500" />
                {t.ringkasan}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-[#C9D1D9] leading-relaxed mb-4">
                  {isEN 
                    ? 'TPC (Trader Professional Community) is a blockchain-based education ecosystem focused on trading literacy and risk management. Our mission is to provide structured education, transparent operations, and community-driven governance.'
                    : 'TPC (Trader Professional Community) adalah ekosistem edukasi berbasis blockchain yang fokus pada literasi trading dan manajemen risiko. Misi kami adalah memberikan edukasi terstruktur, operasi transparan, dan tata kelola berbasis komunitas.'
                  }
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <BookOpen className="h-8 w-8 text-blue-500 mb-3" />
                    <h3 className="text-white font-semibold mb-2">{t.educationFirst}</h3>
                    <p className="text-[#848E9C] text-sm">
                      {isEN ? 'Structured learning from basic to advanced' : 'Pembelajaran terstruktur dari dasar hingga lanjutan'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <Shield className="h-8 w-8 text-green-500 mb-3" />
                    <h3 className="text-white font-semibold mb-2">{t.noProfitPromise}</h3>
                    <p className="text-[#848E9C] text-sm">
                      {isEN ? 'No financial advice or profit guarantees' : 'Tanpa nasihat keuangan atau jaminan profit'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <Users className="h-8 w-8 text-purple-500 mb-3" />
                    <h3 className="text-white font-semibold mb-2">{t.communityDriven}</h3>
                    <p className="text-[#848E9C] text-sm">
                      {isEN ? 'Community participation in governance' : 'Partisipasi komunitas dalam tata kelola'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section 
            ref={(el) => { sectionsRef.current['risiko'] = el; }}
            id="risiko"
            className="scroll-mt-24"
          >
            <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/5">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                {t.risiko}
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                  <h3 className="text-red-400 font-semibold mb-2">
                    {isEN ? 'Important Risk Disclaimer' : 'Disclaimer Risiko Penting'}
                  </h3>
                  <p className="text-[#C9D1D9] leading-relaxed">
                    {isEN 
                      ? 'TPC is an education platform, not financial advice. Trading and digital assets involve high risk. Past performance does not guarantee future results. Always do your own research (DYOR) and never invest more than you can afford to lose.'
                      : 'TPC adalah platform edukasi, bukan nasihat keuangan. Trading dan aset digital melibatkan risiko tinggi. Kinerja masa lalu tidak menjamin hasil masa depan. Selalu lakukan riset mandiri (DYOR) dan jangan pernah berinvestasi lebih dari yang Anda mampu untuk kehilangan.'
                    }
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <h4 className="text-white font-medium mb-2">
                      {isEN ? 'No Investment Advice' : 'Tanpa Nasihat Investasi'}
                    </h4>
                    <p className="text-[#848E9C] text-sm">
                      {isEN 
                        ? 'TPC provides education only, not investment recommendations.'
                        : 'TPC hanya menyediakan edukasi, bukan rekomendasi investasi.'
                      }
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <h4 className="text-white font-medium mb-2">
                      {isEN ? 'Risk Responsibility' : 'Tanggung Jawab Risiko'}
                    </h4>
                    <p className="text-[#848E9C] text-sm">
                      {isEN 
                        ? 'All trading decisions are the sole responsibility of each individual.'
                        : 'Semua keputusan trading sepenuhnya menjadi tanggung jawab masing-masing individu.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center">
            <p className="text-[#848E9C] text-sm mb-4">
              {isEN 
                ? 'This whitepaper is for informational purposes only and does not constitute financial advice.'
                : 'Whitepaper ini hanya untuk tujuan informasi dan tidak merupakan nasihat keuangan.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/${lang}/transparansi`)}
                className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                {t.viewTransparency}
              </button>
              <button
                onClick={() => navigate(`/${lang}/faq`)}
                className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                {isEN ? 'View FAQ' : 'Lihat FAQ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
