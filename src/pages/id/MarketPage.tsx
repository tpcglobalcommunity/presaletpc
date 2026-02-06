import { 
  Shield, 
  BookOpen, 
  Target, 
  Users, 
  Settings, 
  Lightbulb, 
  Globe, 
  Zap, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Coins,
  TrendingUp,
  BarChart3,
  Package,
  GraduationCap,
  Code,
  Megaphone,
  Handshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publicPath } from '@/lib/publicPath';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'Available' | 'Coming Soon';
  cta: string;
  path?: string;
}

interface EcosystemMetric {
  label: string;
  value: string;
  icon: any;
  color: string;
}

export default function MarketPage() {
  const navigate = useNavigate();

  const products: ProductItem[] = [
    {
      id: 'ebook',
      title: 'Ebook & Materi Edukasi',
      description: 'Materi pembelajaran terstruktur dari dasar hingga lanjutan',
      icon: BookOpen,
      status: 'Available',
      cta: 'Pelajari',
      path: publicPath('id', 'edukasi')
    },
    {
      id: 'pelatihan',
      title: 'Pelatihan Trader',
      description: 'Fokus skill, mental, dan konsistensi proses trading',
      icon: GraduationCap,
      status: 'Coming Soon',
      cta: 'Lihat Program',
      path: publicPath('id', 'pelatihan')
    },
    {
      id: 'tools',
      title: 'Tools & Software Pendukung',
      description: 'Analisis, utility tools untuk trading yang lebih baik',
      icon: Code,
      status: 'Coming Soon',
      cta: 'Detail'
    },
    {
      id: 'iklan',
      title: 'Jasa Periklanan Digital',
      description: 'TikTok / YouTube / Instagram Ads untuk bisnis',
      icon: Megaphone,
      status: 'Available',
      cta: 'Info Layanan'
    },
    {
      id: 'website',
      title: 'Jasa Pembuatan Website',
      description: 'Website bisnis & edukasi profesional',
      icon: Globe,
      status: 'Available',
      cta: 'Lihat Detail'
    },
    {
      id: 'kerjasama',
      title: 'Kerja Sama Bisnis',
      description: 'Vendor sektor riil & konvensional',
      icon: Handshake,
      status: 'Coming Soon',
      cta: 'Pelajari'
    }
  ];

  const ecosystemMetrics: EcosystemMetric[] = [
    { label: 'Materi Edukasi', value: '24+', icon: BookOpen, color: 'blue' },
    { label: 'Program Pelatihan', value: '3', icon: GraduationCap, color: 'purple' },
    { label: 'Event Komunitas', value: '12', icon: Users, color: 'emerald' },
    { label: 'Proposal DAO Lite', value: '5', icon: Target, color: 'amber' }
  ];

  const handleProductClick = (product: ProductItem) => {
    if (product.path) {
      navigate(product.path);
    }
  };

  return (
    <div className="mobile-container pt-6 pb-28">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full">
            Ecosystem Overview
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Market TPC
        </h1>
        
        <p className="text-[#848E9C] text-base leading-relaxed mb-6">
          Etalase produk, layanan, dan aktivitas dalam ekosistem Trader Professional Community.
        </p>
        
        {/* Trust Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Target className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-white">Utility-based</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <BookOpen className="h-3 w-3 text-emerald-400" />
            <span className="text-xs text-white">Education-first</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Shield className="h-3 w-3 text-red-400" />
            <span className="text-xs text-white">No profit guarantee</span>
          </div>
        </div>
        
        {/* CTA */}
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/id/whitepaper')}
            className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <FileText className="h-4 w-4" />
            Lihat Whitepaper
          </button>
          <button 
            onClick={() => navigate('/id/transparansi')}
            className="flex-1 bg-[#12161C] border border-[#2B3139] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
          >
            <Shield className="h-4 w-4" />
            Lihat Transparansi
          </button>
        </div>
      </div>

      {/* Produk & Layanan Aktif */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Package className="h-5 w-5 text-[#F0B90B]" />
          Produk & Layanan Aktif
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F0B90B]/20 flex items-center justify-center shrink-0">
                  <product.icon className="h-5 w-5 text-[#F0B90B]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-1">{product.title}</h3>
                  <p className="text-[#848E9C] text-xs leading-relaxed">{product.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.status === 'Available' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {product.status}
                </span>
                <button 
                  onClick={() => handleProductClick(product)}
                  className="text-[#F0B90B] text-xs font-medium hover:text-[#F8D56B] transition-colors flex items-center gap-1"
                >
                  {product.cta}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg">
          <p className="text-[#F0B90B] text-xs">
            Seluruh layanan bersifat jasa profesional, tanpa jaminan hasil.
          </p>
        </div>
      </section>

      {/* Utilitas Token TPC */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Coins className="h-5 w-5 text-[#F0B90B]" />
            Utilitas Token TPC
          </h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-white text-sm">Akses fitur member area</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-white text-sm">Akses konten premium</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-white text-sm">Partisipasi DAO Lite terbatas</span>
            </div>
          </div>
          
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-white text-sm font-medium">
                Token TPC adalah utility token, bukan instrumen investasi dan tidak menjanjikan keuntungan.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/id/whitepaper#token')}
            className="w-full bg-[#12161C] border border-[#2B3139] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
          >
            Pelajari Token TPC
          </button>
        </div>
      </section>

      {/* Aktivitas Ekosistem */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-[#F0B90B]" />
          Aktivitas Ekosistem
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {ecosystemMetrics.map((metric, index) => (
            <div key={index} className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-${metric.color}-500/20 flex items-center justify-center`}>
                  <metric.icon className={`h-4 w-4 text-${metric.color}-400`} />
                </div>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </div>
              <p className="text-[#848E9C] text-xs">{metric.label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg">
          <p className="text-[#F0B90B] text-xs">
            Angka bersifat informatif, bukan indikator keuntungan.
          </p>
        </div>
      </section>

      {/* Roadmap Snapshot */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="h-5 w-5 text-[#F0B90B]" />
          Roadmap Snapshot
        </h2>
        
        <div className="space-y-4">
          <div className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Phase 1 — Foundation</h3>
                <p className="text-[#848E9C] text-xs">Trust pages, edukasi dasar, member area</p>
              </div>
            </div>
            <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full inline-block">
              Sedang Berjalan
            </div>
          </div>
          
          <div className="bg-[#12161C] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Phase 2 — Utility</h3>
                <p className="text-[#848E9C] text-xs">Akses token, konten premium, referral</p>
              </div>
            </div>
            <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full inline-block">
              Next Milestone
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg">
          <p className="text-[#F0B90B] text-xs">
            Roadmap bersifat arah pengembangan, bukan janji hasil.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/id/whitepaper#roadmap')}
          className="w-full mt-4 bg-[#12161C] border border-[#2B3139] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
        >
          Lihat Roadmap Lengkap
        </button>
      </section>

      {/* Trust Reminder */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">Trust Reminder</h3>
              <p className="text-[#848E9C] text-sm leading-relaxed">
                Market TPC tidak menampilkan harga token atau data spekulatif. 
                Fokus utama kami adalah edukasi, utilitas, dan pengembangan ekosistem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Penutup */}
      <section>
        <div className="bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Ingin berpartisipasi di ekosistem TPC?
            </h2>
            <p className="text-[#848E9C] text-sm">
              Pelajari dokumentasi resmi sebelum menggunakan fitur.
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/id/login')}
              className="w-full bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-3 px-4 rounded-lg hover:shadow-lg transition-all"
            >
              Masuk ke Member Area
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/id/whitepaper')}
                className="bg-[#12161C] border border-[#2B3139] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Whitepaper
              </button>
              <button 
                onClick={() => navigate('/id/transparansi')}
                className="bg-[#12161C] border border-[#2B3139] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1E2329] transition-all"
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Transparansi
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
