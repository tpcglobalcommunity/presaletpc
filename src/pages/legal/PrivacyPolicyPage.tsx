import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_50%_-100px,rgba(240,185,11,0.10),transparent),linear-gradient(to_bottom,#0B0E11,black)]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E11]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/55">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/id")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#C9D1D9] hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span className="font-medium">Kembali</span>
              </button>
            </div>
            <div className="text-sm text-[#848E9C]">
              Terakhir diperbarui: 1 Februari 2026
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-xl text-[#F0B90B] font-semibold mb-2">
            Trader Professional Community (TPC Global)
          </p>
          <p className="text-[#848E9C] text-sm">
            Terakhir diperbarui: 1 Februari 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              1. Informasi yang Kami Kumpulkan
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar atau menggunakan layanan TPC Global.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Informasi akun: email, nama, username</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Informasi transaksi: riwayat pembelian, invoice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Informasi penggunaan: log aktivitas, preferensi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              2. Penggunaan Informasi
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                Informasi yang kami kumpulkan digunakan untuk:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Menyediakan dan mengelola layanan TPC</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Memproses transaksi dan pembayaran</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Mengirim komunikasi terkait layanan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Meningkatkan pengalaman pengguna</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              3. Perlindungan Data
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                Kami melindungi data pribadi Anda dengan:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Enkripsi data selama transmisi dan penyimpanan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Akses terbatas untuk authorized personnel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Audit keamanan berkala</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              4. Berbagi Informasi
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga untuk keperluan marketing. Informasi hanya dibagikan dalam kasus:
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Diperlukan oleh hukum atau perintah pengadilan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Melindungi hak, properti, atau keselamatan TPC Global</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Dengan persetujuan eksplisit Anda</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              5. Hak Pengguna
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                Anda memiliki hak untuk:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Mengakses dan memperbarui informasi pribadi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Menghapus akun dan data terkait</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Menolak pemasaran langsung</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">Meminta salinan data pribadi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              6. Cookies dan Teknologi Pelacakan
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                Kami menggunakan cookies untuk meningkatkan pengalaman pengguna, menganalisis traffic, dan mengingat preferensi. Anda dapat mengatur browser untuk menolak cookies.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              7. Perubahan Kebijakan
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan akan diinformasikan melalui platform atau email terdaftar. Pengguna dianggap menyetujui perubahan dengan terus menggunakan layanan.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              8. Kontak Privasi
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                Untuk pertanyaan atau permintaan terkait privasi data, hubungi kami melalui kanal resmi TPC Global yang terverifikasi.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-24 md:h-28" />
      </div>
    </div>
  );
}
