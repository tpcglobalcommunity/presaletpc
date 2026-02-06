import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  ArrowRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Crown,
  Zap,
  Award,
  Settings,
  Calendar,
  TrendingUp,
  FileText,
} from "lucide-react";
import { getPublicCopySafe, validatePublicCopyShape } from "@/i18n/getPublicCopySafe";

export default function ChaptersSopPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict language enforcement: ID is canonical, EN follows ID
  const safeLang = lang === 'en' ? 'en' : 'id';
  const t = getPublicCopySafe(safeLang);

  // Development-only validation
  if (process.env.NODE_ENV === 'development') {
    validatePublicCopyShape(t);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_50%_-100px,rgba(240,185,11,0.10),transparent),linear-gradient(to_bottom,#0B0E11,black)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E11]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/55">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate("/id")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0"
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
                  <h1 className="text-white font-bold text-base md:text-lg truncate">TPC Chapters</h1>
                  <p className="text-[#848E9C] text-xs truncate">Struktur komunitas yang rapi dan aman</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.open("https://t.me/tpcglobalcommunity", "_blank", "noopener,noreferrer")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Laporkan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-[#F0B90B]/20 bg-gradient-to-br from-[#F0B90B]/15 via-white/5 to-transparent p-6 md:p-10 mb-8">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F0B90B]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative text-center">
            <div className="mx-auto h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-2xl shadow-[#F0B90B]/10 border border-[#F0B90B]/25">
              <Crown className="h-10 w-10 md:h-12 md:w-12 text-black" />
            </div>

            <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              TPC Chapters
            </h2>
            <p className="mt-3 text-[#C9D1D9] text-base md:text-lg max-w-3xl mx-auto">
              Struktur komunitas agar rapi, aman, dan anti-scam
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#F0B90B]/30 bg-[#F0B90B]/10 px-4 py-2">
                <Star className="h-4 w-4 text-[#F0B90B]" />
                <span className="text-[#F0B90B] font-semibold text-sm">Edukasi saja</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-red-400 font-semibold text-sm">{t.badges.antiScam}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">{t.badges.transparent}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Organization Structure */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8 text-center">
            {t.sections.orgStructure.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Chapter Lead */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#F0B90B]/20 bg-gradient-to-br from-[#F0B90B]/15 via-white/5 to-transparent p-6 hover:border-[#F0B90B]/30 transition-all">
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#F0B90B]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border border-[#F0B90B]/25 mb-4">
                  <Crown className="h-8 w-8 text-black" />
                </div>
                
                <h4 className="text-xl font-extrabold text-white mb-2">{t.sections.roles.items.chapterLead}</h4>
                <p className="text-[#F0B90B] font-semibold mb-4">{t.sections.roles.items.chapterLead}</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-white font-semibold mb-2">{t.sections.roles.title}</h5>
                    <p className="text-[#848E9C] text-sm leading-relaxed">
                      {t.sections.roles.items.chapterLead}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-2">{t.sections.rules.title}</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">{t.sections.rules.items.noPrivateTransfer}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">{t.sections.rules.items.noSeedPhrase}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">{t.sections.rules.items.officialOnly}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-2">{t.sections.rules.title}</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">{t.sections.rules.items.noPrivateTransfer}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">{t.sections.rules.items.noSeedPhrase}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">{t.sections.rules.items.officialOnly}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Koordinator */}
            <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/15 via-white/5 to-transparent p-6 hover:border-purple-500/30 transition-all">
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/10 border border-purple-500/25 mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                
                <h4 className="text-xl font-extrabold text-white mb-2">{t.sections.roles.items.koordinator}</h4>
                <p className="text-purple-300 font-semibold mb-4">{t.sections.roles.items.koordinator}</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-white font-semibold mb-2">{t.sections.roles.title}</h5>
                    <p className="text-[#848E9C] text-sm leading-relaxed">
                      Manajemen komunitas lokal, edukasi, dan support member di area tertentu.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-2">Tugas Utama</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Mengelola komunitas lokal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Memberikan edukasi dasar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Support member level pertama</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-2">Batasan Keras</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Tidak boleh membuat grup pribadi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Tidak boleh meminta data pribadi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Tidak boleh menjanjikan keuntungan</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderator */}
            <div className="group relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/15 via-white/5 to-transparent p-6 hover:border-blue-500/30 transition-all">
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-500/25 mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                
                <h4 className="text-xl font-extrabold text-white mb-2">Moderator Komunitas</h4>
                <p className="text-blue-300 font-semibold mb-4">Online</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-white font-semibold mb-2">Fokus</h5>
                    <p className="text-[#848E9C] text-sm leading-relaxed">
                      Moderasi grup, menjaga ketertiban, dan filter konten negatif.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-2">Tugas Utama</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Moderasi grup Telegram</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Filter spam & scam</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Bantu member baru</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-semibold mb-2">Batasan Keras</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Tidak boleh memberikan saran investasi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Tidak boleh mempromosikan external</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-[#848E9C] text-sm">Tidak boleh menyalahgunakan authority</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reporting Flow */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8 text-center">
            Alur Pelaporan
          </h3>
          
          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F0B90B]/30 to-transparent hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border border-[#F0B90B]/25 mb-3 relative z-10">
                    <Users className="h-8 w-8 text-black" />
                  </div>
                  <h4 className="text-white font-extrabold text-sm mb-2">Member</h4>
                  <p className="text-[#848E9C] text-xs leading-relaxed">
                    Melaporkan masalah atau mencari bantuan
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-500/25 mb-3 relative z-10">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-white font-extrabold text-sm mb-2">Moderator</h4>
                  <p className="text-[#848E9C] text-xs leading-relaxed">
                    Filter dan handle kasus ringan
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/10 border border-purple-500/25 mb-3 relative z-10">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-white font-extrabold text-sm mb-2">Koordinator</h4>
                  <p className="text-[#848E9C] text-xs leading-relaxed">
                    Handle kasus menengah & koordinasi lokal
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border border-[#F0B90B]/25 mb-3 relative z-10">
                    <Crown className="h-8 w-8 text-black" />
                  </div>
                  <h4 className="text-white font-extrabold text-sm mb-2">Chapter Lead</h4>
                  <p className="text-[#848E9C] text-xs leading-relaxed">
                    Handle kasus besar & koordinasi regional
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/10 border border-red-500/25 mb-3 relative z-10">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-white font-extrabold text-sm mb-2">Admin Pusat</h4>
                  <p className="text-[#848E9C] text-xs leading-relaxed">
                    Handle kasus krusial & keputusan final
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cara Verifikasi Koordinator */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-[#F0B90B]/20 bg-gradient-to-br from-[#F0B90B]/15 via-white/5 to-transparent p-6 md:p-8">
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F0B90B]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border border-[#F0B90B]/25">
                  <Shield className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                    Cara Verifikasi Koordinator
                  </h3>
                  <p className="text-[#F0B90B] font-semibold">Wajib Sebelum Percaya</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F0B90B] font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Cek Nama di Halaman Resmi</h4>
                      <p className="text-[#848E9C] text-sm">Buka /id/verified-coordinators dan cari nama koordinator</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F0B90B] font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Cocokkan Username Telegram</h4>
                      <p className="text-[#848E9C] text-sm">Username harus sama persis dengan yang tertera di halaman</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F0B90B] font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Koordinator Tidak DM Duluan</h4>
                      <p className="text-[#848E9C] text-sm">Koordinator resmi tidak akan menghubungi Anda duluan</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F0B90B] font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Tidak Ada Transfer Pribadi</h4>
                      <p className="text-[#848E9C] text-sm">Koordinator tidak pernah minta transfer ke wallet pribadi</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-300 font-semibold mb-2">PERINGATAN PENTING</h4>
                      <p className="text-red-400 text-sm leading-relaxed">
                        Semua transaksi pembelian TPC hanya melalui halaman resmi Buy TPC (/id/buytpc). 
                        Tidak ada koordinator yang berhak menjual atau menerima pembelian TPC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate("/id/verified-coordinators")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F0B90B]/30 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 px-6 py-3 text-[#F0B90B] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0"
                >
                  <Shield className="h-5 w-5" />
                  <span>Buka Halaman Koordinator Resmi</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SOP + Kode Etik */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8 text-center">
            SOP & Kode Etik
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* SOP */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h4 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#F0B90B]" />
                SOP (Standard Operating Procedure)
              </h4>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-white font-semibold mb-3">Prinsip Wajib</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Edukasi saja, tidak ada janji profit/ROI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Transparansi dalam semua komunikasi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Verifikasi identitas sebelum memberikan authority</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Dokumentasi semua keputusan penting</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-white font-semibold mb-3">Larangan Keras (Zero Tolerance)</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Meminta transfer ke wallet pribadi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Meminta seed phrase/OTP/private key</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Menjanjikan profit/ROI/investasi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Mengelola dana member</span>
                    </li>
                  </ul>
                  <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
                    <p className="text-red-400 text-xs leading-relaxed">
                      <span className="font-semibold">Sanksi:</span> Pelanggaran zero tolerance dapat berakibat pencabutan status koordinator dan publikasi di halaman verified coordinators.
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-white font-semibold mb-3">Aturan Komunikasi Resmi</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Hanya melalui kanal resmi TPC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Tidak ada DM pertama dari koordinator</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Semua pengumuman melalui grup resmi</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Kode Etik */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h4 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#F0B90B]" />
                Kode Etik Perilaku
              </h4>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-white font-semibold mb-3">SOP Event</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-[#F0B90B] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white text-sm font-medium">Sebelum:</span>
                        <p className="text-[#848E9C] text-sm mt-1">Izin admin, publikasi resmi, verifikasi lokasi</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-[#F0B90B] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white text-sm font-medium">Saat:</span>
                        <p className="text-[#848E9C] text-sm mt-1">Fokus edukasi, tidak ada kolekte, dokumentasi</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#F0B90B] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white text-sm font-medium">Sesudah:</span>
                        <p className="text-[#848E9C] text-sm mt-1">Laporan ke admin, feedback, dokumentasi lengkap</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-white font-semibold mb-3">SOP Pelaporan Scam</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 rounded-full bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center text-[#F0B90B] font-bold text-xs shrink-0 mt-0.5">1</span>
                      <span className="text-[#848E9C] text-sm">Screenshot bukti lengkap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 rounded-full bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center text-[#F0B90B] font-bold text-xs shrink-0 mt-0.5">2</span>
                      <span className="text-[#848E9C] text-sm">Laporkan ke moderator/grup resmi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 rounded-full bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center text-[#F0B90B] font-bold text-xs shrink-0 mt-0.5">3</span>
                      <span className="text-[#848E9C] text-sm">Jangan balas atau transfer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 rounded-full bg-[#F0B90B]/20 border border-[#F0B90B]/30 flex items-center justify-center text-[#F0B90B] font-bold text-xs shrink-0 mt-0.5">4</span>
                      <span className="text-[#848E9C] text-sm">Blokir dan warning ke komunitas</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-white font-semibold mb-3">5 Poin Kode Etik</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Integritas dan transparansi dalam semua tindakan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Prioritaskan keselamatan member</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Jangan gunakan authority untuk keuntungan pribadi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Selalu verifikasi sebelum memberikan informasi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[#848E9C] text-sm">Report pelanggaran ke atasan</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-4">
              Bergabung dengan Komunitas Aman
            </h3>
            <p className="text-[#848E9C] text-base max-w-2xl mx-auto">
              Verifikasi selalu identitas koordinator sebelum percaya. TPC adalah platform edukasi komunitas yang transparan dan aman.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/id/verified-coordinators")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F0B90B]/30 bg-[#F0B90B]/10 hover:bg-[#F0B90B]/20 px-4 py-3 text-[#F0B90B] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/30 focus:ring-offset-0"
            >
              <Shield className="h-4 w-4" />
              <span>Cek Koordinator Resmi</span>
            </button>
            
            <button
              onClick={() => navigate("/id/anti-scam")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-4 py-3 text-red-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-0"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Anti-Scam Notice</span>
            </button>
            
            <button
              onClick={() => navigate("/id/transparansi")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-3 text-emerald-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Transparansi</span>
            </button>
          </div>
        </div>

        <div className="h-24 md:h-28" />
      </div>
    </div>
  );
}
