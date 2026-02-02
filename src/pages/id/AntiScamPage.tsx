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
        label: "Website Resmi",
        value: "https://tpcglobal.io",
      },
      {
        label: "Telegram Komunitas Resmi",
        value: "https://t.me/tpcglobalcommunity",
      },
      {
        label: "Halaman Transparansi",
        value: "/id/transparansi",
      },
    ],
    []
  );

  const notTpcActivities: InfoCard[] = [
    {
      icon: TrendingUp,
      title: "Menjanjikan profit, ROI, atau keuntungan tetap",
      description: "TPC tidak pernah menjanjikan keuntungan apa pun.",
      tone: "danger",
    },
    {
      icon: MessageSquare,
      title: "Mengirim pesan pribadi (DM) menawarkan investasi",
      description: "TPC tidak pernah menghubungi pengguna lebih dulu.",
      tone: "danger",
    },
    {
      icon: Star,
      title: "Menyediakan sinyal trading berbayar",
      description: "TPC adalah platform edukasi, bukan sinyal trading.",
      tone: "danger",
    },
    {
      icon: Wallet,
      title: "Mengelola dana atau menerima titip dana",
      description: "TPC tidak mengelola dana pengguna.",
      tone: "danger",
    },
    {
      icon: Key,
      title: "Meminta private key, seed phrase, atau OTP",
      description: "TPC tidak pernah meminta data sensitif.",
      tone: "danger",
    },
    {
      icon: Smartphone,
      title: "Menghubungi lebih dulu via WhatsApp / Telegram / DM",
      description: "TPC hanya mengumumkan melalui kanal resmi.",
      tone: "danger",
    },
  ];

  const scamMethods: InfoCard[] = [
    {
      icon: UserX,
      title: "Akun palsu dengan nama & logo mirip TPC",
      description: "Cek username, ejaan, dan akun terverifikasi.",
      tone: "warning",
    },
    {
      icon: Users,
      title: "Grup Telegram tiruan",
      description: "Hanya bergabung melalui tautan resmi.",
      tone: "warning",
    },
    {
      icon: Globe,
      title: "Website / domain mirip (typo domain)",
      description: "Selalu cek URL sebelum login / transfer.",
      tone: "warning",
    },
    {
      icon: MessageSquare,
      title: "DM dengan ‘kesempatan terbatas’",
      description: "Penipuan sering pakai taktik urgensi & tekanan.",
      tone: "warning",
    },
    {
      icon: Wallet,
      title: "Permintaan transfer ke wallet pribadi",
      description: "Hanya gunakan wallet resmi di halaman Transparansi.",
      tone: "warning",
    },
  ];

  const verificationSteps: StepCard[] = [
    {
      step: 1,
      icon: Globe,
      title: "Cek Kanal Resmi",
      description: "Mulai dari sumber yang benar",
      items: ["Website resmi TPC", "Halaman Transparansi", "Kanal komunitas resmi"],
    },
    {
      step: 2,
      icon: Wallet,
      title: "Cek Alamat Wallet",
      description: "Transfer hanya ke alamat resmi",
      items: ["Abaikan alamat selain yang tertera", "Walau mengatasnamakan TPC", "Verifikasi dulu sebelum transfer"],
    },
    {
      step: 3,
      icon: MessageSquare,
      title: "Jangan Percaya DM",
      description: "TPC tidak pernah menghubungi lebih dulu",
      items: ["Semua proses melalui sistem resmi", "Abaikan penawaran investasi", "Laporkan jika mencurigakan"],
    },
  ];

  const securityPrinciples: InfoCard[] = [
    {
      icon: Lock,
      title: "Login menggunakan sistem aman",
      description: "Proteksi berlapis untuk akses akun & proses sensitif.",
      tone: "safe",
    },
    {
      icon: Shield,
      title: "Admin dikunci dengan UUID",
      description: "Akses admin berbasis whitelist UUID, tidak bisa ‘ngaku-ngaku’.",
      tone: "safe",
    },
    {
      icon: Eye,
      title: "Proses sensitif selalu via halaman resmi",
      description: "Verifikasi transparan, jelas, dan terstruktur.",
      tone: "safe",
    },
  ];

  const userResponsibilities: InfoCard[] = [
    {
      icon: Target,
      title: "Selalu lakukan verifikasi mandiri (DYOR)",
      description: "Jangan percaya info tanpa bukti dari kanal resmi.",
      tone: "neutral",
    },
    {
      icon: X,
      title: "Jangan percaya janji keuntungan",
      description: "TPC adalah platform edukasi komunitas, bukan investasi.",
      tone: "neutral",
    },
    {
      icon: Key,
      title: "Jangan bagikan data sensitif",
      description: "Seed phrase / OTP / private key tidak boleh dibagikan ke siapa pun.",
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
                onClick={() => navigate("/id")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Kembali</span>
              </button>

              <div className="hidden md:block h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-base md:text-lg truncate">Anti-Scam Notice</h1>
                  <p className="text-[#848E9C] text-xs truncate">Panduan resmi untuk menghindari penipuan</p>
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
