import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

// i18n translations
const translations = {
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
    step1: '1',
    step2: '2',
    step3: '3',
    step4: '4',
    step5: '5',
    step6: '6',
    step7: '7',
    step8: '8',
    step9: '9',
    step10: '10',
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
    step1: '1',
    step2: '2',
    step3: '3',
    step4: '4',
    step5: '5',
    step6: '6',
    step7: '7',
    step8: '8',
    step9: '9',
    step10: '10',
    disclaimer: 'TPC is not responsible for losses due to scams. Always verify and be wary of scams.'
  }
};

type IconType = any;

type InfoCard = {
  icon: IconType;
  title: string;
  description: string;
  tone?: "danger" | "warning" | "safe" | "neutral";
};

type StepCard = {
  step: number;
  icon: IconType;
  title: string;
  description: string;
  items: string[];
};

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function ToneStyles(tone: InfoCard["tone"]) {
  switch (tone) {
    case "danger":
      return {
        ring: "border-red-500/25 hover:border-red-500/45",
        iconBg: "bg-red-500/10",
        iconFg: "text-red-400",
        glow: "hover:shadow-red-500/10",
      };
    case "warning":
      return {
        ring: "border-orange-500/20 hover:border-orange-500/45",
        iconBg: "bg-orange-500/10",
        iconFg: "text-orange-400",
        glow: "hover:shadow-orange-500/10",
      };
    case "safe":
      return {
        ring: "border-emerald-500/20 hover:border-emerald-500/45",
        iconBg: "bg-emerald-500/10",
        iconFg: "text-emerald-400",
        glow: "hover:shadow-emerald-500/10",
      };
    default:
      return {
        ring: "border-[#2B3139] hover:border-[#3A424D]",
        iconBg: "bg-white/5",
        iconFg: "text-[#C9D1D9]",
        glow: "hover:shadow-white/5",
      };
  }
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#C9D1D9]">
      {children}
    </span>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  tone = "neutral",
}: {
  icon: IconType;
  title: string;
  subtitle?: string;
  tone?: "danger" | "warning" | "safe" | "neutral";
}) {
  const t = ToneStyles(tone);
  return (
    <div className="mb-5 md:mb-7">
      <div className="flex items-center gap-4">
        <div
          className={cx(
            "h-11 w-11 rounded-2xl border bg-gradient-to-br flex items-center justify-center",
            tone === "danger" && "from-red-500/20 to-red-500/5 border-red-500/25",
            tone === "warning" && "from-orange-500/20 to-orange-500/5 border-orange-500/20",
            tone === "safe" && "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
            tone === "neutral" && "from-white/10 to-white/5 border-white/10"
          )}
        >
          <Icon className={cx("h-5 w-5", t.iconFg)} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight break-words">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-[#848E9C] mt-1 break-words">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
    </div>
  );
}

function InfoGridCard({ item }: { item: InfoCard }) {
  const Icon = item.icon;
  const t = ToneStyles(item.tone);
  return (
    <div
      className={cx(
        "group relative overflow-hidden rounded-2xl border bg-[#14181D]/80 backdrop-blur",
        "p-5 md:p-6 transition-all duration-200",
        t.ring,
        "hover:-translate-y-0.5 hover:shadow-xl",
        t.glow
      )}
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          className={cx(
            "absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl",
            item.tone === "danger" && "bg-red-500/10",
            item.tone === "warning" && "bg-orange-500/10",
            item.tone === "safe" && "bg-emerald-500/10",
            (!item.tone || item.tone === "neutral") && "bg-white/5"
          )}
        />
      </div>

      <div className="relative flex items-start gap-4">
        <div className={cx("h-11 w-11 rounded-2xl border border-white/10 flex items-center justify-center shrink-0", t.iconBg)}>
          <Icon className={cx("h-5 w-5", t.iconFg)} />
        </div>

        <div className="min-w-0">
          <h4 className="text-white font-semibold text-sm md:text-base break-words">
            {item.title}
          </h4>
          <p className="text-[#848E9C] text-sm mt-2 leading-relaxed break-words">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepCardView({ step }: { step: StepCard }) {
  const Icon = step.icon;
  return (
    <div className="rounded-2xl border border-[#2B3139] bg-[#14181D]/80 backdrop-blur overflow-hidden hover:border-emerald-500/35 transition-colors">
      <div className="px-5 md:px-6 py-4 border-b border-[#2B3139] bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">
            {step.step}
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
            <Icon className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm md:text-base break-words">{step.title}</p>
            <p className="text-[#848E9C] text-xs md:text-sm mt-1 break-words">
              {step.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <ul className="space-y-2.5">
          {step.items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-[#C9D1D9]">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="break-words">{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AntiScamPage() {
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = useState("");

  // Get language from URL or default to 'id'
  const lang = window.location.pathname.startsWith('/en/') ? 'en' : 'id';
  const t = translations[lang];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 1600);
    } catch {
      // ignore
    }
  };

  const official = useMemo(
    () => [
      {
        label: t.websiteOfficial,
        value: "https://tpcglobal.io",
      },
      {
        label: t.telegramOfficial,
        value: "https://t.me/tpcglobalcommunity",
      },
      {
        label: t.transparencyPage,
        value: `/${lang}/transparansi`,
      },
    ],
    [lang, t]
  );

  const notTpcActivities: InfoCard[] = [
    {
      icon: TrendingUp,
      title: lang === 'en' ? "Promising profit, ROI, or fixed returns" : "Menjanjikan profit, ROI, atau keuntungan tetap",
      description: lang === 'en' ? "TPC never promises any profits." : "TPC tidak pernah menjanjikan keuntungan apa pun.",
      tone: "danger",
    },
    {
      icon: MessageSquare,
      title: lang === 'en' ? "Sending private messages (DM) offering investments" : "Mengirim pesan pribadi (DM) menawarkan investasi",
      description: lang === 'en' ? "TPC never contacts users first." : "TPC tidak pernah menghubungi pengguna lebih dulu.",
      tone: "danger",
    },
    {
      icon: Star,
      title: lang === 'en' ? "Providing paid trading signals" : "Menyediakan sinyal trading berbayar",
      description: lang === 'en' ? "TPC is an education platform, not trading signals." : "TPC adalah platform edukasi, bukan sinyal trading.",
      tone: "danger",
    },
    {
      icon: Wallet,
      title: lang === 'en' ? "Managing funds or accepting deposits" : "Mengelola dana atau menerima titip dana",
      description: lang === 'en' ? "TPC does not manage user funds." : "TPC tidak mengelola dana pengguna.",
      tone: "danger",
    },
    {
      icon: Key,
      title: lang === 'en' ? "Requesting private keys, seed phrases, or OTP" : "Meminta private key, seed phrase, atau OTP",
      description: lang === 'en' ? "TPC never requests sensitive data." : "TPC tidak pernah meminta data sensitif.",
      tone: "danger",
    },
    {
      icon: Smartphone,
      title: lang === 'en' ? "Contacting first via WhatsApp / Telegram / DM" : "Menghubungi lebih dulu via WhatsApp / Telegram / DM",
      description: lang === 'en' ? "TPC only announces through official channels." : "TPC hanya mengumumkan melalui kanal resmi.",
      tone: "danger",
    },
  ];

  const scamMethods: InfoCard[] = [
    {
      icon: UserX,
      title: lang === 'en' ? "Fake accounts with TPC-like names & logos" : "Akun palsu dengan nama & logo mirip TPC",
      description: lang === 'en' ? "Check username, spelling, and verified accounts." : "Cek username, ejaan, dan akun terverifikasi.",
      tone: "warning",
    },
    {
      icon: Users,
      title: lang === 'en' ? "Fake Telegram groups" : "Grup Telegram tiruan",
      description: lang === 'en' ? "Only join through official links." : "Hanya bergabung melalui tautan resmi.",
      tone: "warning",
    },
    {
      icon: Globe,
      title: lang === 'en' ? "Similar websites / domains (typo domains)" : "Website / domain mirip (typo domain)",
      description: lang === 'en' ? "Always check URL before login / transfer." : "Selalu cek URL sebelum login / transfer.",
      tone: "warning",
    },
    {
      icon: MessageSquare,
      title: lang === 'en' ? "Requests for transfers to personal wallets" : "Permintaan transfer ke wallet pribadi",
      description: lang === 'en' ? "Only use official wallets listed on Transparency page." : "Hanya gunakan wallet resmi di halaman Transparansi.",
      tone: "warning",
    },
    {
      icon: Wallet,
      title: lang === 'en' ? "Requests for transfers to personal wallets" : "Permintaan transfer ke wallet pribadi",
      description: lang === 'en' ? "Only use official wallets listed on Transparency page." : "Hanya gunakan wallet resmi di halaman Transparansi.",
      tone: "warning",
    },
  ];

  const verificationSteps: StepCard[] = [
    {
      step: 1,
      icon: Globe,
      title: lang === 'en' ? "Check Official Channels" : "Cek Kanal Resmi",
      description: lang === 'en' ? "Start from the right sources" : "Mulai dari sumber yang benar",
      items: lang === 'en' ? ["Official TPC website", "Transparency page", "Official community channels"] : ["Website resmi TPC", "Halaman Transparansi", "Kanal komunitas resmi"],
    },
    {
      step: 2,
      icon: Wallet,
      title: lang === 'en' ? "Check Wallet Address" : "Cek Alamat Wallet",
      description: lang === 'en' ? "Only transfer to official addresses" : "Transfer hanya ke alamat resmi",
      items: lang === 'en' ? ["Ignore addresses other than listed", "Even if claiming to be TPC", "Verify before transfer"] : ["Abaikan alamat selain yang tertera", "Walau mengatasnamakan TPC", "Verifikasi dulu sebelum transfer"],
    },
    {
      step: 3,
      icon: MessageSquare,
      title: lang === 'en' ? "Don't Trust DMs" : "Jangan Percaya DM",
      description: lang === 'en' ? "TPC never contacts first" : "TPC tidak pernah menghubungi lebih dulu",
      items: lang === 'en' ? ["All processes through official system", "Ignore investment offers", "Report if suspicious"] : ["Semua proses melalui sistem resmi", "Abaikan penawaran investasi", "Laporkan jika mencurigakan"],
    },
  ];

  const securityPrinciples: InfoCard[] = [
    {
      icon: Lock,
      title: lang === 'en' ? "Secure login system" : "Login menggunakan sistem aman",
      description: lang === 'en' ? "Multi-layer protection for account access & sensitive processes." : "Proteksi berlapis untuk akses akun & proses sensitif.",
      tone: "safe",
    },
    {
      icon: Shield,
      title: lang === 'en' ? "Admin locked with UUID" : "Admin dikunci dengan UUID",
      description: lang === 'en' ? "Admin access based on UUID whitelist, cannot impersonate." : "Akses admin berbasis whitelist UUID, tidak bisa 'ngaku-ngaku'.",
      tone: "safe",
    },
    {
      icon: Eye,
      title: lang === 'en' ? "Sensitive processes always through official pages" : "Proses sensitif selalu via halaman resmi",
      description: lang === 'en' ? "Transparent, clear, and structured verification." : "Verifikasi transparan, jelas, dan terstruktur.",
      tone: "safe",
    },
  ];

  const userResponsibilities: InfoCard[] = [
    {
      icon: Target,
      title: lang === 'en' ? "Always do your own research (DYOR)" : "Selalu lakukan verifikasi mandiri (DYOR)",
      description: lang === 'en' ? "Don't trust info without proof from official channels." : "Jangan percaya info tanpa bukti dari kanal resmi.",
      tone: "neutral",
    },
    {
      icon: X,
      title: lang === 'en' ? "Don't believe profit promises" : "Jangan percaya janji keuntungan",
      description: lang === 'en' ? "TPC is a community education platform, not investment." : "TPC adalah platform edukasi komunitas, bukan investasi.",
      tone: "neutral",
    },
    {
      icon: Key,
      title: lang === 'en' ? "Don't share sensitive data" : "Jangan bagikan data sensitif",
      description: lang === 'en' ? "Seed phrase / OTP / private key should never be shared with anyone." : "Seed phrase / OTP / private key tidak boleh dibagikan ke siapa pun.",
      tone: "neutral",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_50%_-100px,rgba(240,185,11,0.08),transparent),linear-gradient(to_bottom,#0B0E11,black)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E11]/75 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/55">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate(`/${lang}`)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">{t.backToHome}</span>
              </button>

              <div className="hidden md:block h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-base md:text-lg truncate">{t.pageTitle}</h1>
                  <p className="text-[#848E9C] text-xs truncate">{t.pageSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Pill>Education-Only</Pill>
              <Pill>No Profit Guarantees</Pill>
              <Pill>Verify Before Transfer</Pill>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/15 via-red-500/5 to-orange-500/10 p-6 md:p-10">
          <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/10 border border-red-500/25">
              <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                🚨 ANTI-SCAM NOTICE
              </h2>
              <p className="mt-3 text-[#C9D1D9] text-base md:text-lg">
                Lindungi diri dari pihak yang mengatasnamakan TPC
              </p>

              <div className="mt-6 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0B0E11]/40 backdrop-blur p-5 md:p-6">
                <p className="text-sm md:text-base text-[#C9D1D9] leading-relaxed">
                  TPC Global <span className="text-white font-semibold">tidak pernah</span> meminta dana,
                  data sensitif, atau menjanjikan keuntungan. Halaman ini membantu publik mengenali
                  pola penipuan dan memverifikasi informasi resmi.
                </p>

                {/* Official links */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {official.map((o) => (
                    <div
                      key={o.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-[#848E9C]">{o.label}</p>
                          <p className="mt-1 text-sm text-white break-all">{o.value}</p>
                          {copiedText === o.value ? (
                            <p className="mt-2 text-xs text-emerald-400 inline-flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" /> Tersalin
                            </p>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => copyToClipboard(o.value)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
                            aria-label={`Copy ${o.label}`}
                          >
                            <Copy className="h-4 w-4 text-[#C9D1D9]" />
                          </button>
                          <button
                            onClick={() => {
                              // hanya untuk UX cepat: kalau value relative, navigasi internal
                              if (o.value.startsWith("/")) navigate(o.value);
                              else window.open(o.value, "_blank", "noopener,noreferrer");
                            }}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
                            aria-label={`Open ${o.label}`}
                          >
                            <ExternalLink className="h-4 w-4 text-[#C9D1D9]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#848E9C]">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Verifikasi dulu
                  </span>
                  <span className="h-3 w-px bg-white/10" />
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" /> Waspadai DM
                  </span>
                  <span className="h-3 w-px bg-white/10" />
                  <span className="inline-flex items-center gap-1">
                    <Ban className="h-4 w-4 text-red-400" /> Jangan transfer ke wallet pribadi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Not TPC */}
        <div className="mt-10">
          <SectionTitle
            icon={X}
            title="YANG BUKAN BAGIAN DARI TPC"
            subtitle="Jika ada pihak melakukan hal-hal di bawah dan mengatasnamakan TPC, itu adalah penipuan."
            tone="danger"
          />

          <div className="rounded-3xl border border-[#2B3139] bg-[#0F1318]/70 backdrop-blur p-5 md:p-7">
            <p className="text-white/90 text-sm md:text-base">
              TPC <span className="font-bold text-white">TIDAK PERNAH</span> melakukan:
            </p>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              {notTpcActivities.map((activity, idx) => (
                <InfoGridCard key={idx} item={activity} />
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
              <p className="text-white font-semibold leading-relaxed">
                Kalau ada yang menjanjikan profit / meminta DM / meminta dana →{" "}
                <span className="text-red-200 font-extrabold">itu bukan TPC</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Scam Methods */}
        <div className="mt-10">
          <SectionTitle
            icon={AlertCircle}
            title="MODUS PENIPUAN YANG SERING TERJADI"
            subtitle="Kenali pola umum agar tidak jadi korban."
            tone="warning"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {scamMethods.map((method, idx) => (
              <InfoGridCard key={idx} item={method} />
            ))}
          </div>
        </div>

        {/* Verification Steps */}
        <div className="mt-10">
          <SectionTitle
            icon={CheckCircle}
            title="CARA MEMVERIFIKASI INFORMASI RESMI"
            subtitle="Ikuti langkah cepat ini sebelum ambil tindakan apa pun."
            tone="safe"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {verificationSteps.map((s, idx) => (
              <StepCardView key={idx} step={s} />
            ))}
          </div>
        </div>

        {/* Official Token Verification */}
        <div className="mt-10">
          <SectionTitle
            icon={Shield}
            title="VERIFIKASI TOKEN RESMI"
            subtitle="Hanya token dengan mint address berikut yang dianggap resmi."
            tone="safe"
          />
          <TokenMintInfoCard />
          <div className="mt-4 bg-[#1E2329]/50 border border-[#2B3139] rounded-xl p-4">
            <p className="text-[#848E9C] text-sm">
              <strong>Peringatan:</strong> Setiap token TPC yang tidak menggunakan mint address di atas adalah palsu dan tidak terafiliasi dengan TPC Global.
            </p>
          </div>
        </div>

        {/* Security Principles */}
        <div className="mt-10">
          <SectionTitle
            icon={ShieldCheck}
            title="PRINSIP KEAMANAN TPC"
            subtitle="Standar keamanan untuk meminimalkan risiko penipuan & penyalahgunaan."
            tone="safe"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {securityPrinciples.map((p, idx) => (
              <InfoGridCard key={idx} item={p} />
            ))}
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="mt-10">
          <SectionTitle
            icon={Users}
            title="TANGGUNG JAWAB PENGGUNA"
            subtitle="Keamanan akun adalah tanggung jawab masing-masing pengguna."
            tone="neutral"
          />

          <div className="rounded-3xl border border-[#2B3139] bg-[#0F1318]/70 backdrop-blur p-5 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {userResponsibilities.map((r, idx) => (
                <InfoGridCard key={idx} item={r} />
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
              <p className="text-white/90 font-medium">
                Simpan prinsip: <span className="text-white font-bold">verifikasi dulu</span>, baru bertindak.
              </p>
            </div>
          </div>
        </div>

        {/* Report Scam */}
        <div className="mt-10">
          <SectionTitle
            icon={Flag}
            title="LAPORKAN PENIPUAN"
            subtitle="Kalau menemukan indikasi penipuan, lakukan 3 langkah ini."
            tone="warning"
          />

          <div className="rounded-3xl border border-[#2B3139] bg-[#0F1318]/70 backdrop-blur p-5 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <X className="h-5 w-5 text-red-400 shrink-0" />
                  <p className="text-white text-sm font-medium">Abaikan pesan tersebut</p>
                </div>
                <p className="mt-2 text-xs text-[#848E9C]">
                  Jangan balas, jangan klik tautan mencurigakan.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Ban className="h-5 w-5 text-red-400 shrink-0" />
                  <p className="text-white text-sm font-medium">Jangan transfer apa pun</p>
                </div>
                <p className="mt-2 text-xs text-[#848E9C]">
                  Transfer hanya ke alamat resmi di halaman Transparansi.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Flag className="h-5 w-5 text-amber-400 shrink-0" />
                  <p className="text-white text-sm font-medium">Laporkan via kanal resmi</p>
                </div>
                <p className="mt-2 text-xs text-[#848E9C]">
                  Sertakan screenshot & username/link pelaku.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/15 to-amber-500/10 p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-extrabold tracking-tight">DISCLAIMER</h3>
              <p className="mt-2 text-sm text-[#C9D1D9] leading-relaxed">
                TPC Global adalah platform edukasi komunitas. Bukan penasihat keuangan dan tidak menjanjikan keuntungan apa pun.
                Keputusan finansial berada di bawah tanggung jawab masing-masing individu.
              </p>
            </div>
          </div>
        </div>

        {/* Remember */}
        <div className="mt-10 rounded-3xl border border-[#2B3139] bg-[#0F1318]/70 backdrop-blur p-5 md:p-7">
          <SectionTitle
            icon={AlertTriangle}
            title="INGAT PRINSIP INI"
            subtitle="Dua aturan cepat yang paling sering menyelamatkan orang."
            tone="danger"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 hover:bg-red-500/15 transition-colors">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-white font-semibold">
                  Kalau menjanjikan profit → <span className="text-red-200 font-extrabold">itu bukan TPC</span>.
                </p>
              </div>
              <p className="mt-2 text-xs text-[#C9D1D9]/80">
                Penipu suka janji manis, targetnya bikin kita lengah.
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 hover:bg-red-500/15 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-white font-semibold">
                  Kalau minta DM / dana → <span className="text-red-200 font-extrabold">itu bukan TPC</span>.
                </p>
              </div>
              <p className="mt-2 text-xs text-[#C9D1D9]/80">
                Proses resmi selalu lewat website & halaman terverifikasi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-10 md:h-14" />
      </div>
    </div>
  );
}
