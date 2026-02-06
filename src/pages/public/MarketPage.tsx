import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { TrendingUp, Shield, Coins, ArrowRight, Info, Eye, Globe } from 'lucide-react';

// Market page copy
const marketCopy = {
  id: {
    title: 'Market',
    subtitle: 'Segera hadir',
    supporting: 'Halaman ini akan menampilkan informasi pasar resmi saat tersedia.',
    whatYouWillSee: 'Apa yang akan Anda lihat',
    tokenInfo: 'Detail token, utilitas, dan suplai resmi.',
    officialLinks: 'Tautan resmi ke sumber pasar yang terverifikasi.',
    marketStatus: 'Status ketersediaan pasar dan pengumuman resmi.',
    safetyVerification: 'Keamanan & Verifikasi',
    safetyDesc: 'Selalu verifikasi informasi melalui sumber resmi.',
    antiScam: 'Anti-Scam',
    guidance: 'Untuk informasi penawaran awal, kunjungi halaman presale.',
    presale: 'Presale',
    disclaimer: 'Informasi ini bersifat edukasi dan tidak merupakan ajakan atau jaminan keuntungan.'
  },
  en: {
    title: 'Market',
    subtitle: 'Coming soon',
    supporting: 'This page will display official market information when available.',
    whatYouWillSee: 'What you will see',
    tokenInfo: 'Token details, utility, and official supply.',
    officialLinks: 'Official links to verified market sources.',
    marketStatus: 'Market availability status and official announcements.',
    safetyVerification: 'Safety & Verification',
    safetyDesc: 'Always verify information through official sources.',
    antiScam: 'Anti-Scam',
    guidance: 'For early access information, visit the presale page.',
    presale: 'Presale',
    disclaimer: 'This information is for educational purposes only and does not constitute an offer or profit guarantee.'
  }
};

export default function MarketPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict lang validation: only "en" or "id" allowed
  const safeLang = lang === 'en' ? 'en' : 'id';
  const c = marketCopy[safeLang];

  return (
    <>
      <Helmet>
        <title>{c.title} - TPC Global</title>
        <meta name="description" content={`TPC Global Market - ${c.subtitle}`} />
      </Helmet>
      
      <div className="min-h-screen bg-[#0B0E11]">
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          {/* HERO SECTION */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/20 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm">
              <TrendingUp className="h-12 w-12 text-[#F0B90B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">{c.title}</h1>
            <p className="text-2xl text-[#F0B90B] font-medium mb-3">{c.subtitle}</p>
            <p className="text-[#848E9C] text-lg max-w-2xl mx-auto">{c.supporting}</p>
          </div>

          {/* INFORMATION CARDS */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">{c.whatYouWillSee}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Token Information */}
              <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <Info className="h-7 w-7 text-[#F0B90B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">{c.tokenInfo}</h3>
                <p className="text-[#848E9C] text-sm leading-relaxed text-center">
                  Comprehensive token details, utility information, and official supply data
                </p>
              </div>

              {/* Official Market Links */}
              <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <Globe className="h-7 w-7 text-[#F0B90B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">{c.officialLinks}</h3>
                <p className="text-[#848E9C] text-sm leading-relaxed text-center">
                  Verified market sources and official trading platform links
                </p>
              </div>

              {/* Market Status */}
              <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <Eye className="h-7 w-7 text-[#F0B90B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">{c.marketStatus}</h3>
                <p className="text-[#848E9C] text-sm leading-relaxed text-center">
                  Real-time availability status and official announcements
                </p>
              </div>
            </div>
          </div>

          {/* TRUST & SAFETY SECTION */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{c.safetyVerification}</h2>
                <p className="text-[#C9D1D9] text-lg mb-6">{c.safetyDesc}</p>
                <button
                  onClick={() => navigate(`/${safeLang}/anti-scam`)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium"
                >
                  <Shield className="h-5 w-5" />
                  {c.antiScam}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* NAVIGATION SECTION */}
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Coins className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{c.presale}</h2>
                <p className="text-[#C9D1D9] text-lg mb-6">{c.guidance}</p>
                <button
                  onClick={() => navigate(`/${safeLang}/presale`)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
                >
                  <Coins className="h-5 w-5" />
                  {c.presale}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="bg-[#1C2128] border border-[#30363D]/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#848E9C] leading-relaxed">{c.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
