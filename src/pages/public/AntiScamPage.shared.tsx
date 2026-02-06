import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Shield,
  X,
  CheckCircle,
  Eye,
  Lock,
  MessageSquare,
  Users,
  Globe,
  Key,
  Smartphone,
  Flag,
  AlertCircle,
  ShieldCheck,
  Ban,
  Copy,
  Target,
  UserX,
  Wallet,
  TrendingUp,
  Star,
  ExternalLink,
  LucideIcon
} from "lucide-react";
import TokenMintInfoCard from '@/components/trust/TokenMintInfoCard';

// Public i18n copy
const antiScamCopy = {
  id: {
    title: 'Anti-Scam Notice - TPC Global',
    description: 'Panduan lengkap untuk menghindari penipuan yang mengatasnamakan TPC. Pelajari cara mengenali aktivitas resmi TPC dan melindungi aset Anda.',
    pageTitle: 'Anti-Scam Notice',
    pageSubtitle: 'Panduan lengkap untuk menghindari penipuan yang mengatasnamakan TPC',
    backToHome: 'Kembali ke Home',
    officialChannels: 'Kanal Resmi TPC',
    websiteOfficial: 'Website Resmi',
    telegramOfficial: 'Telegram Komunitas Resmi',
    transparencyPage: 'Halaman Transparansi',
    notTpcActivities: 'Bukan Aktivitas TPC',
    scamMethods: 'Metode Penipuan Umum',
    howToVerify: 'Cara Verifikasi',
    whatToDo: 'Apa yang Harus Dilakukan',
    reportScam: 'Laporkan Penipuan',
    reportDesc: 'Jika Anda menemukan aktivitas mencurigakan, segera laporkan ke admin TPC.',
    reportButton: 'Laporkan ke Admin',
    copySuccess: 'Tersalin!',
    copy: 'Salin',
    official: 'Resmi',
    scam: 'Penipuan',
    warning: 'Peringatan',
    safe: 'Aman',
    neutral: 'Netral',
    antiScamNotice: '🚨 ANTI-SCAM NOTICE',
    protectYourself: 'Lindungi diri dari pihak yang mengatasnamakan TPC',
    warningTextBefore: 'TPC Global ',
    warningTextEmphasis: 'tidak pernah',
    warningTextAfter: ' meminta dana, data sensitif, atau menjanjikan keuntungan. Halaman ini membantu publik mengenali pola penipuan dan memverifikasi informasi resmi.',
    verifyFirst: 'Verifikasi dulu',
    officialOnly: 'Hanya resmi',
    contactingFirst: 'Menghubungi lebih dulu via WhatsApp / Telegram / DM',
    tpcOnlyAnnounces: 'TPC hanya mengumumkan melalui kanal resmi.',
    fakeAccounts: 'Akun palsu dengan nama & logo mirip TPC',
    checkUsername: 'Cek username, ejaan, dan akun terverifikasi.',
    fakeTelegramGroups: 'Grup Telegram tiruan',
    onlyJoinOfficial: 'Hanya bergabung melalui tautan resmi.',
    requestsForTransfers: 'Permintaan transfer ke wallet pribadi',
    onlyUseOfficialWallets: 'Hanya gunakan wallet resmi di halaman Transparansi.',
    checkOfficialChannels: 'Cek Kanal Resmi',
    startFromRightSources: 'Mulai dari sumber yang benar',
    officialTpcWebsite: 'Website resmi TPC',
    transparencyPageItem: 'Halaman Transparansi',
    officialCommunityChannels: 'Kanal komunitas resmi',
    checkWalletAddress: 'Cek Alamat Wallet',
    onlyTransferToOfficial: 'Transfer hanya ke alamat resmi',
    ignoreOtherAddresses: 'Abaikan alamat selain yang tertera',
    evenIfClaimingTpc: 'Walau mengatasnamakan TPC',
    verifyBeforeTransfer: 'Verifikasi dulu sebelum transfer',
    dontTrustDms: 'Jangan Percaya DM',
    tpcNeverContactsFirst: 'TPC tidak pernah menghubungi lebih dulu',
    allProcessesThroughOfficial: 'Semua proses melalui sistem resmi',
    ignoreInvestmentOffers: 'Abaikan penawaran investasi',
    reportIfSuspicious: 'Laporkan jika mencurigakan',
    sensitiveProcessesOfficial: 'Proses sensitif selalu via halaman resmi',
    transparentVerification: 'Verifikasi transparan, jelas, dan terstruktur.',
    alwaysDoYourOwnResearch: 'Selalu lakukan verifikasi mandiri (DYOR)',
    dontTrustWithoutProof: 'Jangan percaya info tanpa bukti dari kanal resmi.',
    dontBelieveProfitPromises: 'Jangan percaya janji keuntungan',
    tpcIsEducationPlatform: 'TPC adalah platform edukasi komunitas, bukan investasi.',
    disclaimer: 'TPC tidak bertanggung jawab atas kerugian akibat penipuan. Selalu verifikasi dan waspada terhadap penipuan.'
  },
  en: {
    title: 'Anti-Scam Notice - TPC Global',
    description: 'Complete guide to avoid scams impersonating TPC. Learn how to identify official TPC activities and protect your assets.',
    pageTitle: 'Anti-Scam Notice',
    pageSubtitle: 'Complete guide to avoid scams impersonating TPC',
    backToHome: 'Back to Home',
    officialChannels: 'Official TPC Channels',
    websiteOfficial: 'Official Website',
    telegramOfficial: 'Official Community Telegram',
    transparencyPage: 'Transparency Page',
    notTpcActivities: 'Not TPC Activities',
    scamMethods: 'Common Scam Methods',
    howToVerify: 'How to Verify',
    whatToDo: 'What to Do',
    reportScam: 'Report Scam',
    reportDesc: 'If you find suspicious activity, immediately report it to TPC admin.',
    reportButton: 'Report to Admin',
    copySuccess: 'Copied!',
    copy: 'Copy',
    official: 'Official',
    scam: 'Scam',
    warning: 'Warning',
    safe: 'Safe',
    neutral: 'Neutral',
    antiScamNotice: '🚨 ANTI-SCAM NOTICE',
    protectYourself: 'Protect yourself from parties impersonating TPC',
    warningTextBefore: 'TPC Global ',
    warningTextEmphasis: 'never',
    warningTextAfter: ' asks for funds, sensitive data, or promises profits. This page helps the public recognize scam patterns and verify official information.',
    verifyFirst: 'Verify first',
    officialOnly: 'Official only',
    contactingFirst: 'Contacting first via WhatsApp / Telegram / DM',
    tpcOnlyAnnounces: 'TPC only announces through official channels.',
    fakeAccounts: 'Fake accounts with TPC-like names & logos',
    checkUsername: 'Check username, spelling, and verified accounts.',
    fakeTelegramGroups: 'Fake Telegram groups',
    onlyJoinOfficial: 'Only join through official links.',
    requestsForTransfers: 'Requests for transfers to personal wallets',
    onlyUseOfficialWallets: 'Only use official wallets listed on Transparency page.',
    checkOfficialChannels: 'Check Official Channels',
    startFromRightSources: 'Start from the right sources',
    officialTpcWebsite: 'Official TPC website',
    transparencyPageItem: 'Transparency page',
    officialCommunityChannels: 'Official community channels',
    checkWalletAddress: 'Check Wallet Address',
    onlyTransferToOfficial: 'Only transfer to official addresses',
    ignoreOtherAddresses: 'Ignore addresses other than listed',
    evenIfClaimingTpc: 'Even if claiming to be TPC',
    verifyBeforeTransfer: 'Verify before transfer',
    dontTrustDms: 'Don\'t Trust DMs',
    tpcNeverContactsFirst: 'TPC never contacts first',
    allProcessesThroughOfficial: 'All processes through official system',
    ignoreInvestmentOffers: 'Ignore investment offers',
    reportIfSuspicious: 'Report if suspicious',
    sensitiveProcessesOfficial: 'Sensitive processes always through official pages',
    transparentVerification: 'Transparent, clear, and structured verification.',
    alwaysDoYourOwnResearch: 'Always do your own research (DYOR)',
    dontTrustWithoutProof: 'Don\'t trust info without proof from official channels.',
    dontBelieveProfitPromises: 'Don\'t believe profit promises',
    tpcIsEducationPlatform: 'TPC is a community education platform, not investment.',
    disclaimer: 'TPC is not responsible for losses due to scams. Always verify and be wary of scams.'
  }
};

interface AntiScamPageSharedProps {
  lang: 'id' | 'en';
}

export default function AntiScamPageShared({ lang }: AntiScamPageSharedProps) {
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = useState("");
  const c = antiScamCopy[lang];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  type InfoCard = {
    icon: LucideIcon;
    title: string;
    description: string;
    tone?: "safe" | "warning" | "danger" | "neutral";
    items?: string[];
  };

  const officialChannels: InfoCard[] = [
    {
      icon: Globe,
      title: c.websiteOfficial,
      description: "https://tpcglobal.io",
      tone: "safe",
    },
    {
      icon: MessageSquare,
      title: c.telegramOfficial,
      description: "Join only through official links",
      tone: "safe",
    },
    {
      icon: Shield,
      title: c.transparencyPage,
      description: "Public wallet addresses & verification",
      tone: "safe",
    },
    {
      icon: Smartphone,
      title: c.contactingFirst,
      description: c.tpcOnlyAnnounces,
      tone: "danger",
    },
  ];

  const scamMethods: InfoCard[] = [
    {
      icon: UserX,
      title: c.fakeAccounts,
      description: c.checkUsername,
      tone: "warning",
    },
    {
      icon: Users,
      title: c.fakeTelegramGroups,
      description: c.onlyJoinOfficial,
      tone: "warning",
    },
    {
      icon: Lock,
      title: c.requestsForTransfers,
      description: c.onlyUseOfficialWallets,
      tone: "warning",
    },
    {
      icon: MessageSquare,
      title: c.requestsForTransfers,
      description: c.onlyUseOfficialWallets,
      tone: "warning",
    },
  ];

  const verificationSteps = [
    {
      step: 1,
      icon: Globe,
      title: c.checkOfficialChannels,
      description: c.startFromRightSources,
      items: [c.officialTpcWebsite, c.transparencyPageItem, c.officialCommunityChannels],
    },
    {
      step: 2,
      icon: Wallet,
      title: c.checkWalletAddress,
      description: c.onlyTransferToOfficial,
      items: [c.ignoreOtherAddresses, c.evenIfClaimingTpc, c.verifyBeforeTransfer],
    },
    {
      step: 3,
      icon: MessageSquare,
      title: c.dontTrustDms,
      description: c.tpcNeverContactsFirst,
      items: [c.allProcessesThroughOfficial, c.ignoreInvestmentOffers, c.reportIfSuspicious],
    },
  ];

  const verificationFeatures: InfoCard[] = [
    {
      icon: Eye,
      title: c.sensitiveProcessesOfficial,
      description: c.transparentVerification,
      tone: "safe",
    },
  ];

  const userResponsibilities: InfoCard[] = [
    {
      icon: Target,
      title: c.alwaysDoYourOwnResearch,
      description: c.dontTrustWithoutProof,
      tone: "neutral",
    },
    {
      icon: X,
      title: c.dontBelieveProfitPromises,
      description: c.tpcIsEducationPlatform,
      tone: "neutral",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0A0D0F] to-[#0C0F12] text-white">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <button
            onClick={() => navigate(`/${lang}`)}
            className="flex items-center gap-2 text-[#848E9C] hover:text-white transition-colors mb-6 md:mb-8 group"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm md:text-base">{c.backToHome}</span>
          </button>

          <div className="relative text-center">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/30 via-[#F0B90B]/5 to-[#161B22]/30 rounded-2xl md:rounded-3xl -z-10 backdrop-blur-xl border border-[#F0B90B]/10"></div>
            
            {/* Enhanced icon container */}
            <div className="relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-8 rounded-2xl bg-gradient-to-br from-red-500/20 via-red-600/15 to-red-500/10 flex items-center justify-center border border-red-500/30 backdrop-blur-sm relative shadow-2xl shadow-red-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl blur-xl md:blur-2xl"></div>
                <div className="absolute inset-0 bg-red-500/10 rounded-2xl animate-pulse"></div>
                <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-red-400 relative z-10 drop-shadow-lg" />
              </div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-400 mb-2 md:mb-4 tracking-tight leading-tight">
                {c.antiScamNotice}
              </h1>
              <div className="h-1 w-20 md:w-32 mx-auto bg-gradient-to-r from-red-500/50 to-red-600/50 rounded-full mb-4 md:mb-6"></div>
              <p className="text-lg md:text-xl lg:text-2xl text-red-400 font-semibold mb-3 md:mb-4 leading-relaxed">{c.protectYourself}</p>
            </div>
            
            <div className="relative z-10 mt-6 md:mt-8 max-w-3xl md:max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-red-600/5 to-red-500/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-red-500/20"></div>
                <div className="relative bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-red-500/30 shadow-2xl shadow-red-500/10">
                  <div className="flex items-center gap-3 md:gap-4 mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg md:rounded-xl flex items-center justify-center border border-red-500/30">
                        <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-400" />
                      </div>
                      <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-lg"></div>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-red-400">{c.warning}</h2>
                  </div>
                  <p className="text-sm md:text-base text-[#C9D1D9]/90 leading-relaxed">
                    <span className="text-white font-semibold">{c.warningTextBefore}</span>
                    <span className="text-red-400 font-bold">{c.warningTextEmphasis}</span>
                    <span className="text-white">{c.warningTextAfter}</span>
                  </p>

                  {/* Official links */}
                  <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-3 md:gap-4">
                    <a
                      href="https://tpcglobal.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg md:rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Globe className="h-4 w-4 md:h-5 md:w-5" />
                      {c.websiteOfficial}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={`/${lang}/anti-scam`}
                      className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg md:rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Shield className="h-4 w-4 md:h-5 md:w-5" />
                      {c.transparencyPage}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Channels */}
        <section className="mb-8 md:mb-12">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600 uppercase tracking-wider mb-2">{c.officialChannels}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{c.officialChannels}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {officialChannels.map((channel, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-emerald-500/40 transition-all duration-500"></div>
                
                {/* Main card */}
                <div className={`relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-emerald-500/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/10 ${
                  channel.tone === "safe"
                    ? "border-emerald-500/30"
                    : channel.tone === "danger"
                    ? "border-red-500/30"
                    : "border-[#30363D]/50"
                }`}>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl ${
                        channel.tone === "safe"
                          ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                          : channel.tone === "danger"
                          ? "bg-red-500/20 text-red-500 border-red-500/30"
                          : "bg-[#30363D] text-[#848E9C] border-[#30363D]/30"
                      } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <channel.icon className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg blur-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{channel.title}</h3>
                      <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">{channel.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Not TPC Activities */}
        <section className="mb-8 md:mb-12">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 uppercase tracking-wider mb-2">{c.notTpcActivities}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{c.notTpcActivities}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {scamMethods.map((method, index) => (
              <div key={index} className="relative group">
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-yellow-500/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-yellow-500/20"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-yellow-500/30 shadow-lg group-hover:shadow-2xl group-hover:shadow-yellow-500/10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <method.icon className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-lg blur-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{method.title}</h3>
                      <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">{method.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Verify */}
        <section className="mb-8 md:mb-12">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 uppercase tracking-wider mb-2">{c.howToVerify}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{c.howToVerify}</h2>
          </div>
          <div className="space-y-4 md:space-y-6">
            {verificationSteps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-blue-500/40 transition-all duration-500"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-blue-500/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/10 flex gap-4 md:gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 shadow-lg">
                      <span className="text-blue-400 font-black text-lg md:text-xl font-bold">{step.step}</span>
                    </div>
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-[#C9D1D9]/90 text-sm md:text-base mb-3 leading-relaxed">{step.description}</p>
                    {step.items && (
                      <ul className="space-y-2 md:space-y-3">
                        {step.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center gap-2 md:gap-3 text-[#C9D1D9]/90 text-sm md:text-base">
                            <div className="relative">
                              <div className="w-6 h-6 md:w-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-emerald-400" />
                              </div>
                              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg"></div>
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification Features */}
        <section className="mb-8 md:mb-12">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600 uppercase tracking-wider mb-2">Verification Features</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Verification Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {verificationFeatures.map((feature, index) => (
              <div key={index} className="relative group">
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-emerald-500/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-emerald-500/20"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-emerald-500/30 shadow-lg group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <feature.icon className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="mb-8 md:mb-12">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D56B] uppercase tracking-wider mb-2">{c.whatToDo}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{c.whatToDo}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {userResponsibilities.map((responsibility, index) => (
              <div key={index} className="relative group">
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-[#30363D]/30 group-hover:border-[#F0B90B]/40 transition-all duration-500"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-[#1C2128]/60 to-[#161B22]/60 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-[#30363D]/50 group-hover:border-[#F0B90B]/50 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#F0B90B]/10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-[#30363D]/20 text-[#848E9C] border border-[#30363D]/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <responsibility.icon className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <div className="absolute inset-0 bg-[#30363D]/20 rounded-lg blur-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{responsibility.title}</h3>
                      <p className="text-[#C9D1D9]/90 text-sm md:text-base leading-relaxed">{responsibility.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report Scam */}
        <section className="mb-8 md:mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-red-600/5 to-red-500/10 rounded-xl md:rounded-2xl -z-10 backdrop-blur-xl border border-red-500/20"></div>
            <div className="relative bg-gradient-to-br from-[#1C2128]/80 to-[#161B22]/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-red-500/30 shadow-2xl shadow-red-500/10">
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg md:rounded-xl flex items-center justify-center border border-red-500/30">
                    <Flag className="h-5 w-5 md:h-6 md:w-6 text-red-400" />
                  </div>
                  <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-lg"></div>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-red-400">{c.reportScam}</h2>
              </div>
              <p className="text-[#C9D1D9]/90 text-sm md:text-base mb-4 md:mb-6 leading-relaxed">{c.reportDesc}</p>
              <button
                onClick={() => window.open(`https://t.me/tpcglobal`, '_blank')}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg md:rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {c.reportButton}
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[#30363D]/50">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-[#848E9C]/90">
            <span className="inline-flex items-center gap-1 md:gap-2 px-3 py-1 md:px-4 md:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg md:rounded-xl">
              <div className="relative">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-2 w-2 md:h-3 md:w-3 text-emerald-400" />
                </div>
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg"></div>
              </div>
              {c.verifyFirst}
            </span>
            <span className="text-[#30363D]">•</span>
            <span className="inline-flex items-center gap-1 md:gap-2 px-3 py-1 md:px-4 md:py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl">
              <div className="relative">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-2 w-2 md:h-3 md:w-3 text-blue-400" />
                </div>
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
              </div>
              {c.officialOnly}
            </span>
            <span className="text-[#30363D]">•</span>
            <span className="inline-flex items-center gap-1 md:gap-2 px-3 py-1 md:px-4 md:py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg md:rounded-xl">
              <div className="relative">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-2 w-2 md:h-3 md:w-3 text-yellow-400" />
                </div>
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-lg"></div>
              </div>
              {c.warning}
            </span>
          </div>
          <p className="text-center text-xs md:text-sm text-[#6B7280]/80 mt-4 md:mt-6 leading-relaxed px-4">
            {c.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
