import { useState, useRef } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Shield,
  FileText,
  CheckCircle,
  Target,
  Lightbulb,
  BarChart3,
  Brain,
  Lock,
  Users,
  AlertTriangle,
  ArrowRight,
  BookMarked,
  Zap,
  Wallet,
  Search
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// i18n translations
const translations = {
  id: {
    pageTitle: 'Edukasi - TPC Global',
    pageSubtitle: 'Materi pembelajaran trading terstruktur dari dasar hingga lanjutan',
    backToHome: 'Kembali ke Home',
    courses: 'Kursus',
    resources: 'Sumber Daya',
    beginner: 'Pemula',
    intermediate: 'Menengah',
    advanced: 'Lanjutan',
    ebook: 'Ebook',
    pelatihan: 'Pelatihan',
    resource: 'Resource',
    locked: 'Terkunci',
    startLearning: 'Mulai Belajar',
    comingSoon: 'Segera Hadir',
    duration: 'Durasi',
    level: 'Level',
    topics: 'Topik',
    progress: 'Progress',
    basicTrading: 'Trading Dasar',
    technicalAnalysis: 'Analisis Teknikal',
    riskManagement: 'Manajemen Risiko',
    tradingPsychology: 'Psikologi Trading',
    advancedStrategies: 'Strategi Lanjutan',
    portfolioManagement: 'Manajemen Portofolio',
    introduction: 'Pengenalan',
    marketStructure: 'Struktur Pasar',
    candlestickPatterns: 'Pola Candlestick',
    supportResistance: 'Support & Resistance',
    trendAnalysis: 'Analisis Trend',
    indicators: 'Indikator Teknikal',
    positionSizing: 'Position Sizing',
    stopLoss: 'Stop Loss',
    takeProfit: 'Take Profit',
    riskReward: 'Risk/Reward',
    emotionalControl: 'Kontrol Emosi',
    discipline: 'Disiplin',
    tradingPlan: 'Rencana Trading',
    swingTrading: 'Swing Trading',
    dayTrading: 'Day Trading',
    scalping: 'Scalping',
    diversification: 'Diversifikasi',
    rebalancing: 'Rebalancing',
    tradingJournal: 'Jurnal Trading',
    performanceAnalysis: 'Analisis Performa'
  },
  en: {
    pageTitle: 'Education - TPC Global',
    pageSubtitle: 'Structured trading learning materials from basic to advanced',
    backToHome: 'Back to Home',
    courses: 'Courses',
    resources: 'Resources',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    ebook: 'Ebook',
    pelatihan: 'Training',
    resource: 'Resource',
    locked: 'Locked',
    startLearning: 'Start Learning',
    comingSoon: 'Coming Soon',
    duration: 'Duration',
    level: 'Level',
    topics: 'Topics',
    progress: 'Progress',
    basicTrading: 'Basic Trading',
    technicalAnalysis: 'Technical Analysis',
    riskManagement: 'Risk Management',
    tradingPsychology: 'Trading Psychology',
    advancedStrategies: 'Advanced Strategies',
    portfolioManagement: 'Portfolio Management',
    introduction: 'Introduction',
    marketStructure: 'Market Structure',
    candlestickPatterns: 'Candlestick Patterns',
    supportResistance: 'Support & Resistance',
    trendAnalysis: 'Trend Analysis',
    indicators: 'Technical Indicators',
    positionSizing: 'Position Sizing',
    stopLoss: 'Stop Loss',
    takeProfit: 'Take Profit',
    riskReward: 'Risk/Reward',
    emotionalControl: 'Emotional Control',
    discipline: 'Discipline',
    tradingPlan: 'Trading Plan',
    swingTrading: 'Swing Trading',
    dayTrading: 'Day Trading',
    scalping: 'Scalping',
    diversification: 'Diversification',
    rebalancing: 'Rebalancing',
    tradingJournal: 'Trading Journal',
    performanceAnalysis: 'Performance Analysis'
  }
};

interface CourseContent {
  id: string;
  title: string;
  duration: string;
  level: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
  badgeColor: string;
  description: string;
  topics: string[];
  progress: number;
  locked: boolean;
  format: 'Ebook' | 'Pelatihan' | 'Resource';
}

interface ResourceContent {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
  badgeColor: string;
  description: string;
  action: string;
  locked: boolean;
  items: number;
  type: string;
  format: 'Resource';
}

export default function EdukasiPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'courses' | 'resources'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'Ebook' | 'Pelatihan' | 'Resource'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isEN = lang === 'en';

  // Sample course data
  const courses: CourseContent[] = [
    {
      id: 'basic-trading',
      title: isEN ? t.basicTrading : 'Trading Dasar',
      duration: '2 jam',
      level: isEN ? t.beginner : 'Pemula',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      badge: isEN ? t.beginner : 'Pemula',
      badgeColor: 'bg-blue-500/20 text-blue-500',
      description: isEN ? 'Introduction to trading fundamentals, market basics, and getting started.' : 'Pengenalan dasar-dasar trading, fundamental pasar, dan memulai.',
      topics: isEN ? [t.introduction, t.marketStructure] : ['Pengenalan', 'Struktur Pasar'],
      progress: 100,
      locked: false,
      format: 'Ebook'
    },
    {
      id: 'technical-analysis',
      title: isEN ? t.technicalAnalysis : 'Analisis Teknikal',
      duration: '3 jam',
      level: isEN ? t.intermediate : 'Menengah',
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      badge: isEN ? t.intermediate : 'Menengah',
      badgeColor: 'bg-purple-500/20 text-purple-500',
      description: isEN ? 'Chart patterns, technical indicators, support and resistance levels.' : 'Pola chart, indikator teknikal, level support dan resistance.',
      topics: isEN ? [t.candlestickPatterns, t.supportResistance, t.trendAnalysis] : ['Pola Candlestick', 'Support & Resistance', 'Analisis Trend'],
      progress: 75,
      locked: false,
      format: 'Ebook'
    },
    {
      id: 'risk-management',
      title: isEN ? t.riskManagement : 'Manajemen Risiko',
      duration: '2.5 jam',
      level: isEN ? t.intermediate : 'Menengah',
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      badge: isEN ? t.intermediate : 'Menengah',
      badgeColor: 'bg-green-500/20 text-green-500',
      description: isEN ? 'Position sizing, stop loss, take profit, and risk-reward ratios.' : 'Position sizing, stop loss, take profit, dan rasio risk-reward.',
      topics: isEN ? [t.positionSizing, t.stopLoss, t.takeProfit, t.riskReward] : ['Position Sizing', 'Stop Loss', 'Take Profit', 'Risk/Reward'],
      progress: 60,
      locked: false,
      format: 'Pelatihan'
    },
    {
      id: 'trading-psychology',
      title: isEN ? t.tradingPsychology : 'Psikologi Trading',
      duration: '2 jam',
      level: isEN ? t.advanced : 'Lanjutan',
      icon: Brain,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      badge: isEN ? t.advanced : 'Lanjutan',
      badgeColor: 'bg-orange-500/20 text-orange-500',
      description: isEN ? 'Emotional control, discipline, trading psychology, and mindset.' : 'Kontrol emosi, disiplin, psikologi trading, dan mindset.',
      topics: isEN ? [t.emotionalControl, t.discipline, t.tradingPlan] : ['Kontrol Emosi', 'Disiplin', 'Rencana Trading'],
      progress: 40,
      locked: false,
      format: 'Pelatihan'
    },
    {
      id: 'advanced-strategies',
      title: isEN ? t.advancedStrategies : 'Strategi Lanjutan',
      duration: '4 jam',
      level: isEN ? t.advanced : 'Lanjutan',
      icon: Target,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      badge: isEN ? t.advanced : 'Lanjutan',
      badgeColor: 'bg-red-500/20 text-red-500',
      description: isEN ? 'Swing trading, day trading, scalping, and portfolio management.' : 'Swing trading, day trading, scalping, dan manajemen portofolio.',
      topics: isEN ? [t.swingTrading, t.dayTrading, t.scalping, t.portfolioManagement] : ['Swing Trading', 'Day Trading', 'Scalping', 'Manajemen Portofolio'],
      progress: 0,
      locked: true,
      format: 'Pelatihan'
    }
  ];

  // Sample resource data
  const resources: ResourceContent[] = [
    {
      id: 'trading-journal',
      title: isEN ? t.tradingJournal : 'Jurnal Trading',
      icon: FileText,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      badge: 'Resource',
      badgeColor: 'bg-indigo-500/20 text-indigo-500',
      description: isEN ? 'Track your trades and analyze performance systematically.' : 'Lacak trading Anda dan analisis performa secara sistematis.',
      action: isEN ? t.startLearning : 'Mulai Belajar',
      locked: false,
      items: 12,
      type: 'Resource',
      format: 'Resource'
    },
    {
      id: 'risk-calculator',
      title: isEN ? t.performanceAnalysis : 'Analisis Performa',
      icon: BarChart3,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      badge: 'Resource',
      badgeColor: 'bg-teal-500/20 text-teal-500',
      description: isEN ? 'Calculate position sizes and risk-reward ratios automatically.' : 'Hitung ukuran posisi dan rasio risk-reward secara otomatis.',
      action: isEN ? t.startLearning : 'Mulai Belajar',
      locked: false,
      items: 8,
      type: 'Resource',
      format: 'Resource'
    },
    {
      id: 'market-screener',
      title: 'Market Scanner',
      icon: Search,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      badge: 'Resource',
      badgeColor: 'bg-pink-500/20 text-pink-500',
      description: isEN ? 'Screen markets for opportunities based on technical criteria.' : 'Pindai pasar untuk peluang berdasarkan kriteria teknikal.',
      action: isEN ? t.comingSoon : 'Segera Hadir',
      locked: true,
      items: 0,
      type: 'Resource',
      format: 'Resource'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesFormat = selectedFormat === 'all' || course.format === selectedFormat;
    return matchesSearch && matchesLevel && matchesFormat;
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || resource.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

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
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-500/20">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-base md:text-lg truncate">{t.pageTitle}</h1>
                  <p className="text-[#848E9C] text-xs truncate">{t.pageSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                {isEN ? 'Education-Only' : 'Edukasi-Saja'}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                {isEN ? 'No Profit Promises' : 'Tanpa Janji Profit'}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-medium">
                {isEN ? 'Risk Management Focus' : 'Fokus Manajemen Risiko'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
                <input
                  type="text"
                  placeholder={isEN ? 'Search courses and resources...' : 'Cari kursus dan sumber daya...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-[#848E9C] focus:border-blue-500/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              >
                <option value="all">{isEN ? 'All Levels' : 'Semua Level'}</option>
                <option value="beginner">{t.beginner}</option>
                <option value="intermediate">{t.intermediate}</option>
                <option value="advanced">{t.advanced}</option>
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
                className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              >
                <option value="all">{isEN ? 'All Formats' : 'Semua Format'}</option>
                <option value="Ebook">{t.ebook}</option>
                <option value="Pelatihan">{t.pelatihan}</option>
                <option value="Resource">{t.resource}</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'courses' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-[#848E9C] hover:text-white'
              }`}
            >
              {t.courses}
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'resources' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-[#848E9C] hover:text-white'
              }`}
            >
              {t.resources}
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollContainerRef}
          className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
        >
          {activeTab === 'courses' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`group relative rounded-2xl border transition-all duration-300 ${
                    course.locked 
                      ? 'border-white/5 bg-white/5 opacity-75' 
                      : 'border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${course.bgColor} flex items-center justify-center`}>
                        <course.icon className={`h-6 w-6 ${course.color}`} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${course.badgeColor}`}>
                        {course.badge}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-[#848E9C] text-sm leading-relaxed">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-[#848E9C]">
                        <span>{isEN ? 'Duration' : 'Durasi'}: {course.duration}</span>
                        <span>{t.level}: {course.level}</span>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-lg bg-white/5 text-xs text-[#848E9C]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#848E9C]">{t.progress}</span>
                          <span className="text-blue-400">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button
                        onClick={() => course.locked ? null : navigate(`/${lang}/member/courses/${course.id}`)}
                        disabled={course.locked}
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                          course.locked
                            ? 'bg-white/10 text-[#848E9C] cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {course.locked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            {t.locked}
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-2" />
                            {t.startLearning}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`group relative rounded-2xl border transition-all duration-300 ${
                    resource.locked 
                      ? 'border-white/5 bg-white/5 opacity-75' 
                      : 'border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${resource.bgColor} flex items-center justify-center`}>
                        <resource.icon className={`h-6 w-6 ${resource.color}`} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${resource.badgeColor}`}>
                        {resource.badge}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-[#848E9C] text-sm leading-relaxed">
                        {resource.description}
                      </p>

                      {/* Items */}
                      <div className="flex items-center justify-between text-xs text-[#848E9C]">
                        <span>{resource.items} {isEN ? 'items' : 'item'}</span>
                        <span>{resource.type}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button
                        onClick={() => resource.locked ? null : navigate(`/${lang}/member/resources/${resource.id}`)}
                        disabled={resource.locked}
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                          resource.locked
                            ? 'bg-white/10 text-[#848E9C] cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {resource.locked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            {t.locked}
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            {resource.action}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-white font-bold text-xl mb-4">
              {isEN ? 'Ready to advance your trading knowledge?' : 'Siap meningkatkan pengetahuan trading Anda?'}
            </h2>
            <p className="text-[#848E9C] text-sm mb-6 max-w-2xl mx-auto">
              {isEN 
                ? 'Join our member area to access advanced courses, trading tools, and community support.'
                : 'Bergabung dengan area member untuk mengakses kursus lanjutan, alat trading, dan dukungan komunitas.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/${lang}/login`)}
                className="px-8 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              >
                {isEN ? 'Login to Member Area' : 'Masuk ke Member Area'}
              </button>
              <button
                onClick={() => navigate(`/${lang}/tutorial/phantom-wallet`)}
                className="px-8 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                {isEN ? 'View Tutorial' : 'Lihat Tutorial'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
