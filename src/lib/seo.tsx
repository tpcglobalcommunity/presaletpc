import { Helmet } from 'react-helmet-async';

export const baseUrl = 'https://tpcglobal.io';

export const defaultTitle = 'TPC Global - Platform Edukasi Kripto Terpercaya';
export const defaultDescription = 'TPC Global adalah platform edukasi kripto dengan transparansi penuh, wallet terverifikasi, dan perlindungan anti-scam. Bergabung dengan ekosistem TPC sekarang.';

export interface SEOData {
  title: string;
  description: string;
  path: string;
}

export const seoRoutes: Record<string, SEOData> = {
  '/id/': {
    title: 'TPC Global - Platform Edukasi Kripto Terpercaya',
    description: 'TPC Global adalah platform edukasi kripto dengan transparansi penuh, wallet terverifikasi, dan perlindungan anti-scam. Bergabung dengan ekosistem TPC sekarang.',
    path: '/id/'
  },
  '/id/buytpc': {
    title: 'Beli TPC - Bergabung dengan Ekosistem TPC Global',
    description: 'Beli token TPC sekarang dengan harga presale terbaik. Proses aman, transparan, dan edukasi-only. Bergabung dengan komunitas TPC Global hari ini.',
    path: '/id/buytpc'
  },
  '/id/login': {
    title: 'Login - Member Area TPC Global',
    description: 'Masuk ke member area TPC Global untuk mengelola investasi TPC Anda. Dashboard lengkap dengan tracking dan riwayat transaksi.',
    path: '/id/login'
  },
  '/id/market': {
    title: 'Marketplace TPC Global - Jual Beli Aman',
    description: 'Marketplace TPC Global untuk jual beli token TPC dengan aman. Harga transparan, wallet terverifikasi, tanpa resiko penipuan.',
    path: '/id/market'
  },
  '/id/transparansi': {
    title: 'Transparansi TPC Global - Laporan Terbuka',
    description: 'Laporan transparansi penuh dari TPC Global. Wallet terverifikasi, laporan keuangan, dan bukti komitmen transparansi.',
    path: '/id/transparansi'
  },
  '/id/anti-scam': {
    title: 'Anti-Scam TPC Global - Perlindungan Investor',
    description: 'Panduan anti-scam TPC Global. Pelajari cara menghindari penipuan kripto dan mengenali wallet resmi TPC yang terverifikasi.',
    path: '/id/anti-scam'
  },
  '/id/edukasi': {
    title: 'Edukasi Kripto TPC Global - Belajar Aman',
    description: 'Platform edukasi kripto TPC Global. Pelajari dasar-dasar investasi kripto dengan aman, edukasi-only tanpa jaminan profit.',
    path: '/id/edukasi'
  },
  '/id/whitepaper': {
    title: 'Whitepaper TPC Global - Dokumen Resmi',
    description: 'Whitepaper resmi TPC Global. Pelajari visi, misi, dan teknologi di balik platform edukasi kripto terpercaya ini.',
    path: '/id/whitepaper'
  },
  '/id/dao': {
    title: 'DAO TPC Global - Tata Kelola Komunitas',
    description: 'Struktur DAO TPC Global untuk tata kelola komunitas yang transparan dan demokratis. Ikut berpartisipasi dalam pengembangan ekosistem.',
    path: '/id/dao'
  },
  '/id/faq': {
    title: 'FAQ TPC Global - Pertanyaan Umum',
    description: 'Pertanyaan umum tentang TPC Global. Temukan jawaban tentang cara kerja platform, keamanan, dan panduan investasi TPC.',
    path: '/id/faq'
  },
  '/id/verified-coordinators': {
    title: 'Koordinator Terverifikasi TPC Global',
    description: 'Daftar koordinator TPC Global yang terverifikasi. Pastikan Anda hanya bertransaksi dengan koordinator resmi yang terdaftar.',
    path: '/id/verified-coordinators'
  },
  '/id/chapters': {
    title: 'Chapters TPC Global - Komunitas Lokal',
    description: 'Temukan komunitas TPC Global di daerah Anda. Chapters lokal untuk edukasi dan networking sesama anggota TPC.',
    path: '/id/chapters'
  },
  '/id/syarat-ketentuan': {
    title: 'Syarat & Ketentuan TPC Global',
    description: 'Syarat dan ketentuan resmi TPC Global. Baca aturan main, kebijakan privasi, dan hak kewajiban anggota komunitas.',
    path: '/id/syarat-ketentuan'
  },
  '/id/kebijakan-privasi': {
    title: 'Kebijakan Privasi TPC Global',
    description: 'Kebijakan privasi TPC Global. Kami melindungi data pribadi Anda dengan standar keamanan tertinggi dan transparansi penuh.',
    path: '/id/kebijakan-privasi'
  }
};

export function buildTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
}

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  imageUrl?: string;
}

export function SEO({ title, description, path, imageUrl }: SEOProps) {
  const seoTitle = buildTitle(title);
  const seoDescription = description || defaultDescription;
  const seoUrl = `${baseUrl}${path || '/'}`;
  const seoImage = imageUrl || `${baseUrl}/og.png`;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TPC Global" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional */}
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
}
