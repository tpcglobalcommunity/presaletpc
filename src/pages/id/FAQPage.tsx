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
import { useNavigate, useParams } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

// i18n translations
const translations = {
  id: {
    pageTitle: 'FAQ - TPC Global',
    pageSubtitle: 'Pertanyaan yang sering ditanyakan tentang TPC',
    backToHome: 'Kembali ke Home',
    searchPlaceholder: 'Cari pertanyaan...',
    categories: 'Kategori',
    allCategories: 'Semua Kategori',
    aboutTPC: 'Tentang TPC',
    token: 'Token TPC',
    trading: 'Trading',
    security: 'Keamanan',
    member: 'Member',
    technical: 'Teknis',
    important: 'Penting',
    learnMore: 'Pelajari lebih lanjut',
    viewTransparency: 'Lihat Transparansi',
    joinCommunity: 'Bergabung dengan Komunitas',
    contactSupport: 'Hubungi Support',
    noResults: 'Tidak ada hasil yang ditemukan',
    tryDifferentKeywords: 'Coba kata kunci yang berbeda',
    educationFirst: 'Education-first',
    noProfitPromise: 'Tanpa janji profit',
    riskManagement: 'Fokus manajemen risiko',
    communitySupport: 'Dukungan komunitas'
  },
  en: {
    pageTitle: 'FAQ - TPC Global',
    pageSubtitle: 'Frequently asked questions about TPC',
    backToHome: 'Back to Home',
    searchPlaceholder: 'Search questions...',
    categories: 'Categories',
    allCategories: 'All Categories',
    aboutTPC: 'About TPC',
    token: 'TPC Token',
    trading: 'Trading',
    security: 'Security',
    member: 'Member',
    technical: 'Technical',
    important: 'Important',
    learnMore: 'Learn more',
    viewTransparency: 'View Transparency',
    joinCommunity: 'Join Community',
    contactSupport: 'Contact Support',
    noResults: 'No results found',
    tryDifferentKeywords: 'Try different keywords',
    educationFirst: 'Education-first',
    noProfitPromise: 'No profit promises',
    riskManagement: 'Risk management focus',
    communitySupport: 'Community support'
  }
};

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
    important: true,
    learnMore: {
      text: 'Pelajari lebih lanjut',
      link: '/id/edukasi'
    }
  },
  {
    id: 'tpc-2',
    question: 'Apakah TPC menjanjikan keuntungan?',
    answer: 'TIDAK. TPC tidak menjanjikan keuntungan apa pun. Ini adalah platform edukasi, bukan instrumen investasi. Trading memiliki risiko tinggi dan setiap keputusan trading sepenuhnya tanggung jawab masing-masing.',
    category: 'tentang-tpc',
    important: true
  },
  {
    id: 'tpc-3',
    question: 'Bagaimana cara bergabung dengan TPC?',
    answer: 'Anda dapat bergabung dengan mendaftar akun melalui login Google. Setelah login, Anda dapat mengakses materi edukasi dasar secara gratis dan upgrade ke member untuk fitur lanjutan.',
    category: 'tentang-tpc'
  },
  // Token TPC
  {
    id: 'token-1',
    question: 'Apa fungsi Token TPC?',
    answer: 'Token TPC adalah utility token untuk akses fitur dalam ekosistem TPC: materi edukasi lanjutan, tools trading, dan partisipasi komunitas. BUKAN instrumen investasi.',
    category: 'token',
    important: true
  },
  {
    id: 'token-2',
    question: 'Bagaimana cara mendapatkan Token TPC?',
    answer: 'Token TPC dapat dibeli melalui halaman pembelian yang tersedia setelah login. Pembayaran menggunakan transfer bank atau crypto sesuai instruksi.',
    category: 'token'
  },
  {
    id: 'token-3',
    question: 'Apakah Token TPC bisa diperjualbelikan?',
    answer: 'Token TPC adalah utility token, bukan sekuritas. Nilainya berasal dari akses fitur edukasi, bukan spekulasi harga. TPC tidak bertanggung jawab atas trading secondary market.',
    category: 'token',
    important: true
  },
  // Trading
  {
    id: 'trading-1',
    question: 'Apakah TPC memberikan sinyal trading?',
    answer: 'TIDAK. TPC fokus pada edukasi dan literasi risiko, bukan sinyal trading. Kami mengajarkan cara menganalisis, bukan memberikan rekomendasi buy/sell.',
    category: 'trading',
    important: true
  },
  {
    id: 'trading-2',
    question: 'Materi edukasi apa saja tersedia?',
    answer: 'TPC menyediakan materi dari dasar hingga lanjutan: fundamental trading, analisis teknikal, manajemen risiko, psikologi trading, dan strategi.',
    category: 'trading'
  },
  // Keamanan
  {
    id: 'security-1',
    question: 'Bagaimana TPC melindungi user dari scam?',
    answer: 'TPC menggunakan verifikasi manual, wallet publik transparan, dan tidak pernah menghubungi user lebih dulu. Semua proses melalui sistem resmi.',
    category: 'keamanan',
    important: true,
    learnMore: {
      text: 'Lihat Anti-Scam Guide',
      link: '/id/anti-scam'
    }
  },
  {
    id: 'security-2',
    question: 'Apakah data saya aman?',
    answer: 'TPC menggunakan enkripsi data, tidak menyimpan informasi sensitif seperti private key, dan mengikuti praktik keamanan standar industri.',
    category: 'keamanan'
  },
  // Member
  {
    id: 'member-1',
    question: 'Apa saja keuntungan member TPC?',
    answer: 'Member mendapatkan akses materi lanjutan, trading tools, community support, dan partisipasi dalam program edukasi berkelanjutan.',
    category: 'member'
  },
  {
    id: 'member-2',
    question: 'Bagaimana cara upgrade ke member?',
    answer: 'Login ke akun Anda, kunjungi halaman member, dan ikuti instruksi upgrade. Pembayaran dapat menggunakan berbagai metode yang tersedia.',
    category: 'member'
  }
];

const categories: Category[] = [
  { 
    id: 'all', 
    label: 'Semua Kategori', 
    icon: HelpCircle,
    description: 'Lihat semua pertanyaan'
  },
  { 
    id: 'tentang-tpc', 
    label: 'Tentang TPC', 
    icon: Target,
    description: 'Informasi dasar tentang TPC'
  },
  { 
    id: 'token', 
    label: 'Token TPC', 
    icon: Award,
    description: 'Token utility dan fungsi'
  },
  { 
    id: 'trading', 
    label: 'Trading', 
    icon: BookOpen,
    description: 'Edukasi dan materi trading'
  },
  { 
    id: 'keamanan', 
    label: 'Keamanan', 
    icon: Shield,
    description: 'Keamanan dan proteksi user'
  },
  { 
    id: 'member', 
    label: 'Member', 
    icon: Users,
    description: 'Fitur dan keuntungan member'
  }
];

export default function FAQPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const isEN = lang === 'en';

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
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
  }, [selectedCategory, searchQuery]);

  const activeCategoryData = categories.find(cat => cat.id === selectedCategory);

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
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span className="font-medium">{t.backToHome}</span>
              </button>

              <div className="hidden md:block h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/10 border border-purple-500/20">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-base md:text-lg truncate">{t.pageTitle}</h1>
                  <p className="text-[#848E9C] text-xs truncate">{t.pageSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium">
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
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#848E9C]" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-[#848E9C] focus:border-purple-500/50 focus:outline-none transition-colors text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">{t.categories}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-purple-500/50 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-[#848E9C] hover:text-white hover:border-purple-500/30'
                }`}
              >
                <category.icon className="h-5 w-5 mb-2 mx-auto" />
                <div className="text-sm font-medium">{category.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Category Description */}
        {activeCategoryData && activeCategoryData.id !== 'all' && (
          <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <activeCategoryData.icon className="h-5 w-5 text-purple-400" />
              <div>
                <h3 className="text-white font-medium">{activeCategoryData.label}</h3>
                <p className="text-[#848E9C] text-sm">{activeCategoryData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{t.noResults}</h3>
              <p className="text-[#848E9C]">{t.tryDifferentKeywords}</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className={`border rounded-xl transition-all duration-300 ${
                    faq.important
                      ? 'border-yellow-500/30 bg-yellow-500/5'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <div className="flex items-start gap-3 w-full">
                      {faq.important && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-base">{faq.question}</h4>
                        {faq.tags && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {faq.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-lg bg-white/10 text-xs text-[#848E9C]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="pl-8">
                      <p className="text-[#C9D1D9] leading-relaxed mb-4">{faq.answer}</p>
                      {faq.learnMore && (
                        <button
                          onClick={() => navigate(faq.learnMore.link)}
                          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {faq.learnMore.text}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <Shield className="h-8 w-8 text-purple-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">{t.viewTransparency}</h3>
            <p className="text-[#848E9C] text-sm mb-4">
              {isEN ? 'View our transparent operations and wallet addresses.' : 'Lihat operasi transparan dan alamat wallet kami.'}
            </p>
            <button
              onClick={() => navigate(`/${lang}/transparansi`)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {t.viewTransparency} →
            </button>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <Users className="h-8 w-8 text-blue-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">{t.joinCommunity}</h3>
            <p className="text-[#848E9C] text-sm mb-4">
              {isEN ? 'Join our community for discussions and support.' : 'Bergabung dengan komunitas untuk diskusi dan dukungan.'}
            </p>
            <button
              onClick={() => navigate(`/${lang}/login`)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t.joinCommunity} →
            </button>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <BookOpen className="h-8 w-8 text-green-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">{t.learnMore}</h3>
            <p className="text-[#848E9C] text-sm mb-4">
              {isEN ? 'Explore our comprehensive educational materials.' : 'Jelajahi materi edukasi komprehensif kami.'}
            </p>
            <button
              onClick={() => navigate(`/${lang}/edukasi`)}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              {t.learnMore} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
