import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { handlePublicNavLogin } from '@/lib/authReturnTo';
import { Helmet } from 'react-helmet-async';
import { 
  GraduationCap, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle,
  XCircle,
  BookOpen,
  MessageCircle,
  FileText,
  Wallet,
  Upload,
  BadgeCheck,
  AlertTriangle,
  ChevronRight,
  Star,
  Crown,
  Zap,
  Award,
  Settings,
  Calendar,
  TrendingUp
} from 'lucide-react';

// Public i18n copy
const homeCopy = {
  id: {
    title: 'TPC Global - Ekosistem Edukasi Blockchain',
    description: 'TPC Global adalah ekosistem edukasi blockchain yang transparan, aman, dan terverifikasi. Bergabung dengan komunitas kami untuk pembelajaran crypto.',
    heroTitle: 'Trader Professional\nCommunity (TPC)',
    heroSubtitle: 'Platform edukasi trading terpercaya dengan sistem transparansi penuh',
    educationFirst: 'Education-first',
    communityDriven: 'Community-driven',
    buyTpc: 'Beli TPC',
    learnTpc: 'Pelajari TPC',
    whatIsTpc: 'Apa itu TPC?',
    whatIsTpcDesc: 'TPC Global adalah ekosistem edukasi blockchain yang transparan, aman, dan terverifikasi. Bergabung dengan komunitas kami untuk pembelajaran crypto.',
    noFinancialAdvice: 'No financial advice',
    noProfitPromise: 'No profit promise',
    educationCommunity: 'Education & community',
    important: 'Penting:',
    importantDesc: 'TPC tidak menjanjikan keuntungan apa pun. Partisipasi dalam ekosistem TPC mengandung risiko dan setiap keputusan sepenuhnya menjadi tanggung jawab masing-masing pengguna. Selalu lakukan riset mandiri (DYOR).',
    whyTpcDifferent: 'Kenapa TPC Berbeda?',
    transparency: 'Transparansi',
    transparencyDesc: 'Wallet publik & transaksi dapat diverifikasi',
    verification: 'Verifikasi Manual',
    verificationDesc: 'Anti-bot & anti-scam dengan review admin',
    trustQuote: '"TPC tidak menjanjikan keuntungan apa pun."',
    trustDesc: 'Kami berkomitmen pada transparansi penuh. Semua transaksi dapat diverifikasi dan wallet addresses kami bersifat publik.',
    viewTransparency: 'Lihat Transparansi',
    antiScamNotice: 'Anti-Scam Notice',
    communityEducation: 'Komunitas & Edukasi',
    trustTransparency: 'Trust & Transparansi',
    telegramCommunity: 'Komunitas Telegram',
    telegramDesc: 'Bergabung dengan komunitas trader',
    educationMaterial: 'Materi Edukasi',
    educationDesc: 'Pelajari dasar-dasar trading',
    faq: 'FAQ',
    faqDesc: 'Pertanyaan yang sering ditanyakan',
    readyToJoin: 'Siap Bergabung?',
    readyToJoinDesc: 'Bergabunglah dengan ribuan trader yang telah mempercayai TPC sebagai platform edukasi trading terpercaya.',
    loginToDashboard: 'Masuk ke Dashboard',
    loginRegister: 'Masuk / Daftar',
    footerDisclaimer: 'TPC (Trader Professional Community) adalah platform edukasi komunitas. Bukan penasihat keuangan dan tidak menjanjikan keuntungan apa pun. Setiap keputusan pengguna sepenuhnya menjadi tanggung jawab masing-masing.'
  },
  en: {
    title: 'TPC Global - Blockchain Education Ecosystem',
    description: 'TPC Global is a transparent, secure, and verified blockchain education ecosystem. Join our community for crypto learning.',
    heroTitle: 'Trader Professional\nCommunity (TPC)',
    heroSubtitle: 'Trusted trading education platform with full transparency system',
    educationFirst: 'Education-first',
    communityDriven: 'Community-driven',
    buyTpc: 'Buy TPC',
    learnTpc: 'Learn TPC',
    whatIsTpc: 'What is TPC?',
    whatIsTpcDesc: 'TPC Global is a transparent, secure, and verified blockchain education ecosystem. Join our community for crypto learning.',
    noFinancialAdvice: 'No financial advice',
    noProfitPromise: 'No profit promise',
    educationCommunity: 'Education & community',
    important: 'Important:',
    importantDesc: 'TPC does not promise any profits. Participation in the TPC ecosystem involves risk and each decision is solely the user\'s responsibility. Always do your own research (DYOR).',
    whyTpcDifferent: 'Why is TPC Different?',
    transparency: 'Transparency',
    transparencyDesc: 'Public wallets & transactions can be verified',
    verification: 'Manual Verification',
    verificationDesc: 'Anti-bot & anti-scam with admin review',
    trustQuote: '"TPC does not promise any profits."',
    trustDesc: 'We are committed to full transparency. All transactions can be verified and our wallet addresses are public.',
    viewTransparency: 'View Transparency',
    antiScamNotice: 'Anti-Scam Notice',
    communityEducation: 'Community & Education',
    trustTransparency: 'Trust & Transparency',
    telegramCommunity: 'Telegram Community',
    telegramDesc: 'Join trader community',
    educationMaterial: 'Education Materials',
    educationDesc: 'Learn trading basics',
    faq: 'FAQ',
    faqDesc: 'Frequently asked questions',
    readyToJoin: 'Ready to Join?',
    readyToJoinDesc: 'Join thousands of traders who have trusted TPC as a trusted trading education platform.',
    loginToDashboard: 'Go to Dashboard',
    loginRegister: 'Sign In / Register',
    footerDisclaimer: 'TPC (Trader Professional Community) is a community education platform. Not a financial advisor and does not promise any profits. All user decisions are entirely their own responsibility.'
  }
};

interface HomePageSharedProps {
  lang: 'id' | 'en';
}

export default function HomePageShared({ lang }: HomePageSharedProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const t = homeCopy[lang];

  return (
    <>
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.description} />
        <meta property="og:url" content={`https://tpcglobal.io/${lang}/`} />
        <meta property="og:image" content="https://tpcglobal.io/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.title} />
        <meta name="twitter:description" content={t.description} />
        <meta name="twitter:image" content="https://tpcglobal.io/og.png" />
      </Helmet>
      <div className="mobile-container pt-6 pb-28">
      {/* 1. HERO SECTION */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-6">
          <img 
            src="/tpc-logo.png" 
            alt="TPC Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-2">
          {t.heroSubtitle}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {t.educationFirst}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {t.communityDriven}</span>
        </div>
        <div className="flex gap-3 max-w-xs mx-auto">
          <button 
            onClick={() => navigate(`/${lang}/buytpc`)} 
            className="btn-gold flex-1 py-3 text-sm"
          >
            {t.buyTpc}
          </button>
          <button 
            onClick={() => navigate(`/${lang}/faq`)} 
            className="flex-1 py-3 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            {t.learnTpc}
          </button>
        </div>
      </div>

      {/* 2. APA ITU TPC? */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">{t.whatIsTpc}</h2>
        <div className="glass-card p-5 mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {t.whatIsTpcDesc}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><XCircle className="h-4 w-4 text-red-500 shrink-0" /><span className="text-muted-foreground">{t.noFinancialAdvice}</span></div>
            <div className="flex items-center gap-2 text-sm"><XCircle className="h-4 w-4 text-red-500 shrink-0" /><span className="text-muted-foreground">{t.noProfitPromise}</span></div>
            <div className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 shrink-0" /><span className="text-muted-foreground">{t.educationCommunity}</span></div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed"><strong className="text-yellow-500">{t.important}</strong> {t.importantDesc}</p>
          </div>
        </div>
      </div>

      {/* 3. KENAPA TPC BERBEDA? */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">{t.whyTpcDifferent}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3"><Shield className="h-5 w-5 text-blue-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">{t.transparency}</h3>
            <p className="text-xs text-muted-foreground">{t.transparencyDesc}</p>
          </div>
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3"><BadgeCheck className="h-5 w-5 text-purple-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">{t.verification}</h3>
            <p className="text-xs text-muted-foreground">{t.verificationDesc}</p>
          </div>
        </div>
      </div>

      {/* 4. TRUST & TRANSPARANSI */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">{t.trustTransparency}</h2>
        <div className="glass-card p-5">
          <blockquote className="text-sm text-primary font-medium mb-3">
            {t.trustQuote}
          </blockquote>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {t.trustDesc}
          </p>
          <button 
            onClick={() => navigate(`/${lang}/anti-scam`)} 
            className="w-full btn-gold py-3 text-sm"
          >
            {t.viewTransparency}
          </button>
        </div>
      </div>

      {/* 5. KOMUNITAS & EDUKASI */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">{t.communityEducation}</h2>
        <div className="space-y-3">
          <button onClick={() => navigate(`/${lang}/faq`)} className="w-full glass-card p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center"><FileText className="h-6 w-6 text-orange-500" /></div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm text-white">{t.faq}</h3>
              <p className="text-xs text-muted-foreground">{t.faqDesc}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 6. CTA AKHIR */}
      <div className="glass-card p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <h2 className="text-lg font-bold text-white mb-2">{t.readyToJoin}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t.readyToJoinDesc}</p>
        <div className="space-y-2">
          <button 
            onClick={() => navigate(`/${lang}/buytpc`)} 
            className="btn-gold w-full py-3"
          >
            {t.buyTpc}<ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => user ? navigate('/member/dashboard') : handlePublicNavLogin(navigate, lang)} className="w-full py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">{user ? t.loginToDashboard : t.loginRegister}</button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-10 pt-6 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">{t.footerDisclaimer}</p>
      </div>
      </div>
    </>
  );
}
