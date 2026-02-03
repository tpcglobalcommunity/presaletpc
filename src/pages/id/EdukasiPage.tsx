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
  Wallet
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { lang = 'id' } = useParams();
  const [activeTab, setActiveTab] = useState('pemula');
  const materiRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);

  const isEN = lang === 'en';

  const t = {
    id: {
      title: 'Edukasi TPC',
      subtitle: 'Belajar trading secara terstruktur: dasar, manajemen risiko, mental, dan konsistensi proses.',
      tutorialPhantomWallet: {
        title: 'Tutorial Phantom Wallet',
        description: 'Panduan lengkap membuat wallet TPC via Phantom dengan aman'
      },
      tabs: {
        pemula: 'Pemula',
        menengah: 'Menengah',
        lanjutan: 'Lanjutan',
        resource: 'Resource'
      },
      hero: {
        educationFirst: 'Education-first',
        noProfitPromise: 'Tanpa janji profit',
        riskManagement: 'Fokus manajemen risiko',
        supportiveCommunity: 'Komunitas suportif',
        level: 'Level',
        materials: 'Materi',
        format: 'Format',
        seeMaterials: 'Lihat Materi',
        readDisclaimer: 'Baca Disclaimer'
      },
      card: {
        learn: 'Pelajari',
        loginToAccess: 'Masuk untuk akses',
        progress: 'Progress',
        whatWeLearn: 'Yang akan kita pelajari:'
      },
      howToLearn: {
        title: 'Cara Belajar di TPC',
        conceptExample: 'Konsep → Contoh → Latihan',
        conceptExampleDesc: 'Pembelajaran terstruktur dari teori hingga praktik',
        journalRisk: 'Jurnal & Evaluasi Risiko',
        journalRiskDesc: 'Dokumentasi proses dan analisis risiko',
        community: 'Komunitas & Sesi Tanya Jawab',
        communityDesc: 'Diskusi dan sharing pengalaman sesama trader'
      },
      disclaimer: {
        title: 'Disclaimer',
        points: [
          'TPC menyediakan edukasi, bukan nasihat keuangan.',
          'Trading & aset digital memiliki risiko tinggi.',
          'Tidak ada jaminan hasil; setiap orang berbeda.',
          'Gunakan manajemen risiko dan belajar bertahap.'
        ]
      },
      cta: {
        title: 'Siap belajar lebih terstruktur?',
        subtitle: 'Masuk untuk mengakses materi lanjutan, resource, dan fitur member.',
        loginToMember: 'Masuk ke Member Area',
        seeTransparency: 'Lihat Transparansi'
      }
    },
    en: {
      title: 'TPC Education',
      subtitle: 'Learn trading systematically: basics, risk management, mindset, and process consistency.',
      tutorialPhantomWallet: {
        title: 'Phantom Wallet Tutorial',
        description: 'Complete guide to creating a TPC wallet using Phantom securely'
      },
      tabs: {
        pemula: 'Beginner',
        menengah: 'Intermediate',
        lanjutan: 'Advanced',
        resource: 'Resource'
      },
      hero: {
        educationFirst: 'Education-first',
        noProfitPromise: 'No profit promises',
        riskManagement: 'Focus on risk management',
        supportiveCommunity: 'Supportive community',
        level: 'Level',
        materials: 'Materials',
        format: 'Format',
        seeMaterials: 'See Materials',
        readDisclaimer: 'Read Disclaimer'
      },
      card: {
        learn: 'Learn',
        loginToAccess: 'Login to access',
        progress: 'Progress',
        whatWeLearn: 'What we will learn:'
      },
      howToLearn: {
        title: 'How to Learn at TPC',
        conceptExample: 'Concept → Example → Practice',
        conceptExampleDesc: 'Structured learning from theory to practice',
        journalRisk: 'Journal & Risk Evaluation',
        journalRiskDesc: 'Process documentation and risk analysis',
        community: 'Community & Q&A Sessions',
        communityDesc: 'Discussion and experience sharing with fellow traders'
      },
      disclaimer: {
        title: 'Disclaimer',
        points: [
          'TPC provides education, not financial advice.',
          'Trading & digital assets have high risk.',
          'No guaranteed results; everyone is different.',
          'Use risk management and learn gradually.'
        ]
      },
      cta: {
        title: 'Ready to learn more systematically?',
        subtitle: 'Login to access advanced materials, resources, and member features.',
        loginToMember: 'Login to Member Area',
        seeTransparency: 'See Transparency'
      }
    }
  };

  const tabs = [
    { id: 'pemula', label: t[lang].tabs.pemula, icon: BookOpen },
    { id: 'menengah', label: t[lang].tabs.menengah, icon: Target },
    { id: 'lanjutan', label: t[lang].tabs.lanjutan, icon: Brain },
    { id: 'resource', label: t[lang].tabs.resource, icon: FileText }
  ];

  const courseContent: CourseContent[] = [
    {
      id: 'intro-trading',
      title: 'Pengenalan Trading',
      duration: '15 menit',
      level: 'Basic',
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      badge: 'DASAR',
      badgeColor: 'bg-blue-500',
      description: 'Memahami konsep dasar trading dan terminologi yang digunakan',
      topics: ['Apa itu trading?', 'Jenis-jenis aset', 'Risiko dan manajemen'],
      progress: 100,
      locked: false,
      format: 'Ebook'
    },
    {
      id: 'technical-analysis',
      title: 'Analisis Teknikal Dasar',
      duration: '20 menit',
      level: 'Basic',
      icon: BarChart3,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20',
      badge: 'CHART',
      badgeColor: 'bg-emerald-500',
      description: 'Belajar membaca chart dan menggunakan indikator dasar',
      topics: ['Support & Resistance', 'Trend Lines', 'Moving Averages'],
      progress: 100,
      locked: false,
      format: 'Pelatihan'
    },
    {
      id: 'risk-management',
      title: 'Manajemen Risiko',
      duration: '10 menit',
      level: 'Basic',
      icon: Shield,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20',
      badge: 'SAFETY',
      badgeColor: 'bg-amber-500',
      description: 'Strategi melindungi modal dari kerugian',
      topics: ['Stop Loss', 'Position Sizing', 'Risk/Reward Ratio'],
      progress: 100,
      locked: false,
      format: 'Ebook'
    },
    {
      id: 'fundamental-analysis',
      title: 'Analisis Fundamental',
      duration: '25 menit',
      level: 'Intermediate',
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
      badge: 'ECONOMY',
      badgeColor: 'bg-purple-500',
      description: 'Menganalisis faktor ekonomi yang mempengaruhi harga',
      topics: ['News Trading', 'Economic Calendar', 'Market Sentiment'],
      progress: 0,
      locked: true,
      format: 'Pelatihan'
    },
    {
      id: 'trading-psychology',
      title: 'Psikologi Trading',
      duration: '20 menit',
      level: 'Intermediate',
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
      badge: 'MINDSET',
      badgeColor: 'bg-orange-500',
      description: 'Mengendalikan emosi saat trading',
      topics: ['Fear & Greed', 'Discipline', 'Trading Plan'],
      progress: 0,
      locked: true,
      format: 'Ebook'
    },
    {
      id: 'advanced-technical',
      title: 'Advanced Technical Analysis',
      duration: '35 menit',
      level: 'Advanced',
      icon: BarChart3,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      badge: 'EXPERT',
      badgeColor: 'bg-red-500',
      description: 'Teknik analisis tingkat lanjut untuk trader profesional',
      topics: ['Fibonacci', 'Elliott Wave', 'Harmonic Patterns'],
      progress: 0,
      locked: true,
      format: 'Pelatihan'
    }
  ];

  const resourceContent: ResourceContent[] = [
    {
      id: 'tutorial-phantom-wallet',
      title: t[lang].tutorialPhantomWallet.title,
      icon: Wallet,
      color: 'text-[#F0B90B]',
      bgColor: 'bg-[#F0B90B]/10',
      borderColor: 'border-[#F0B90B]/20',
      badge: 'WALLET',
      badgeColor: 'bg-[#F0B90B]',
      description: t[lang].tutorialPhantomWallet.description,
      action: t[lang].card.learn,
      locked: false,
      items: 8,
      type: 'Tutorial',
      format: 'Resource'
    },
    {
      id: 'glossary',
      title: 'Trading Glossary',
      icon: BookMarked,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      badge: 'REFERENSI',
      badgeColor: 'bg-blue-500',
      description: 'Kamus lengkap istilah trading',
      action: 'Lihat',
      locked: false,
      items: 250,
      type: 'Dictionary',
      format: 'Resource'
    },
    {
      id: 'download-materials',
      title: 'Download Materials',
      icon: FileText,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20',
      badge: 'DOWNLOAD',
      badgeColor: 'bg-emerald-500',
      description: 'PDF, cheatsheets, dan templates',
      action: 'Download',
      locked: true,
      items: 120,
      type: 'Resources',
      format: 'Resource'
    },
    {
      id: 'trading-tools',
      title: 'Trading Tools',
      icon: Target,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20',
      badge: 'TOOLS',
      badgeColor: 'bg-amber-500',
      description: 'Kalkulator dan tools trading',
      action: 'Gunakan',
      locked: true,
      items: 15,
      type: 'Utilities',
      format: 'Resource'
    }
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'pemula':
        return courseContent.filter(c => c.level === 'Basic');
      case 'menengah':
        return courseContent.filter(c => c.level === 'Intermediate');
      case 'lanjutan':
        return courseContent.filter(c => c.level === 'Advanced');
      case 'resource':
        return resourceContent;
      default:
        return courseContent.filter(c => c.level === 'Basic');
    }
  };

  const currentContent = getContent();

  const scrollToMateri = () => {
    materiRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDisclaimer = () => {
    disclaimerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mobile-container pt-6 pb-28">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] text-xs font-medium rounded-full">
            Education-first
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Edukasi TPC
        </h1>
        
        <p className="text-[#848E9C] text-base leading-relaxed mb-6">
          Belajar trading secara terstruktur: dasar, manajemen risiko, mental, dan konsistensi proses.
        </p>
        
        {/* Trust Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="px-3 py-2 bg-[#1E2329] border border-[#2B3139] rounded-lg flex items-center gap-2">
            <Shield className="h-3 w-3 text-emerald-400" />
            <span className="text-xs text-white">Tanpa janji profit</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329] border border-[#2B3139] rounded-lg flex items-center gap-2">
            <Target className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-white">Fokus manajemen risiko</span>
          </div>
          <div className="px-3 py-2 bg-[#1E2329] border border-[#2B3139] rounded-lg flex items-center gap-2">
            <Users className="h-3 w-3 text-purple-400" />
            <span className="text-xs text-white">Komunitas suportif</span>
          </div>
        </div>
        
        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="text-lg font-bold text-[#F0B90B] mb-1">3</div>
            <div className="text-xs text-[#848E9C]">Level</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#F0B90B] mb-1">8+</div>
            <div className="text-xs text-[#848E9C]">Materi</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#F0B90B] mb-1">2</div>
            <div className="text-xs text-[#848E9C]">Format</div>
          </div>
        </div>
        
        {/* CTA Row */}
        <div className="flex gap-3">
          <button 
            onClick={scrollToMateri}
            className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            Lihat Materi
            <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            onClick={scrollToDisclaimer}
            className="flex-1 bg-[#1E2329] border border-[#2B3139] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#2B3139] transition-all"
          >
            Baca Disclaimer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 text-[#F0B90B]'
                : 'bg-[#1E2329] border border-[#2B3139] text-[#848E9C] hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div ref={materiRef} className="space-y-4 mb-12">
        {currentContent.map((content) => (
          <div key={content.id} className="bg-[#1E2329] border border-[#2B3139] rounded-xl overflow-hidden">
            {/* Card Header */}
            <div className="p-4 border-b border-[#2B3139]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${content.bgColor} flex items-center justify-center border ${content.borderColor}`}>
                    <content.icon className={`h-5 w-5 ${content.color}`} />
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${content.badgeColor}`}>
                      {content.badge}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#848E9C]">{content.level}</span>
                      <span className="text-xs text-[#848E9C]">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#848E9C]" />
                        <span className="text-xs text-[#848E9C]">{content.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {content.locked ? (
                    <Lock className="h-4 w-4 text-[#848E9C]" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-2">{content.title}</h3>
              <p className="text-[#848E9C] text-sm mb-4">{content.description}</p>
              
              {/* Progress Bar */}
              {content.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#848E9C]">Progress</span>
                    <span className="text-xs text-white font-medium">{content.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#2B3139] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        content.progress === 100 ? 'bg-emerald-500' : 'bg-[#F0B90B]'
                      }`}
                      style={{ width: `${content.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Topics */}
              {content.topics && (
                <div className="mb-4">
                  <div className="text-xs text-[#848E9C] mb-2">Yang akan kita pelajari:</div>
                  <div className="space-y-1">
                    {content.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-xs text-white">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Type and Items for Resources */}
              {content.type && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#848E9C]">{content.type}</span>
                  <span className="text-xs text-white font-medium">{content.items} items</span>
                </div>
              )}
              
              {/* Action Button */}
              <button 
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                  content.locked 
                    ? 'bg-[#2B3139] text-[#848E9C] border border-[#3A3F47]' 
                    : 'bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black'
                }`}
                onClick={() => {
                  if (content.locked) {
                    navigate(`/${lang}/login`);
                  } else if (content.id === 'tutorial-phantom-wallet') {
                    navigate(`/${lang}/tutorial/phantom-wallet`);
                  }
                }}
              >
                {content.locked ? (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>{t[lang].card.loginToAccess}</span>
                  </>
                ) : (
                  <>
                    <span>{t[lang].card.learn}</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cara Belajar Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Cara Belajar di TPC</h2>
        <div className="space-y-4">
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <Lightbulb className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Konsep → Contoh → Latihan</h3>
                <p className="text-[#848E9C] text-sm">Pembelajaran terstruktur dari teori hingga praktik</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Jurnal & Evaluasi Risiko</h3>
                <p className="text-[#848E9C] text-sm">Dokumentasi proses dan analisis risiko</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Komunitas & Sesi Tanya Jawab</h3>
                <p className="text-[#848E9C] text-sm">Diskusi dan sharing pengalaman sesama trader</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div ref={disclaimerRef} className="bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-xl p-4 mb-12">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold mb-2">Disclaimer</h3>
            <ul className="text-[#848E9C] text-sm space-y-1">
              <li>• TPC menyediakan edukasi, bukan nasihat keuangan.</li>
              <li>• Trading & aset digital memiliki risiko tinggi.</li>
              <li>• Tidak ada jaminan hasil; setiap orang berbeda.</li>
              <li>• Gunakan manajemen risiko dan belajar bertahap.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-2">Siap belajar lebih terstruktur?</h2>
        <p className="text-[#848E9C] text-sm mb-6">
          Masuk untuk mengakses materi lanjutan, resource, dan fitur member.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/id/login')}
            className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] text-black font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            Masuk ke Member Area
            <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            onClick={() => navigate('/id/transparansi')}
            className="flex-1 bg-[#1E2329] border border-[#2B3139] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#2B3139] transition-all"
          >
            Lihat Transparansi
          </button>
        </div>
      </div>
    </div>
  );
}
