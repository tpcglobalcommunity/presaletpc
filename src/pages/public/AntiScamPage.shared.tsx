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
    icon: any;
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
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/${lang}`)}
            className="flex items-center gap-2 text-[#848E9C] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{c.backToHome}</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {c.antiScamNotice}
            </h1>
            <p className="mt-3 text-[#C9D1D9] text-base md:text-lg">
              {c.protectYourself}
            </p>
            <div className="mt-6 max-w-3xl mx-auto">
              <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-yellow-500">{c.warning}</h2>
                </div>
                <p className="text-sm md:text-base text-[#C9D1D9] leading-relaxed">
                  {c.warningTextBefore}
                  <span className="text-white font-semibold">{c.warningTextEmphasis}</span>
                  {c.warningTextAfter}
                </p>

                {/* Official links */}
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <a
                    href="https://tpcglobal.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    {c.websiteOfficial}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href={`/${lang}/anti-scam`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    {c.transparencyPage}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Channels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{c.officialChannels}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {officialChannels.map((channel, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  channel.tone === "safe"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : channel.tone === "danger"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-[#1C2128] border-[#30363D]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      channel.tone === "safe"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : channel.tone === "danger"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-[#30363D] text-[#848E9C]"
                    }`}
                  >
                    <channel.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">{channel.title}</h3>
                    <p className="text-[#C9D1D9] text-sm">{channel.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Not TPC Activities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{c.notTpcActivities}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {scamMethods.map((method, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-yellow-500/10 border-yellow-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-500">
                    <method.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">{method.title}</h3>
                    <p className="text-[#C9D1D9] text-sm">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Verify */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{c.howToVerify}</h2>
          <div className="space-y-6">
            {verificationSteps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-[#C9D1D9] text-sm mb-3">{step.description}</p>
                  {step.items && (
                    <ul className="space-y-1">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-[#848E9C] text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Verification Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {verificationFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-emerald-500/10 border-emerald-500/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-500">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-[#C9D1D9] text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{c.whatToDo}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {userResponsibilities.map((responsibility, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-[#1C2128] border-[#30363D]"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#30363D] text-[#848E9C]">
                    <responsibility.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">{responsibility.title}</h3>
                    <p className="text-[#C9D1D9] text-sm">{responsibility.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report Scam */}
        <section className="mb-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flag className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold text-red-500">{c.reportScam}</h2>
            </div>
            <p className="text-[#C9D1D9] mb-4">{c.reportDesc}</p>
            <button
              onClick={() => window.open(`https://t.me/tpcglobal`, '_blank')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              {c.reportButton}
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#30363D]">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#848E9C]">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> {c.verifyFirst}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> {c.officialOnly}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-yellow-400" /> {c.warning}
            </span>
          </div>
          <p className="text-center text-xs text-[#6B7280] mt-4">
            {c.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
