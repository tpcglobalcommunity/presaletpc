import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  ArrowRight,
  Shield,
  AlertTriangle,
  Copy,
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle,
  MessageSquare,
  Star,
  Crown,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ChapterRole = "moderator" | "koordinator" | "chapter_lead";
type ChapterStatus = "aktif" | "nonaktif";

interface VerifiedPerson {
  id: string;
  displayName: string;
  role: ChapterRole;
  country: string;
  region: string;
  city: string;
  status: ChapterStatus;
  termStart: string;
  termEnd: string;
  telegramUsername: string;
  socials?: { label: string; url: string }[];
  localGroupUrl?: string;
  verifiedAt: string;
  revokedReason?: string;
  publicNotes?: string;
}

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

// Routes
const ROUTES = {
  HOME: "/id",
  ANTI_SCAM: "/id/anti-scam",
  TRANSPARENCY: "/id/transparansi",
};

// Mock data - nanti ganti ke Supabase
const VERIFIED_PEOPLE: VerifiedPerson[] = [
  {
    id: "1",
    displayName: "Ahmad Wijaya",
    role: "chapter_lead",
    country: "Indonesia",
    region: "Jawa Barat",
    city: "Bandung",
    status: "aktif",
    termStart: "2024-01-01",
    termEnd: "2025-12-31",
    telegramUsername: "ahmad_tpc",
    socials: [
      { label: "Twitter", url: "https://twitter.com/ahmad_tpc" },
      { label: "LinkedIn", url: "https://linkedin.com/in/ahmad-wijaya" },
    ],
    localGroupUrl: "https://t.me/tpcbandung",
    verifiedAt: "2024-01-01T10:00:00Z",
    publicNotes: "Koordinator untuk wilayah Jawa Barat dan sekitarnya",
  },
  {
    id: "2",
    displayName: "Siti Nurhaliza",
    role: "koordinator",
    country: "Indonesia",
    region: "DKI Jakarta",
    city: "Jakarta Pusat",
    status: "aktif",
    termStart: "2024-02-01",
    termEnd: "2025-01-31",
    telegramUsername: "siti_tpc",
    socials: [{ label: "Instagram", url: "https://instagram.com/siti_tpc" }],
    verifiedAt: "2024-02-01T14:30:00Z",
  },
  {
    id: "3",
    displayName: "Budi Santoso",
    role: "moderator",
    country: "Indonesia",
    region: "Jawa Tengah",
    city: "Semarang",
    status: "aktif",
    termStart: "2024-03-01",
    termEnd: "2025-02-28",
    telegramUsername: "budi_tpc",
    verifiedAt: "2024-03-01T09:15:00Z",
  },
  {
    id: "4",
    displayName: "Maya Putri",
    role: "koordinator",
    country: "Indonesia",
    region: "Jawa Timur",
    city: "Surabaya",
    status: "aktif",
    termStart: "2024-01-15",
    termEnd: "2025-01-14",
    telegramUsername: "maya_tpc",
    localGroupUrl: "https://t.me/tpcsurabaya",
    verifiedAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "5",
    displayName: "Diana Kartika",
    role: "chapter_lead",
    country: "Malaysia",
    region: "Kuala Lumpur",
    city: "Kuala Lumpur",
    status: "aktif",
    termStart: "2024-02-15",
    termEnd: "2025-02-14",
    telegramUsername: "diana_tpc",
    socials: [{ label: "Facebook", url: "https://facebook.com/diana.tpc" }],
    localGroupUrl: "https://t.me/tpckl",
    verifiedAt: "2024-02-15T16:20:00Z",
  },
  {
    id: "6",
    displayName: "Faisal Rahman",
    role: "koordinator",
    country: "Indonesia",
    region: "Sumatera Utara",
    city: "Medan",
    status: "nonaktif",
    termStart: "2023-01-01",
    termEnd: "2024-01-01",
    telegramUsername: "faisal_tpc",
    verifiedAt: "2023-01-01T09:00:00Z",
    revokedReason: "Masa tugas selesai",
  },
  {
    id: "7",
    displayName: "Indah Permata",
    role: "moderator",
    country: "Indonesia",
    region: "Sulawesi Selatan",
    city: "Makassar",
    status: "nonaktif",
    termStart: "2023-06-01",
    termEnd: "2024-06-01",
    telegramUsername: "indah_tpc",
    verifiedAt: "2023-06-01T14:00:00Z",
    revokedReason: "Melanggar kode etik (promosi investasi)",
  },
  {
    id: "8",
    displayName: "Ricky Kurniawan",
    role: "koordinator",
    country: "Indonesia",
    region: "Kalimantan Timur",
    city: "Balikpapan",
    status: "nonaktif",
    termStart: "2023-09-01",
    termEnd: "2024-09-01",
    telegramUsername: "ricky_tpc",
    verifiedAt: "2023-09-01T11:30:00Z",
    revokedReason: "Mengarah ke permintaan transfer pribadi",
  },
];

// Date format helper
const formatDateId = (date: string) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const [year, month, day] = date.split("-");
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
};

// Role icon helper
const getRoleIcon = (role: ChapterRole) => {
  switch (role) {
    case "chapter_lead":
      return { icon: Crown, bg: "from-[#F0B90B] to-[#F8D56B]", border: "border-[#F0B90B]/25", iconColor: "text-black" };
    case "koordinator":
      return { icon: Star, bg: "from-[#F0B90B]/20 to-[#F8D56B]/20", border: "border-[#F0B90B]/25", iconColor: "text-[#F0B90B]" };
    case "moderator":
      return { icon: Shield, bg: "from-blue-500 to-blue-600", border: "border-blue-500/25", iconColor: "text-white" };
    default:
      return { icon: Users, bg: "from-gray-500 to-gray-600", border: "border-gray-500/25", iconColor: "text-white" };
  }
};

function roleBadgeClass(role: ChapterRole): string {
  const base = "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold";
  switch (role) {
    case "moderator":
      return cx(base, "bg-blue-500/15 text-blue-300 border-blue-500/25");
    case "koordinator":
      return cx(base, "bg-purple-500/15 text-purple-300 border-purple-500/25");
    case "chapter_lead":
      return cx(base, "bg-[#F0B90B]/15 text-[#F8D56B] border-[#F0B90B]/25");
    default:
      return cx(base, "bg-white/5 text-[#C9D1D9] border-white/10");
  }
}

function roleLabel(role: ChapterRole): string {
  switch (role) {
    case "moderator":
      return "Moderator";
    case "koordinator":
      return "Koordinator";
    case "chapter_lead":
      return "Chapter Lead";
    default:
      return "Unknown";
  }
}

function statusBadgeClass(status: ChapterStatus): string {
  const base = "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold";
  switch (status) {
    case "aktif":
      return cx(base, "bg-emerald-500/15 text-emerald-300 border-emerald-500/25");
    case "nonaktif":
      return cx(base, "bg-red-500/15 text-red-300 border-red-500/25");
    default:
      return cx(base, "bg-white/5 text-[#C9D1D9] border-white/10");
  }
}

function statusLabel(status: ChapterStatus): string {
  switch (status) {
    case "aktif":
      return "Aktif";
    case "nonaktif":
      return "Nonaktif";
    default:
      return "Unknown";
  }
}

export default function VerifiedCoordinatorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("verified");
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

  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(VERIFIED_PEOPLE.map(p => p.country))];
    return uniqueCountries.sort();
  }, []);

  const filteredPeople = useMemo(() => {
    let filtered = VERIFIED_PEOPLE.filter(person => {
      const matchesSearch = !searchQuery.trim() || 
        person.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = countryFilter === "all" || person.country === countryFilter;
      const matchesRole = roleFilter === "all" || person.role === roleFilter;
      const matchesStatus = statusFilter === "all" || person.status === statusFilter;

      return matchesSearch && matchesCountry && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "verified":
          return new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime();
        case "name":
          return a.displayName.localeCompare(b.displayName);
        case "region":
          return `${a.country} ${a.region}`.localeCompare(`${b.country} ${b.region}`);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, countryFilter, roleFilter, statusFilter, sortBy]);

  const activePeople = filteredPeople.filter(p => p.status === "aktif");
  const inactivePeople = filteredPeople.filter(p => p.status === "nonaktif");

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
                  <Shield className="h-5 w-5 text-black" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-base md:text-lg truncate">Koordinator Resmi TPC (Verified)</h1>
                  <p className="text-[#848E9C] text-xs truncate">Cek di sini sebelum percaya</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.open("https://t.me/tpcglobalcommunity", "_blank", "noopener,noreferrer")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium hidden sm:inline">Laporkan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Hero Warning Box */}
        <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/15 via-red-500/5 to-orange-500/10 p-6 md:p-8 mb-8">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
                  ⚠️ PERINGATAN ANTI-SCAM
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[#C9D1D9] text-sm md:text-base">
                      <span className="text-white font-semibold">TPC tidak pernah meminta transfer ke wallet pribadi.</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[#C9D1D9] text-sm md:text-base">
                      <span className="text-white font-semibold">TPC tidak pernah meminta seed phrase/OTP/private key.</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[#C9D1D9] text-sm md:text-base">
                      <span className="text-white font-semibold">Koordinator resmi hanya yang tertera di halaman ini.</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[#C9D1D9] text-sm md:text-base">
                      <span className="text-white font-semibold">Jika nama tidak ada di sini → anggap tidak resmi.</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#F0B90B]/30 bg-[#F0B90B]/10 px-4 py-2">
                  <Star className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-[#F0B90B] font-semibold text-sm">Education-only, no profit/ROI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
              <input
                type="text"
                placeholder="Cari nama/username/kota/negara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-2.5 text-white placeholder-[#848E9C] outline-none focus:border-[#F0B90B]/40"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="h-10 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0 min-w-[180px]">
                  <SelectValue placeholder="Semua Negara" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B0E11] text-white">
                  <SelectItem value="all">Semua Negara</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-10 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0 min-w-[180px]">
                  <SelectValue placeholder="Semua Peran" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B0E11] text-white">
                  <SelectItem value="all">Semua Peran</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="koordinator">Koordinator</SelectItem>
                  <SelectItem value="chapter_lead">Chapter Lead</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0 min-w-[180px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B0E11] text-white">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0 min-w-[180px]">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B0E11] text-white">
                  <SelectItem value="verified">Terbaru Diverifikasi</SelectItem>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                  <SelectItem value="region">Wilayah A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Coordinators */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-6">
            Koordinator Aktif ({activePeople.length})
          </h3>
          
          {activePeople.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white font-semibold">Tidak ada koordinator yang cocok dengan filter.</p>
              <p className="text-[#848E9C] text-sm mt-2">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {activePeople.map((person) => (
                <div
                  key={person.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#14181D]/80 backdrop-blur p-6 hover:border-[#F0B90B]/25 hover:shadow-xl hover:shadow-[#F0B90B]/5 transition-all"
                >
                  <div className="pointer-events-none absolute -top-24 -right-24 h-52 w-52 rounded-full bg-[#F0B90B]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    {(() => {
                      const roleIcon = getRoleIcon(person.role);
                      const IconComponent = roleIcon.icon;
                      return (
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div className="min-w-0">
                              <h4 className="text-white font-extrabold text-lg leading-snug">{person.displayName}</h4>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={roleBadgeClass(person.role)}>{roleLabel(person.role)}</span>
                                <span className={statusBadgeClass(person.status)}>{statusLabel(person.status)}</span>
                              </div>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${roleIcon.bg} flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border ${roleIcon.border}`}>
                              <IconComponent className={`h-6 w-6 ${roleIcon.iconColor}`} />
                            </div>
                          </div>

                          <div className="flex items-start gap-3 mb-4">
                            <MapPin className="h-4 w-4 text-[#F0B90B] shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-white font-medium">{person.city}</p>
                              <p className="text-[#848E9C] text-sm">{person.region}, {person.country}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-4">
                            <Calendar className="h-4 w-4 text-[#848E9C]" />
                            <p className="text-[#848E9C] text-sm">{formatDateId(person.termStart)} → {formatDateId(person.termEnd)}</p>
                          </div>
                        </>
                      );
                    })()}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        <span className="text-[#C9D1D9] text-sm">@{person.telegramUsername}</span>
                        {copiedText === `@${person.telegramUsername}` && (
                          <span className="text-emerald-400 text-xs font-medium">Tersalin</span>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(`@${person.telegramUsername}`)}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
                        title="Salin username"
                      >
                        <Copy className="h-3 w-3 text-[#C9D1D9]" />
                      </button>
                    </div>

                    {person.socials && person.socials.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {person.socials.map((social, idx) => (
                          <button
                            key={idx}
                            onClick={() => window.open(social.url, "_blank", "noopener,noreferrer")}
                            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#C9D1D9] hover:bg-white/10 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{social.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {person.localGroupUrl && (
                      <button
                        onClick={() => window.open(person.localGroupUrl, "_blank", "noopener,noreferrer")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F0B90B]/30 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 px-4 py-2.5 text-[#F0B90B] font-semibold transition-colors"
                      >
                        <Users className="h-4 w-4" />
                        <span>Grup Lokal</span>
                      </button>
                    )}

                    {person.publicNotes && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B0E11]/35 p-3">
                        <p className="text-[#848E9C] text-xs leading-relaxed">{person.publicNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inactive Coordinators */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-6">
            Koordinator Nonaktif ({inactivePeople.length})
          </h3>
          
          {inactivePeople.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white font-semibold">Tidak ada data nonaktif.</p>
              <p className="text-[#848E9C] text-sm mt-2">Semua koordinator dalam status aktif.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {inactivePeople.map((person) => (
                <div
                  key={person.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#14181D]/60 backdrop-blur p-6 opacity-75"
                >
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0">
                        <h4 className="text-white font-extrabold text-lg leading-snug">{person.displayName}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={roleBadgeClass(person.role)}>{roleLabel(person.role)}</span>
                          <span className={statusBadgeClass(person.status)}>{statusLabel(person.status)}</span>
                        </div>
                      </div>
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${getRoleIcon(person.role).bg} flex items-center justify-center shadow-lg border ${getRoleIcon(person.role).border} opacity-50`}>
                        {(() => {
                          const IconComponent = getRoleIcon(person.role).icon;
                          return <IconComponent className={`h-6 w-6 ${getRoleIcon(person.role).iconColor}`} />;
                        })()}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="h-4 w-4 text-[#F0B90B] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-white font-medium">{person.city}</p>
                        <p className="text-[#848E9C] text-sm">{person.region}, {person.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-4 w-4 text-[#848E9C]" />
                      <p className="text-[#848E9C] text-sm">{formatDateId(person.termStart)} → {formatDateId(person.termEnd)}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        <span className="text-[#C9D1D9] text-sm">@{person.telegramUsername}</span>
                        {copiedText === `@${person.telegramUsername}` && (
                          <span className="text-emerald-400 text-xs font-medium">Tersalin</span>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(`@${person.telegramUsername}`)}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
                        title="Salin username"
                      >
                        <Copy className="h-3 w-3 text-[#C9D1D9]" />
                      </button>
                    </div>

                    {person.revokedReason && (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-red-300 text-sm font-medium">Alasan Nonaktif</p>
                            <p className="text-red-400 text-xs mt-1">{person.revokedReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-4">
              Tetap Aman dan Terinformasi
            </h3>
            <p className="text-[#848E9C] text-base max-w-2xl mx-auto">
              Selalu verifikasi identitas koordinator sebelum percaya. TPC adalah platform edukasi, bukan investasi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate(ROUTES.ANTI_SCAM)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-4 py-3 text-red-300 font-semibold transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Baca Anti-Scam Notice</span>
            </button>
            
            <button
              onClick={() => navigate(ROUTES.TRANSPARENCY)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F0B90B]/30 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 px-4 py-3 text-[#F0B90B] font-semibold transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Lihat Transparansi Wallet</span>
            </button>
            
            <button
              onClick={() => window.open("https://t.me/tpcglobalcommunity", "_blank", "noopener,noreferrer")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-3 text-blue-300 font-semibold transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Gabung Telegram Resmi</span>
            </button>
          </div>
        </div>

        <div className="h-24 md:h-28" />
      </div>
    </div>
  );
}
