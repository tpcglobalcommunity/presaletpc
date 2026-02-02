/**
 * SEO Helper for TPC Global
 */

const baseUrl = "https://tpcglobal.io";

const defaultTitle = "TPC Global - Ekosistem Edukasi Blockchain";
const defaultDescription = "TPC Global adalah ekosistem edukasi blockchain yang transparan, aman, dan terverifikasi. Bergabung dengan komunitas kami untuk pembelajaran crypto yang edukasi-only.";

interface SEOConfig {
  title: string;
  description: string;
  path: string;
}

const seoConfig: Record<string, SEOConfig> = {
  "/id": {
    title: "TPC Global - Ekosistem Edukasi Blockchain",
    description: "TPC Global adalah ekosistem edukasi blockchain yang transparan, aman, dan terverifikasi. Bergabung dengan komunitas kami untuk pembelajaran crypto.",
    path: "/id"
  },
  "/id/buytpc": {
    title: "Beli TPC - Bergabung dengan Ekosistem TPC Global",
    description: "Beli token TPC sekarang dengan harga presale terbaik. Proses aman, transparan, dan edukasi-only. Bergabung dengan komunitas TPC Global hari ini.",
    path: "/id/buytpc"
  },
  "/id/login": {
    title: "Login - Member Area TPC Global",
    description: "Masuk ke member area TPC Global untuk mengakses dashboard, riwayat transaksi, dan fitur eksklusif lainnya.",
    path: "/id/login"
  },
  "/id/market": {
    title: "Marketplace TPC Global",
    description: "Marketplace resmi TPC Global untuk jual beli token TPC dengan aman dan transparan. Harga real-time dan verifikasi wallet.",
    path: "/id/market"
  },
  "/id/transparansi": {
    title: "Transparansi - TPC Global",
    description: "Laporan transparansi lengkap TPC Global. Semua transaksi dan alokasi token dapat diverifikasi secara publik.",
    path: "/id/transparansi"
  },
  "/id/anti-scam": {
    title: "Anti-Scam - Keamanan TPC Global",
    description: "Panduan anti-scam resmi TPC Global. Pelajari cara mengenali dan menghindari penipuan crypto. Wallet terverifikasi hanya di sini.",
    path: "/id/anti-scam"
  },
  "/id/edukasi": {
    title: "Edukasi Blockchain - TPC Global",
    description: "Materi edukasi blockchain lengkap dari TPC Global. Belajar crypto dari dasar hingga lanjutan dengan pendekatan edukasi-only.",
    path: "/id/edukasi"
  },
  "/id/whitepaper": {
    title: "Whitepaper TPC Global",
    description: "Whitepaper lengkap TPC Global. Pelajari visi, misi, teknologi, dan roadmap proyek kami secara detail.",
    path: "/id/whitepaper"
  },
  "/id/dao": {
    title: "DAO - TPC Global",
    description: "Decentralized Autonomous Organization TPC Global. Ikut serta dalam pengambilan keputusan komunitas secara transparan.",
    path: "/id/dao"
  },
  "/id/faq": {
    title: "FAQ - TPC Global",
    description: "Frequently Asked Questions TPC Global. Temukan jawaban untuk pertanyaan umum tentang TPC, presale, dan keamanan.",
    path: "/id/faq"
  },
  "/id/verified-coordinators": {
    title: "Koordinator Terverifikasi - TPC Global",
    description: "Daftar resmi koordinator TPC Global yang terverifikasi. Hanya percaya pada wallet yang terdaftar di sini.",
    path: "/id/verified-coordinators"
  },
  "/id/chapters": {
    title: "Chapters - Komunitas TPC Global",
    description: "Temukan chapter TPC Global terdekat Anda. Bergabung dengan komunitas lokal untuk edukasi dan networking crypto.",
    path: "/id/chapters"
  },
  "/id/syarat-ketentuan": {
    title: "Syarat & Ketentuan - TPC Global",
    description: "Syarat dan ketentuan resmi TPC Global. Baca aturan main, kebijakan privasi, dan disclaimer lengkap.",
    path: "/id/syarat-ketentuan"
  },
  "/id/kebijakan-privasi": {
    title: "Kebijakan Privasi - TPC Global",
    description: "Kebijakan privasi TPC Global. Bagaimana kami melindungi data pribadi Anda sesuai regulasi yang berlaku.",
    path: "/id/kebijakan-privasi"
  }
};

export function buildTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
}

export function getSEOConfig(path: string): SEOConfig {
  return seoConfig[path] || {
    title: defaultTitle,
    description: defaultDescription,
    path
  };
}

export { baseUrl, defaultTitle, defaultDescription };
export type { SEOConfig };
