import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const termsContent = {
  title: "Syarat dan Ketentuan",
  subtitle: "Trader Professional Community (TPC Global)",
  updated: "1 Februari 2026",
  
  section1: {
    title: "Ruang Lingkup Layanan",
    body: "Syarat dan Ketentuan ini mengatur penggunaan platform, layanan edukasi, dan komunitas yang disediakan oleh Trader Professional Community (TPC Global). Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh syarat dan ketentuan ini."
  },
  
  section2: {
    title: "Education Only – No Financial Advice",
    body: "TPC Global menyediakan konten edukasi trading semata-mata untuk tujuan pembelajaran. Kami bukan penasihat keuangan berlisensi dan tidak memberikan rekomendasi investasi.",
    point1: "Semua materi bersifat informatif dan edukatif",
    point2: "Kami tidak menjamin profit atau hasil trading tertentu",
    point3: "Keputusan trading sepenuhnya menjadi tanggung jawab pengguna"
  },
  
  section3: {
    title: "Risiko Trading & Investasi",
    body: "Trading dan investasi melibatkan risiko signifikan termasuk kemungkinan kehilangan seluruh modal. Nilai aset kripto sangat fluktuatif.",
    warning: {
      title: "PERINGATAN RISIKO TINGGI",
      body: "Jangan pernah menginvestasikan lebih dari yang Anda mampu untuk kehilangan. Pastikan Anda memahami sepenuhnya risiko sebelum terlibat dalam aktivitas trading atau investasi."
    }
  },
  
  section4: {
    title: "Akun & Keanggotaan",
    body: "Pengguna bertanggung jawab untuk menjaga kerahasiaan kredensial akun. Keanggotaan TPC dapat ditangguhkan atau dihentikan jika melanggar syarat dan ketentuan. Setiap pengguna hanya diperbolehkan memiliki satu akun."
  },
  
  section5: {
    title: "TPC Token",
    body: "TPC Token adalah utilitas token untuk akses layanan edukasi dan komunitas. Bukan instrumen investasi atau sekuritas.",
    point1: "Token tidak memberikan hak kepemilikan perusahaan",
    point2: "Nilai token dapat berfluktuasi tanpa jaminan"
  },
  
  section6: {
    title: "Larangan Aktivitas",
    body: "Dilarang keras menggunakan platform untuk aktivitas ilegal, pencucian uang, pendanaan teroris, penipuan, atau kegiatan yang melanggar hukum yang berlaku. Pelanggaran akan mengakibatkan penangguhan akun dan pelaporan ke pihak berwenang."
  },
  
  section7: {
    title: "Hak Kekayaan Intelektual",
    body: "Semua konten, materi edukasi, desain, dan properti intelektual lainnya milik TPC Global. Dilarang keras menyalin, mendistribusikan, atau menggunakan ulang tanpa izin tertulis."
  },
  
  section8: {
    title: "Batasan Tanggung Jawab",
    body: "TPC Global tidak bertanggung jawab atas kerugian finansial atau non-finansial yang timbul dari penggunaan layanan kami. Layanan disediakan 'sebagaimana adanya' tanpa jaminan apapun."
  },
  
  section9: {
    title: "Perubahan Syarat",
    body: "TPC Global berhak mengubah syarat dan ketentuan sewaktu-waktu. Perubahan akan diinformasikan melalui platform atau email terdaftar. Pengguna dianggap menyetujui perubahan dengan terus menggunakan layanan."
  },
  
  section10: {
    title: "Hukum yang Berlaku",
    body: "Syarat dan ketentuan ini diatur oleh hukum yang berlaku di yurisdiksi TPC Global beroperasi. Sengketa akan diselesaikan melalui arbitrase atau pengadilan yang kompeten."
  },
  
  section11: {
    title: "Kontak Resmi",
    body: "Untuk pertanyaan atau klarifikasi mengenai syarat dan ketentuan, hubungi kami melalui kanal resmi TPC Global yang terverifikasi. Hindari komunikasi melalui pihak ketiga yang tidak berwenang."
  },
  
  section12: {
    title: "Pernyataan Persetujuan",
    body: "Dengan menggunakan platform TPC Global, Anda menyatakan telah membaca, memahami, dan menyetujui syarat dan ketentuan ini secara keseluruhan. Jika tidak setuju, harap segera berhenti menggunakan layanan kami.",
    agreement: "Penggunaan lanjutan platform merupakan persetujuan penuh terhadap semua syarat dan ketentuan yang berlaku."
  }
};

export default function TermsConditionsPage() {
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
              Terakhir diperbarui: {termsContent.updated}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {termsContent.title}
          </h1>
          <p className="text-xl text-[#F0B90B] font-semibold mb-2">
            {termsContent.subtitle}
          </p>
          <p className="text-[#848E9C] text-sm">
            {termsContent.updated}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              1. {termsContent.section1.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section1.body}
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              2. {termsContent.section2.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                {termsContent.section2.body}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">{termsContent.section2.point1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">{termsContent.section2.point2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">{termsContent.section2.point3}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              3. {termsContent.section3.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                {termsContent.section3.body}
              </p>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-red-300 text-sm font-medium mb-2">
                  {termsContent.section3.warning.title}
                </p>
                <p className="text-red-400 text-sm leading-relaxed">
                  {termsContent.section3.warning.body}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              4. {termsContent.section4.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section4.body}
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              5. {termsContent.section5.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                {termsContent.section5.body}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">{termsContent.section5.point1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B] mt-1">•</span>
                  <span className="text-[#C9D1D9]">{termsContent.section5.point2}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              6. {termsContent.section6.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section6.body}
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              7. {termsContent.section7.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section7.body}
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              8. {termsContent.section8.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section8.body}
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              9. {termsContent.section9.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section9.body}
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              10. {termsContent.section10.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section10.body}
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              11. {termsContent.section11.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed">
                {termsContent.section11.body}
              </p>
            </div>
          </div>

          {/* Section 12 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              12. {termsContent.section12.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C9D1D9] leading-relaxed mb-4">
                {termsContent.section12.body}
              </p>
              <div className="rounded-2xl border border-[#F0B90B]/20 bg-[#F0B90B]/10 p-4 mt-4">
                <p className="text-[#F0B90B] text-sm font-medium">
                  {termsContent.section12.agreement}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-24 md:h-28" />
      </div>
    </div>
  );
}
