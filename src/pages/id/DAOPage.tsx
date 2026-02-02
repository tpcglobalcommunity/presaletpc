import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Shield,
  Clock,
  BarChart3,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Search,
  ArrowRight,
  Crown,
  Zap,
  Target,
  Wallet,
  Eye,
  Settings,
  RefreshCw,
} from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  type: "treasury" | "protocol" | "community" | "marketing";
  status: "active" | "completed" | "rejected" | "draft";
  votesFor: number;
  votesAgainst: number;
  totalVoters: number; // eligible voters / voting power snapshot count (mock)
  endDate: string;
  proposer: string;
  createdAt: string;
  executedAt?: string;
}

interface TreasuryItem {
  id: string;
  category: string;
  amount: string;
  description: string;
  status: "active" | "completed";
  date: string;
  transactionHash?: string;
}

interface GovernanceMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function formatShortAddress(addr: string) {
  if (!addr) return "-";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export default function DAOPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"proposals" | "treasury" | "governance" | "voting">(
    "proposals"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedText, setCopiedText] = useState("");

  // Mock data — nanti ganti ke backend
  const proposals: Proposal[] = [
    {
      id: "1",
      title: "Proposal #001: Re-alokasi Treasury untuk Kampanye Marketing",
      description:
        "Mengalokasikan 500K TPC dari treasury untuk kampanye marketing global yang bertujuan meningkatkan adopsi dan awareness TPC.",
      type: "treasury",
      status: "active",
      votesFor: 1247,
      votesAgainst: 89,
      totalVoters: 5000,
      endDate: "2026-02-15T23:59:59Z",
      proposer: "0x1234...5678",
      createdAt: "2026-02-01T10:00:00Z",
    },
    {
      id: "2",
      title: "Proposal #002: Upgrade Protokol ke Versi 2.0",
      description: "Upgrade sistem governance untuk meningkatkan efisiensi dan keamanan proses voting.",
      type: "protocol",
      status: "completed",
      votesFor: 3421,
      votesAgainst: 156,
      totalVoters: 5000,
      endDate: "2026-01-28T23:59:59Z",
      proposer: "0xabcd...efgh",
      createdAt: "2026-01-20T14:30:00Z",
      executedAt: "2026-01-29T10:15:00Z",
    },
    {
      id: "3",
      title: "Proposal #003: Perluasan Program Reward Komunitas",
      description:
        "Meningkatkan alokasi reward program dari 150M TPC menjadi 200M TPC untuk mendukung aktivitas komunitas.",
      type: "community",
      status: "active",
      votesFor: 892,
      votesAgainst: 234,
      totalVoters: 5000,
      endDate: "2026-02-20T23:59:59Z",
      proposer: "0xdef0...1234",
      createdAt: "2026-02-05T09:00:00Z",
    },
  ];

  const treasuryItems: TreasuryItem[] = [
    {
      id: "1",
      category: "Marketing",
      amount: "500,000 TPC",
      description: "Kampanye marketing global Q1",
      status: "active",
      date: "2026-02-01",
      transactionHash: "0xabc123...def456",
    },
    {
      id: "2",
      category: "Development",
      amount: "250,000 TPC",
      description: "Pengembangan upgrade governance v2.0",
      status: "completed",
      date: "2026-01-29",
      transactionHash: "0xdef456...ghi789",
    },
    {
      id: "3",
      category: "Community",
      amount: "200,000 TPC",
      description: "Perluasan program reward komunitas",
      status: "active",
      date: "2026-02-05",
    },
    {
      id: "4",
      category: "Operations",
      amount: "150,000 TPC",
      description: "Biaya operasional Q1",
      status: "active",
      date: "2026-02-01",
    },
  ];

  const governanceMetrics: GovernanceMetric[] = [
    { label: "Total Voting Power", value: "5,000 TPC", change: "+12.5%", trend: "up" },
    { label: "Proposal Aktif", value: "2", change: "+1", trend: "up" },
    { label: "Partisipasi", value: "68.2%", change: "+5.3%", trend: "up" },
    { label: "Saldo Treasury", value: "1.2B TPC", change: "+8.7%", trend: "up" },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 1600);
    } catch {
      // ignore
    }
  };

  const statusBadge = (status: Proposal["status"]) => {
    const base = "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold";
    switch (status) {
      case "active":
        return cx(base, "bg-emerald-500/15 text-emerald-300 border-emerald-500/25");
      case "completed":
        return cx(base, "bg-blue-500/15 text-blue-300 border-blue-500/25");
      case "rejected":
        return cx(base, "bg-red-500/15 text-red-300 border-red-500/25");
      case "draft":
      default:
        return cx(base, "bg-white/5 text-[#C9D1D9] border-white/10");
    }
  };

  const typeBadge = (type: Proposal["type"]) => {
    const base = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold";
    switch (type) {
      case "treasury":
        return cx(base, "bg-purple-500/15 text-purple-300 border-purple-500/25");
      case "protocol":
        return cx(base, "bg-blue-500/15 text-blue-300 border-blue-500/25");
      case "community":
        return cx(base, "bg-emerald-500/15 text-emerald-300 border-emerald-500/25");
      case "marketing":
        return cx(base, "bg-orange-500/15 text-orange-300 border-orange-500/25");
      default:
        return cx(base, "bg-white/5 text-[#C9D1D9] border-white/10");
    }
  };

  const filteredProposals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return proposals.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // voting math: support + participation
  const getSupportPct = (p: Proposal) => {
    const cast = p.votesFor + p.votesAgainst;
    if (cast <= 0) return 0;
    return clamp(Math.round((p.votesFor / cast) * 100));
  };

  const getParticipationPct = (p: Proposal) => {
    if (p.totalVoters <= 0) return 0;
    const cast = p.votesFor + p.votesAgainst;
    return clamp(Math.round((cast / p.totalVoters) * 100));
  };

  const getTimeRemaining = (p: Proposal) => {
    if (p.status !== "active") {
      if (p.status === "completed") return "Selesai";
      if (p.status === "rejected") return "Ditolak";
      return "Draft";
    }
    const end = new Date(p.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Berakhir";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} hari ${hours} jam`;
    if (hours > 0) return `${hours} jam ${minutes} menit`;
    return `${minutes} menit`;
  };

  const tabs = [
    { id: "proposals", label: "Proposal", icon: FileText },
    { id: "treasury", label: "Treasury", icon: Wallet },
    { id: "governance", label: "Aturan", icon: Shield },
    { id: "voting", label: "Voting Saya", icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_50%_-100px,rgba(240,185,11,0.10),transparent),linear-gradient(to_bottom,#0B0E11,black)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E11]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/55">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate("/id")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span className="font-medium">Kembali</span>
              </button>

              <div className="hidden md:block h-8 w-px bg-white/10" />

              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border border-[#F0B90B]/25">
                  <Users className="h-5 w-5 text-black" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-base md:text-lg truncate">TPC DAO</h1>
                  <p className="text-[#848E9C] text-xs truncate">Tata kelola komunitas (DAO-Lite)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[#C9D1D9] hover:text-white transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[#C9D1D9] hover:text-white transition-colors"
                title="Pengaturan"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-[#F0B90B]/20 bg-gradient-to-br from-[#F0B90B]/15 via-white/5 to-transparent p-6 md:p-10">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F0B90B]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative text-center">
            <div className="mx-auto h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-2xl shadow-[#F0B90B]/10 border border-[#F0B90B]/25">
              <Crown className="h-10 w-10 md:h-12 md:w-12 text-black" />
            </div>

            <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              TPC DAO
            </h2>
            <p className="mt-3 text-[#C9D1D9] text-base md:text-lg max-w-3xl mx-auto">
              Tempat komunitas ikut menentukan arah program edukasi, kegiatan, dan prioritas pengembangan secara transparan.
            </p>

            <div className="mt-5 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0B0E11]/35 backdrop-blur p-5 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-[#C9D1D9] leading-relaxed">
                  <span className="text-white font-semibold">Edukasi saja.</span> TPC tidak menjanjikan profit/ROI,
                  tidak mengelola dana pengguna, dan tidak pernah meminta seed phrase/OTP/private key.
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {governanceMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:bg-white/7 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[#848E9C] text-xs md:text-sm">{m.label}</p>
                    <div
                      className={cx(
                        "inline-flex items-center gap-1 text-xs font-semibold",
                        m.trend === "up" && "text-emerald-400",
                        m.trend === "down" && "text-red-400",
                        m.trend === "neutral" && "text-[#C9D1D9]"
                      )}
                    >
                      <TrendingUp className={cx("h-3 w-3", m.trend === "down" && "rotate-180")} />
                      <span>{m.change}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xl md:text-2xl font-extrabold text-white">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cx(
                "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold border transition-colors",
                activeTab === t.id
                  ? "bg-[#F0B90B]/15 text-[#F0B90B] border-[#F0B90B]/25"
                  : "bg-white/5 text-[#C9D1D9] border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              <t.icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* TAB: Proposals */}
        {activeTab === "proposals" && (
          <div className="mt-6">
            {/* Search & filter */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
                <input
                  type="text"
                  placeholder="Cari proposal…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-2.5 text-white placeholder-[#848E9C] outline-none focus:border-[#F0B90B]/40"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#F0B90B]/40"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="rejected">Ditolak</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filteredProposals.map((p) => {
                const cast = p.votesFor + p.votesAgainst;
                const supportPct = getSupportPct(p);
                const participationPct = getParticipationPct(p);

                return (
                  <div
                    key={p.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#14181D]/80 backdrop-blur p-6 hover:border-[#F0B90B]/25 hover:shadow-xl hover:shadow-[#F0B90B]/5 transition-all"
                  >
                    <div className="pointer-events-none absolute -top-24 -right-24 h-52 w-52 rounded-full bg-[#F0B90B]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* header */}
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-white font-extrabold text-base leading-snug line-clamp-2">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-[#848E9C] text-sm leading-relaxed line-clamp-3">
                          {p.description}
                        </p>
                      </div>
                      <div className={typeBadge(p.type)}>{p.type.toUpperCase()}</div>
                    </div>

                    {/* meta */}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className={statusBadge(p.status)}>
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          {p.status === "active"
                            ? "Aktif"
                            : p.status === "completed"
                            ? "Selesai"
                            : p.status === "rejected"
                            ? "Ditolak"
                            : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#848E9C]">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeRemaining(p)}</span>
                      </div>
                    </div>

                    {/* bars */}
                    <div className="mt-5 space-y-4">
                      {/* participation */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#848E9C]">Partisipasi</span>
                          <span className="text-white font-semibold">
                            {cast} / {p.totalVoters} ({participationPct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-[#F0B90B] to-[#F8D56B]"
                            style={{ width: `${participationPct}%` }}
                          />
                        </div>
                      </div>

                      {/* support */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#848E9C]">Dukungan (For vs Against)</span>
                          <span className="text-white font-semibold">{supportPct}% For</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            style={{ width: `${supportPct}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-xs">
                          <span className="text-emerald-400">{p.votesFor} For</span>
                          <span className="text-red-400">{p.votesAgainst} Against</span>
                        </div>
                      </div>
                    </div>

                    {/* proposer */}
                    <div className="mt-5 flex items-center justify-between text-xs">
                      <span className="text-[#848E9C]">Pengusul</span>
                      <span className="text-[#C9D1D9] font-mono">{formatShortAddress(p.proposer)}</span>
                    </div>

                    {/* actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-4 py-2.5 transition-colors disabled:opacity-50"
                        disabled={p.status !== "active"}
                        title={p.status !== "active" ? "Voting tidak tersedia" : "Vote For"}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Setuju</span>
                      </button>

                      <button
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2.5 transition-colors disabled:opacity-50"
                        disabled={p.status !== "active"}
                        title={p.status !== "active" ? "Voting tidak tersedia" : "Vote Against"}
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Tolak</span>
                      </button>

                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2.5 transition-colors"
                        title="Lihat detail"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Detail</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProposals.length === 0 && (
              <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-white font-semibold">Tidak ada proposal yang cocok.</p>
                <p className="text-[#848E9C] text-sm mt-2">Coba ubah kata kunci atau filter status.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Treasury */}
        {activeTab === "treasury" && (
          <div className="mt-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 mb-5">
              <h3 className="text-white font-extrabold text-lg mb-4">Ringkasan Treasury</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="rounded-2xl border border-white/10 bg-[#14181D]/60 p-4">
                  <p className="text-[#848E9C] text-sm">Total Saldo</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">1.2B TPC</p>
                  <p className="mt-1 text-emerald-400 text-xs font-semibold">+8.7% bulan ini</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#14181D]/60 p-4">
                  <p className="text-[#848E9C] text-sm">Terpakai</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">1.1B TPC</p>
                  <p className="mt-1 text-blue-400 text-xs font-semibold">91.7% teralokasi</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#14181D]/60 p-4">
                  <p className="text-[#848E9C] text-sm">Tersedia</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">100M TPC</p>
                  <p className="mt-1 text-amber-400 text-xs font-semibold">8.3% tersedia</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-white font-extrabold text-lg">Transaksi Terbaru</h3>

                {copiedText ? (
                  <div className="text-xs text-emerald-400 inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Tersalin</span>
                  </div>
                ) : null}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-[#848E9C] text-sm font-semibold py-3 px-4">Tanggal</th>
                      <th className="text-left text-[#848E9C] text-sm font-semibold py-3 px-4">Kategori</th>
                      <th className="text-left text-[#848E9C] text-sm font-semibold py-3 px-4">Jumlah</th>
                      <th className="text-left text-[#848E9C] text-sm font-semibold py-3 px-4">Keterangan</th>
                      <th className="text-left text-[#848E9C] text-sm font-semibold py-3 px-4">Status</th>
                      <th className="text-left text-[#848E9C] text-sm font-semibold py-3 px-4">Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treasuryItems.map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-[#C9D1D9] text-sm">{item.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-white">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-extrabold">{item.amount}</td>
                        <td className="py-3 px-4 text-[#848E9C] text-sm">{item.description}</td>
                        <td className="py-3 px-4">
                          <span
                            className={cx(
                              "px-2.5 py-1 rounded-full text-xs font-semibold border",
                              item.status === "completed"
                                ? "bg-blue-500/15 text-blue-300 border-blue-500/25"
                                : "bg-amber-500/15 text-amber-300 border-amber-500/25"
                            )}
                          >
                            {item.status === "completed" ? "Selesai" : "Berjalan"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.transactionHash ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#C9D1D9] text-xs font-mono">
                                {formatShortAddress(item.transactionHash)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(item.transactionHash!)}
                                className="text-[#F0B90B] hover:text-[#F8D56B] transition-colors"
                                title="Salin hash"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[#848E9C] text-xs">Menunggu</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B0E11]/35 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-[#C9D1D9] leading-relaxed">
                    Catatan: halaman ini hanya contoh tampilan. Alamat wallet resmi & verifikasi ada di halaman Transparansi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Governance */}
        {activeTab === "governance" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#F0B90B]" />
                Aturan Voting (Contoh)
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Voting power mengikuti snapshot",
                    desc: "Voting power dihitung berdasarkan aturan snapshot (contoh: saldo TPC pada waktu tertentu).",
                  },
                  {
                    title: "Kuorum minimum (contoh)",
                    desc: "Proposal butuh partisipasi minimum agar hasil dianggap sah (misal 25%).",
                  },
                  {
                    title: "Periode voting (contoh)",
                    desc: "Setiap proposal aktif selama periode tertentu (misal 7 hari).",
                  },
                  {
                    title: "Penundaan eksekusi (contoh)",
                    desc: "Proposal yang lolos bisa diberi jeda (misal 24 jam) untuk keamanan.",
                  },
                ].map((it, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">{it.title}</p>
                      <p className="text-[#848E9C] text-sm mt-1">{it.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-300 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90 leading-relaxed">
                    Tidak ada proposal yang boleh berisi janji profit/ROI, titip dana, atau permintaan transfer ke wallet pribadi.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#F0B90B]" />
                Jenis Proposal
              </h3>

              <div className="space-y-3">
                {[
                  { icon: Wallet, title: "Treasury", desc: "Alokasi/re-alokasi dana operasional komunitas (resmi & transparan)." , tone: "purple" },
                  { icon: BarChart3, title: "Protokol", desc: "Perubahan sistem, keamanan, dan fitur governance.", tone: "blue" },
                  { icon: Users, title: "Komunitas", desc: "Kegiatan komunitas, edukasi, dan program internal.", tone: "green" },
                  { icon: Zap, title: "Marketing", desc: "Campaign promosi & awareness (tanpa janji profit).", tone: "orange" },
                ].map((t, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-[#14181D]/60 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cx(
                          "h-11 w-11 rounded-2xl flex items-center justify-center border",
                          t.tone === "purple" && "bg-purple-500/15 border-purple-500/20",
                          t.tone === "blue" && "bg-blue-500/15 border-blue-500/20",
                          t.tone === "green" && "bg-emerald-500/15 border-emerald-500/20",
                          t.tone === "orange" && "bg-orange-500/15 border-orange-500/20"
                        )}
                      >
                        <t.icon
                          className={cx(
                            "h-5 w-5",
                            t.tone === "purple" && "text-purple-300",
                            t.tone === "blue" && "text-blue-300",
                            t.tone === "green" && "text-emerald-300",
                            t.tone === "orange" && "text-orange-300"
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold">{t.title}</p>
                        <p className="text-[#848E9C] text-sm mt-1">{t.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0B0E11]/35 p-4">
                <p className="text-sm text-[#C9D1D9] leading-relaxed">
                  Untuk versi “ibu-ibu friendly”, sebaiknya ada halaman DAO-Lite terpisah yang menjelaskan konsep DAO dengan analogi sederhana.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Voting */}
        {activeTab === "voting" && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="text-center py-10">
              <Users className="h-16 w-16 text-[#848E9C] mx-auto mb-4" />
              <h3 className="text-2xl font-extrabold text-white mb-2">Voting Saya</h3>

              <p className="text-[#C9D1D9] text-lg">
                Voting power saat ini: <span className="text-[#F0B90B] font-extrabold">0 TPC</span>
              </p>

              <p className="text-[#848E9C] text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
                Untuk bisa voting, pengguna perlu memiliki TPC sesuai aturan snapshot voting. Ini bukan ajakan investasi.
                TPC adalah ekosistem edukasi komunitas—tidak ada janji profit/ROI.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/id/buytpc")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-extrabold px-6 py-3 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  <span>Dapatkan TPC untuk Voting</span>
                </button>

                <button
                  onClick={() => setActiveTab("proposals")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Lihat Proposal Aktif</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* footer spacing */}
        <div className="h-10 md:h-14" />
      </div>
    </div>
  );
}
