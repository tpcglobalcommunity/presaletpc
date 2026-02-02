import { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  AlertTriangle, 
  Shield,
  BookOpen,
  Target,
  Users,
  Award,
  Lock,
  ArrowRight,
  X
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
  important?: boolean;
  learnMore?: {
    text: string;
    link: string;
  };
}

const faqData: FAQItem[] = [
  // Tentang TPC
  {
    id: 'tpc-1',
    question: 'Apa itu TPC?',
    answer: 'TPC adalah komunitas edukasi trading dan literasi risiko. TPC menyediakan materi terstruktur, program pelatihan, dan fitur member. Token TPC (utility) digunakan untuk akses ke fitur tertentu, bukan instrumen investasi.',
    category: 'tentang-tpc',
    tags: ['komunitas', 'edukasi', 'trading'],
    important: true
  },
  {
    id: 'tpc-2',
    question: 'TPC ini komunitas atau perusahaan?',
    answer: 'TPC adalah komunitas edukasi yang dikelola secara profesional, bukan perusahaan investasi atau MLM.',
    category: 'tentang-tpc'
  },
  {
    id: 'tpc-3',
    question: 'Siapa yang cocok bergabung?',
    answer: 'TPC cocok untuk pemula yang ingin belajar trading dasar hingga menengah dengan pendekatan edukasi dan risiko.',
    category: 'tentang-tpc'
  },
  {
    id: 'tpc-4',
    question: 'Apa komitmen utama TPC?',
    answer: 'Komitmen TPC adalah edukasi berkualitas, transparansi operasional, dan komunitas yang suportif tanpa janji profit.',
    category: 'tentang-tpc'
  },

  // Edukasi & Risiko
  {
    id: 'edukasi-1',
    question: 'Apakah materi TPC menjamin profit?',
    answer: 'Tidak. TPC tidak menjamin profit apapun. Materi edukasi bertujuan meningkatkan pemahaman trading dan manajemen risiko.',
    category: 'edukasi-risiko'
  },
  {
    id: 'edukasi-2',
    question: 'Apa risiko terbesar trading?',
    answer: 'Risiko terbesar adalah kehilangan modal. Trading & aset digital memiliki volatilitas tinggi dan risiko kerugian total.',
    category: 'edukasi-risiko'
  },
  {
    id: 'edukasi-3',
    question: 'Apakah TPC memberi sinyal trading?',
    answer: 'Tidak. TPC tidak menyediakan sinyal trading atau rekomendasi jual/beli. Fokus kami adalah edukasi dan pengembangan skill.',
    category: 'edukasi-risiko'
  },
  {
    id: 'edukasi-4',
    question: 'Apa bedanya edukasi vs nasihat keuangan?',
    answer: 'Edukasi mengajarkan konsep dan skill, sedangkan nasihat keuangan memberikan rekomendasi spesifik. TPC hanya menyediakan edukasi.',
    category: 'edukasi-risiko'
  },

  // Token TPC (Utility)
  {
    id: 'token-1',
    question: 'Token TPC itu untuk apa?',
    answer: 'Token TPC adalah utilitas untuk akses materi premium, fitur eksklusif, dan partisipasi dalam komunitas. Bukan untuk investasi.',
    category: 'token-tpc'
  },
  {
    id: 'token-2',
    question: 'Apakah token TPC adalah investasi?',
    answer: 'Tidak. Token TPC adalah utilitas, bukan instrumen investasi. Nilainya bergantung pada penggunaan dalam ekosistem TPC.',
    category: 'token-tpc',
    tags: ['token', 'investasi', 'utility'],
    important: true
  },
  {
    id: 'token-3',
    question: 'Apakah ada jaminan harga token naik?',
    answer: 'Tidak ada jaminan harga token naik. Harga token ditentukan pasar dan bisa naik atau turun.',
    category: 'token-tpc',
    tags: ['token', 'harga', 'jaminan'],
    important: true
  },
  {
    id: 'token-4',
    question: 'Apakah token memberi hak kepemilikan atau bagi hasil?',
    answer: 'Tidak. Token TPC tidak memberi hak kepemilikan perusahaan atau bagi hasil keuntungan. Hanya untuk akses fitur.',
    category: 'token-tpc'
  },
  {
    id: 'token-5',
    question: 'Apakah wajib punya token untuk ikut komunitas?',
    answer: 'Tidak wajib. Komunitas dasar terbuka untuk semua, namun token diperlukan untuk akses materi premium.',
    category: 'token-tpc'
  },

  // Referral (1 Level)
  {
    id: 'referral-1',
    question: 'Apa itu referral 1 level?',
    answer: 'Referral 1 level adalah sistem di mana Anda hanya mendapatkan komisi dari orang yang langsung Anda ajak, tanpa level bertingkat.',
    category: 'referral'
  },
  {
    id: 'referral-2',
    question: 'Bagaimana komisi dihitung?',
    answer: 'Komisi dihitung sebagai persentase dari pembelian token oleh referral langsung Anda. Detail ada di dashboard member.',
    category: 'referral'
  },
  {
    id: 'referral-3',
    question: 'Apakah ini MLM?',
    answer: 'Tidak. TPC menggunakan referral 1 level, bukan MLM multi-level. Tidak ada pembayaran dari downline bertingkat.',
    category: 'referral',
    tags: ['referral', 'MLM', 'komisi'],
    important: true
  },
  {
    id: 'referral-4',
    question: 'Apakah referral bersifat wajib?',
    answer: 'Tidak wajib. Referral adalah opsional untuk member yang ingin berbagi komunitas dengan orang lain.',
    category: 'referral'
  },

  // DAO Lite
  {
    id: 'dao-1',
    question: 'Apa itu DAO Lite?',
    answer: 'DAO Lite adalah sistem governance ringan di mana member token dapat berpartisipasi dalam voting keputusan komunitas.',
    category: 'dao-lite'
  },
  {
    id: 'dao-2',
    question: 'Apa yang bisa divoting?',
    answer: 'Yang bisa divoting adalah pengembangan edukasi, update fitur, dan keputusan komunitas non-finansial.',
    category: 'dao-lite'
  },
  {
    id: 'dao-3',
    question: 'Apa yang tidak bisa divoting?',
    answer: 'Keputusan finansial, distribusi profit, dan operasional harian tidak melalui voting DAO.',
    category: 'dao-lite'
  },

  // Keamanan & Transparansi
  {
    id: 'keamanan-1',
    question: 'Dari mana sumber pendapatan TPC?',
    answer: 'Pendapatan TPC berasal dari penjualan produk edukasi (ebook/pelatihan), layanan jasa profesional, tools/software pendukung, dan kerja sama bisnis. Token TPC digunakan sebagai utilitas akses fitur tertentu.',
    category: 'keamanan-transparansi',
    tags: ['pendapatan', 'bisnis', 'transparansi'],
    important: true
  },
  {
    id: 'keamanan-2',
    question: 'Apakah TPC menghimpun dana publik?',
    answer: 'Tidak. TPC tidak menghimpun dana publik atau mengelola investasi member. Penjualan token untuk akses layanan.',
    category: 'keamanan-transparansi'
  },
  {
    id: 'keamanan-3',
    question: 'Bagaimana transparansi TPC ditunjukkan?',
    answer: 'Transparansi ditunjukkan melalui halaman Transparansi yang menampilkan wallet resmi, operasional, dan laporan komunitas.',
    category: 'keamanan-transparansi',
    learnMore: {
      text: 'Lihat Halaman Transparansi',
      link: '/id/transparansi'
    }
  },
  {
    id: 'keamanan-4',
    question: 'Apa yang harus dilakukan jika menemukan pihak mengaku TPC?',
    answer: 'Laporkan ke admin komunitas resmi. TPC tidak pernah menghubungi lebih dulu menawarkan investasi atau meminta dana.',
    category: 'keamanan-transparansi',
    learnMore: {
      text: 'Baca Anti-Scam Guide',
      link: '/id/anti-scam'
    }
  }
];

const categories: Category[] = [
  { 
    id: 'tentang-tpc', 
    label: 'Tentang TPC', 
    icon: HelpCircle,
    description: 'Dasar tentang komunitas, prinsip, dan tujuan.'
  },
  { 
    id: 'edukasi-risiko', 
    label: 'Edukasi & Risiko', 
    icon: BookOpen,
    description: 'Batasan edukasi, risiko, dan ekspektasi realistis.'
  },
  { 
    id: 'token-tpc', 
    label: 'Token TPC (Utility)', 
    icon: Target,
    description: 'Fungsi token sebagai utilitas akses, bukan investasi.'
  },
  { 
    id: 'referral', 
    label: 'Referral (1 Level)', 
    icon: Users,
    description: 'Referral satu tingkat, bukan berjenjang.'
  },
  { 
    id: 'dao-lite', 
    label: 'DAO Lite', 
    icon: Award,
    description: 'Partisipasi keputusan non-finansial.'
  },
  { 
    id: 'keamanan-transparansi', 
    label: 'Keamanan & Transparansi', 
    icon: Shield,
    description: 'Transparansi, anti-scam, dan verifikasi.'
  }
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('tentang-tpc');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  const resetSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="mobile-container pt-6 pb-28">
      {/* Hero Section */}
      <div className="mb-8">
        {/* Badge Row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full">
            Trust & Clarity
          </span>
          <span className="px-2 py-1 bg-[#1E2329]/50 text-[#848E9C] text-xs font-medium rounded-full">
            Diperbarui berkala
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          FAQ TPC
        </h1>
        
        <p className="text-[#848E9C] text-base leading-relaxed mb-6">
          Jawaban ringkas untuk pertanyaan paling umum tentang TPC, edukasi, token, dan keamanan.
        </p>
        
        {/* Search Bar Premium */}
        <div className="bg-[#12161C] border border-[#2B3139] rounded-xl p-1 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
            <input
              type="text"
              placeholder="Cari: token, referral, keamanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-[#848E9C] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={resetSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848E9C] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Trust Chips Premium */}
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Shield className="h-3 w-3 text-emerald-400" />
            <span className="text-xs text-white">Tanpa jaminan profit</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Target className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-white">Utility token (akses fitur)</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <Lock className="h-3 w-3 text-purple-400" />
            <span className="text-xs text-white">Bukan MLM</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329]/50 border border-[#2B3139]/50 rounded-lg flex items-center gap-2">
            <BookOpen className="h-3 w-3 text-amber-400" />
            <span className="text-xs text-white">Education-first</span>
          </div>
        </div>
        
        {/* Scroll Hint */}
        <p className="text-[#848E9C] text-xs mt-3">
          Gunakan pencarian untuk cepat menemukan jawaban.
        </p>
      </div>

      {/* FAQ Categories - Segmented Control */}
      <div className="mb-6">
        <div className="bg-[#12161C] border border-[#2B3139] rounded-2xl p-1">
          <div className="flex gap-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black shadow-lg'
                    : 'text-[#848E9C] hover:text-white hover:bg-[#1E2329]/50'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Category Description */}
        {activeCategoryData && (
          <div className="mt-3 text-center">
            <p className="text-[#848E9C] text-sm">
              Kategori aktif: <span className="text-white font-medium">{activeCategoryData.label}</span>
            </p>
            <p className="text-[#848E9C] text-xs mt-1">
              {activeCategoryData.description}
            </p>
          </div>
        )}
      </div>

      {/* FAQ Content */}
      <div id="faq" className="mb-12">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-xl bg-[#12161C] border border-[#2B3139] flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-[#848E9C]" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              Tidak ada hasil untuk '{searchQuery}'
            </h3>
            <p className="text-[#848E9C] text-sm mb-4">Coba kata kunci lain atau pilih kategori berbeda</p>
            <button
              onClick={resetSearch}
              className="px-4 py-2 bg-[#F0B90B]/20 text-[#F0B90B] text-sm font-medium rounded-lg hover:bg-[#F0B90B]/30 transition-colors"
            >
              Reset pencarian
            </button>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQs.map((faq) => {
              const CategoryIcon = categories.find(cat => cat.id === faq.category)?.icon;
              return (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-[#12161C] border border-[#2B3139] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <AccordionTrigger className="hover:no-underline py-5 px-6 text-left">
                    <div className="flex items-center gap-3 flex-1">
                      {CategoryIcon && (
                        <CategoryIcon className="h-4 w-4 text-[#F0B90B] shrink-0" />
                      )}
                      <span className="text-white font-medium flex-1">{faq.question}</span>
                      {faq.important && (
                        <span className="px-2 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full shrink-0">
                          Penting
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5">
                    <p className="text-[#848E9C] text-sm leading-relaxed mb-4">
                      {faq.answer}
                    </p>
                    {faq.learnMore && (
                      <button
                        onClick={() => navigate(faq.learnMore.link)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-sm font-medium rounded-lg hover:bg-[#F0B90B]/30 transition-colors"
                      >
                        {faq.learnMore.text}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      {/* Key Disclaimers - Elegant & Strong */}
      <div id="disclaimer" className="bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Disclaimer Penting</h3>
            <ul className="text-[#848E9C] text-sm space-y-2">
              <li>• TPC menyediakan edukasi, bukan nasihat keuangan.</li>
              <li>• Tidak ada jaminan hasil atau profit.</li>
              <li>• Trading & aset digital memiliki risiko tinggi.</li>
              <li>• Gunakan manajemen risiko dan keputusan pribadi.</li>
            </ul>
            <p className="text-[#848E9C] text-xs mt-3">
              Jika ragu, baca halaman Transparansi dan Whitepaper.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom - Trust CTA */}
      <div className="bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-6 w-6 text-black" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Masih ada pertanyaan?</h2>
          <p className="text-[#848E9C] text-sm">
            Mulai dari Transparansi dan Anti-Scam untuk memahami cara kerja TPC.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/id/transparansi')}
            className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <Shield className="h-4 w-4" />
            Buka Transparansi
          </button>
          <button 
            onClick={() => navigate('/id/anti-scam')}
            className="flex-1 bg-[#12161C] border border-[#2B3139] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1E2329] transition-all flex items-center justify-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Baca Anti-Scam
          </button>
        </div>
      </div>
    </div>
  );
}
