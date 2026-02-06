import { useNavigate } from 'react-router-dom';
import { usePublicPath } from '@/lib/publicPath';

/**
 * Public 404 Page - Safe fallback for invalid public routes
 * 
 * - Simple, safe UI
 * - No redirects to login
 * - No member/admin imports
 * - Bilingual support
 */
export function PublicNotFoundPage() {
  const navigate = useNavigate();
  const { lang } = usePublicPath();

  const handleGoHome = () => {
    navigate(`/${lang}/`);
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl font-bold text-[#F0B90B] mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {lang === 'en' ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
          </h1>
          <p className="text-gray-400 mb-8">
            {lang === 'en' 
              ? 'The page you are looking for does not exist or has been moved.'
              : 'Halaman yang Anda cari tidak ada atau telah dipindahkan.'
            }
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {lang === 'en' ? 'Go Home' : 'Kembali ke Beranda'}
          </button>
          
          <div className="text-sm text-gray-500">
            {lang === 'en' ? 'Or try searching for:' : 'Atau coba cari:'}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => navigate(`/${lang}/market`)}
              className="text-[#F0B90B] hover:text-[#F0B90B]/80 transition-colors"
            >
              {lang === 'en' ? 'Market' : 'Pasar'}
            </button>
            <button
              onClick={() => navigate(`/${lang}/presale`)}
              className="text-[#F0B90B] hover:text-[#F0B90B]/80 transition-colors"
            >
              {lang === 'en' ? 'Presale' : 'Prapenjualan'}
            </button>
            <button
              onClick={() => navigate(`/${lang}/buytpc`)}
              className="text-[#F0B90B] hover:text-[#F0B90B]/80 transition-colors"
            >
              {lang === 'en' ? 'Buy TPC' : 'Beli TPC'}
            </button>
            <button
              onClick={() => navigate(`/${lang}/faq`)}
              className="text-[#F0B90B] hover:text-[#F0B90B]/80 transition-colors"
            >
              FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
