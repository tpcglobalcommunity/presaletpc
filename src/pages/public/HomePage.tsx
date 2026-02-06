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
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { handlePublicNavLogin } from '@/lib/authReturnTo';
import { Helmet } from 'react-helmet-async';

// i18n translations
const translations = {
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
    whatIsTpcDesc: 'TPC adalah platform edukasi trading terpercaya yang telah membantu ribuan trader pemula memahami pasar dengan pendekatan transparansi dan pembelajaran bertahap. TPC token berfungsi sebagai utility dalam ekosistem komunitas, bukan sebagai instrumen investasi.',
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
    reward: 'Reward Kolaborasi',
    rewardDesc: 'Bonus untuk member yang berkolaborasi',
    curriculum: 'Kurikulum Terstruktur',
    curriculumDesc: 'Pembelajaran trading sistematis',
    howItWorks: 'Cara Kerja',
    step1Title: 'Beli TPC',
    step1Desc: 'Login dengan email dan pilih jumlah TPC yang ingin dibeli',
    step2Title: 'Transfer & Upload',
    step2Desc: 'Transfer sesuai nominal dan upload bukti pembayaran',
    step3Title: 'Verifikasi',
    step3Desc: 'Tim profesional kami memverifikasi setiap transaksi secara manual untuk memastikan keamanan sebelum TPC dikirim ke wallet pengguna.',
    trustTransparency: 'Transparansi & Kepercayaan',
    trustQuote: '"TPC tidak menjanjikan keuntungan apa pun."',
    trustDesc: 'Kami berkomitmen pada transparansi penuh. Semua transaksi dapat diverifikasi dan wallet addresses kami bersifat publik.',
    viewTransparency: 'Lihat Transparansi',
    antiScamNotice: 'Anti-Scam Notice',
    communityEducation: 'Komunitas & Edukasi',
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
    whatIsTpcDesc: 'TPC is a trusted trading education platform that has helped thousands of beginner traders understand the market with transparency and step-by-step learning. TPC tokens function as utility within the community ecosystem, not as investment instruments.',
    noFinancialAdvice: 'No financial advice',
    noProfitPromise: 'No profit promise',
    educationCommunity: 'Education & community',
    important: 'Important:',
    importantDesc: 'TPC does not promise any profits. Participation in the TPC ecosystem involves risks and all decisions are entirely the responsibility of each user. Always do your own research (DYOR).',
    whyTpcDifferent: 'Why TPC is Different?',
    transparency: 'Transparency',
    transparencyDesc: 'Public wallet & verifiable transactions',
    verification: 'Manual Verification',
    verificationDesc: 'Anti-bot & anti-scam with admin review',
    reward: 'Collaboration Reward',
    rewardDesc: 'Bonus for collaborating members',
    curriculum: 'Structured Curriculum',
    curriculumDesc: 'Systematic trading learning',
    howItWorks: 'How It Works',
    step1Title: 'Buy TPC',
    step1Desc: 'Login with email and choose the amount of TPC you want to buy',
    step2Title: 'Transfer & Upload',
    step2Desc: 'Transfer according to the amount and upload proof of payment',
    step3Title: 'Verification',
    step3Desc: 'Our professional team manually verifies each transaction to ensure security before TPC is sent to the user\'s wallet.',
    trustTransparency: 'Transparency & Trust',
    trustQuote: '"TPC does not promise any profits."',
    trustDesc: 'We are committed to full transparency. All transactions can be verified and our wallet addresses are public.',
    viewTransparency: 'View Transparency',
    antiScamNotice: 'Anti-Scam Notice',
    communityEducation: 'Community & Education',
    telegramCommunity: 'Telegram Community',
    telegramDesc: 'Join the trader community',
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

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang = 'en' } = useParams();

  // Get language from URL or default to 'en'
  const t = translations[lang];

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
            onClick={() => navigate(`/${lang}/edukasi`)} 
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
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3"><Users className="h-5 w-5 text-green-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">{t.reward}</h3>
            <p className="text-xs text-muted-foreground">{t.rewardDesc}</p>
          </div>
          <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3"><BookOpen className="h-5 w-5 text-orange-500" /></div>
            <h3 className="font-semibold text-sm text-white mb-1">{t.curriculum}</h3>
            <p className="text-xs text-muted-foreground">{t.curriculumDesc}</p>
          </div>
        </div>
      </div>

      {/* 4. CARA KERJA */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">{t.howItWorks}</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">1</div>
            <div className="flex-1 glass-card p-4">
              <div className="flex items-center gap-2 mb-1"><Wallet className="h-4 w-4 text-primary" /><span className="font-semibold text-sm text-white">{t.step1Title}</span></div>
              <p className="text-xs text-muted-foreground">{t.step1Desc}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">2</div>
            <div className="flex-1 glass-card p-4">
              <div className="flex items-center gap-2 mb-1"><Upload className="h-4 w-4 text-primary" /><span className="font-semibold text-sm text-white">{t.step2Title}</span></div>
              <p className="text-xs text-muted-foreground">{t.step2Desc}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">3</div>
            <div className="flex-1 glass-card p-4">
              <div className="flex items-center gap-2 mb-1"><BadgeCheck className="h-4 w-4 text-primary" /><span className="font-semibold text-sm text-white">{t.step3Title}</span></div>
              <p className="text-xs text-muted-foreground">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRUST & TRANSPARENCY */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">{t.trustTransparency}</h2>
        <div className="glass-card p-5 border-l-4 border-l-green-500">
          <p className="text-sm text-white font-medium mb-2">{t.trustQuote}</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.trustDesc}</p>
          <div className="space-y-2">
            <button onClick={() => navigate(`/${lang}/transparansi`)} className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span className="text-sm">{t.viewTransparency}</span></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => navigate(`/${lang}/anti-scam`)} className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-warning" /><span className="text-sm">{t.antiScamNotice}</span></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. KOMUNITAS & EDUKASI */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">{t.communityEducation}</h2>
        <div className="space-y-3">
          <a 
            href="https://t.me/tpcglobalcommunity" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full glass-card p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><MessageCircle className="h-6 w-6 text-blue-500" /></div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm text-white">{t.telegramCommunity}</h3>
              <p className="text-xs text-muted-foreground">{t.telegramDesc}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </a>
          <button onClick={() => navigate(`/${lang}/edukasi`)} className="w-full glass-card p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"><BookOpen className="h-6 w-6 text-purple-500" /></div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm text-white">{t.educationMaterial}</h3>
              <p className="text-xs text-muted-foreground">{t.educationDesc}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
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

      {/* 7. CTA AKHIR */}
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
