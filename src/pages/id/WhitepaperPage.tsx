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
import { useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
  { id: 'ringkasan', label: 'Ringkasan', icon: FileText },
  { id: 'ekosistem', label: 'Ekosistem', icon: Globe },
  { id: 'token', label: 'Token TPC', icon: Target },
  { id: 'tokenomics', label: 'Tokenomics', icon: BarChart3 },
  { id: 'dao', label: 'DAO Lite', icon: Users },
  { id: 'roadmap', label: 'Roadmap', icon: Clock },
  { id: 'risiko', label: 'Risiko & Disclaimer', icon: AlertTriangle }
];

export default function WhitepaperPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('ringkasan');
  
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const item of navItems) {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="mobile-container pt-6 pb-28">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full">
            Dokumen Resmi
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Whitepaper TPC
        </h1>
        
        <p className="text-[#848E9C] text-base leading-relaxed mb-6">
          Dokumen resmi yang menjelaskan visi, ekosistem, token utilitas, tata kelola, dan arah pengembangan Trader Professional Community.
        </p>
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-[#848E9C]">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Versi: v1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Terakhir diperbarui: {getCurrentDate()}</span>
          </div>
        </div>
        
        {/* CTA */}
        <div className="flex gap-3">
          <button 
            disabled
            className="flex-1 bg-[#1E2329] border border-[#2B3139] text-[#848E9C] font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Unduh PDF (Coming Soon)
          </button>
          <button 
            onClick={() => scrollToSection('ringkasan')}
            className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <FileText className="h-4 w-4" />
            Baca Ringkasan
          </button>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className="sticky top-0 bg-[#0B0E11] border-b border-[#2B3139] z-10 mb-6">
        <div className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-1">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black shadow-lg'
                    : 'text-[#848E9C] hover:text-white hover:bg-[#1E2329]/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ringkasan Eksekutif */}
      <section 
        ref={el => sectionsRef.current['ringkasan'] = el}
        id="ringkasan"
        className="mb-12"
      >
        <div className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#F0B90B]" />
            Ringkasan Eksekutif
          </h2>
          
          <div className="space-y-4 text-[#848E9C]">
            <div>
              <h3 className="text-white font-semibold mb-2">Apa itu TPC</h3>
              <p className="text-sm leading-relaxed">
                Trader Professional Community (TPC) adalah komunitas edukasi trading yang menyediakan materi pembelajaran terstruktur, 
                program pelatihan, dan ekosistem pendukung untuk trader pemula hingga menengah.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">Kenapa TPC dibuat</h3>
              <p className="text-sm leading-relaxed">
                TPC dibuat untuk mengisi gap edukasi trading yang berkualitas dan terstruktur, dengan fokus pada manajemen risiko 
                dan pengembangan skill yang realistis, tanpa janji profit yang tidak realistis.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Prinsip Utama</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">Education-first - Edukasi sebagai prioritas utama</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">Transparency - Operasional terbuka dan jelas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">No financial advice - Tidak memberikan nasihat keuangan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">Utility token only - Token hanya untuk akses fitur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ekosistem TPC */}
      <section 
        ref={el => sectionsRef.current['ekosistem'] = el}
        id="ekosistem"
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Globe className="h-5 w-5 text-[#F0B90B]" />
          Ekosistem TPC
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: BookOpen, title: 'Edukasi', desc: 'Ebook, pelatihan terstruktur, materi pembelajaran dari dasar hingga lanjutan', color: 'blue' },
            { icon: Users, title: 'Komunitas Profesional', desc: 'Diskusi, sharing pengalaman, dan tanya jawab sesama trader', color: 'purple' },
            { icon: Settings, title: 'Layanan Jasa', desc: 'Tools trading, website development, dan layanan pendukung lainnya', color: 'emerald' },
            { icon: Lightbulb, title: 'Kolaborasi Sektor Riil', desc: 'Kerja sama dengan institusi dan profesional trading', color: 'amber' },
            { icon: Target, title: 'Member Area', desc: 'Dashboard personal, tracking progress, dan akses fitur eksklusif', color: 'gold' }
          ].map((item, index) => (
            <div key={index} className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-5 w-5 text-${item.color}-400`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-[#848E9C] text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-white text-sm font-medium">
              TPC bukan platform investasi dan tidak menghimpun dana publik.
            </p>
          </div>
        </div>
      </section>

      {/* Token TPC */}
      <section 
        ref={el => sectionsRef.current['token'] = el}
        id="token"
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Target className="h-5 w-5 text-[#F0B90B]" />
          Token TPC (Utility Token)
        </h2>
        
        <div className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Apa itu Token TPC</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              Token TPC adalah token utilitas berbasis blockchain yang digunakan untuk mengakses fitur dan layanan 
              dalam ekosistem TPC. Token ini bukan instrumen investasi dan tidak menjanjikan keuntungan finansial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Fungsi Token</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white">Akses fitur member premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white">Akses konten edukasi eksklusif</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white">Partisipasi DAO Lite terbatas</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Yang BUKAN Fungsi Token</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white">Bukan instrumen investasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white">Bukan kepemilikan saham perusahaan</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white">Bukan bagi hasil keuntungan</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white">Tidak menjamin nilai atau harga</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section 
        ref={el => sectionsRef.current['tokenomics'] = el}
        id="tokenomics"
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-[#F0B90B]" />
          Tokenomics
        </h2>
        
        <div className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Total Supply</h3>
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-4">
              <div className="text-2xl font-bold text-[#F0B90B] mb-1">1,000,000,000 TPC</div>
              <div className="text-sm text-[#848E9C]">Fixed supply - tidak ada inflasi</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Distribusi Token</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2B3139]">
                    <th className="text-left text-[#848E9C] pb-3">Kategori</th>
                    <th className="text-right text-[#848E9C] pb-3">Persentase</th>
                    <th className="text-right text-[#848E9C] pb-3">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#2B3139]/50">
                    <td className="text-white py-3">Community & Ecosystem</td>
                    <td className="text-right text-white py-3">40%</td>
                    <td className="text-right text-[#F0B90B] py-3">400,000,000</td>
                  </tr>
                  <tr className="border-b border-[#2B3139]/50">
                    <td className="text-white py-3">Development & Operations</td>
                    <td className="text-right text-white py-3">25%</td>
                    <td className="text-right text-[#F0B90B] py-3">250,000,000</td>
                  </tr>
                  <tr className="border-b border-[#2B3139]/50">
                    <td className="text-white py-3">Liquidity</td>
                    <td className="text-right text-white py-3">20%</td>
                    <td className="text-right text-[#F0B90B] py-3">200,000,000</td>
                  </tr>
                  <tr>
                    <td className="text-white py-3">Reserve</td>
                    <td className="text-right text-white py-3">15%</td>
                    <td className="text-right text-[#F0B90B] py-3">150,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-3 bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg">
            <p className="text-[#F0B90B] text-xs">
              Tokenomics disusun untuk mendukung utilitas, bukan spekulasi.
            </p>
          </div>
        </div>
      </section>

      {/* DAO Lite */}
      <section 
        ref={el => sectionsRef.current['dao'] = el}
        id="dao"
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Users className="h-5 w-5 text-[#F0B90B]" />
          DAO Lite Governance
        </h2>
        
        <div className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Apa yang Bisa Di-voting</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white">Pengembangan fitur baru</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white">Program edukasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white">Arah komunitas</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Apa yang TIDAK Bisa Di-voting</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white">Keuangan perusahaan</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white">Distribusi keuntungan</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-white">Operasional inti</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-white text-sm font-medium">
              DAO Lite ≠ DAO finansial
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section 
        ref={el => sectionsRef.current['roadmap'] = el}
        id="roadmap"
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="h-5 w-5 text-[#F0B90B]" />
          Roadmap
        </h2>
        
        <div className="space-y-4">
          {[
            {
              phase: 1,
              title: 'Foundation',
              color: 'emerald',
              items: ['Trust Pages', 'Edukasi Dasar', 'Member Area Awal']
            },
            {
              phase: 2,
              title: 'Utility',
              color: 'blue',
              items: ['Akses Token', 'Konten Premium', 'Referral 1 Level']
            },
            {
              phase: 3,
              title: 'Governance',
              color: 'purple',
              items: ['DAO Lite', 'Voting Terbatas']
            },
            {
              phase: 4,
              title: 'Ecosystem',
              color: 'amber',
              items: ['Layanan & Kolaborasi', 'Perluasan Edukasi']
            }
          ].map((phase, index) => (
            <div key={index} className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-${phase.color}-500/20 flex items-center justify-center`}>
                  <span className={`text-${phase.color}-400 font-bold`}>{phase.phase}</span>
                </div>
                <h3 className="text-white font-bold text-lg">Phase {phase.phase} — {phase.title}</h3>
              </div>
              <div className="space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle className={`h-4 w-4 text-${phase.color}-400 shrink-0 mt-0.5`} />
                    <p className="text-white text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg">
          <p className="text-[#F0B90B] text-xs">
            Roadmap bersifat arah pengembangan, bukan janji hasil.
          </p>
        </div>
      </section>

      {/* Risiko & Disclaimer */}
      <section 
        ref={el => sectionsRef.current['risiko'] = el}
        id="risiko"
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[#F0B90B]" />
          Risiko & Disclaimer
        </h2>
        
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/10 border border-red-500/30 rounded-2xl p-6">
          <div className="space-y-3">
            {[
              'Trading & aset digital berisiko tinggi dan dapat menyebabkan kerugian total.',
              'Edukasi yang disediakan bukan nasihat keuangan dan tidak menggantikan penilaian independen.',
              'Tidak ada jaminan hasil atau keuntungan dari penggunaan ekosistem TPC.',
              'Keputusan untuk berpartisipasi merupakan tanggung jawab pribadi masing-masing individu.'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-white text-sm">{item}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => navigate('/id/faq')}
              className="flex-1 bg-[#12161C] border border-[#2B3139] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1E2329] transition-all"
            >
              <FileText className="h-4 w-4" />
              Baca FAQ
            </button>
            <button 
              onClick={() => navigate('/id/transparansi')}
              className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <Shield className="h-4 w-4" />
              Lihat Transparansi
            </button>
          </div>
        </div>
      </section>

      {/* CTA Penutup */}
      <div className="bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-black" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Transparansi adalah prioritas kami</h2>
          <p className="text-[#848E9C] text-sm">
            Pelajari lebih lanjut tentang cara kerja TPC sebelum berpartisipasi.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/id/transparansi')}
            className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <Shield className="h-4 w-4" />
            Transparansi
          </button>
          <button 
            onClick={() => navigate('/id/faq')}
            className="flex-1 bg-[#12161C] border border-[#2B3139] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
          >
            <FileText className="h-4 w-4" />
            FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
