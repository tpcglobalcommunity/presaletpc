import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { TrendingUp, Shield, Coins, ArrowRight, Info } from 'lucide-react';

// Market page copy
const marketCopy = {
  id: {
    title: 'Market',
    subtitle: 'Segera hadir',
    whatYouWillSee: 'Apa yang akan Anda lihat',
    tokenInfo: 'Informasi token',
    officialLinks: 'Tautan resmi',
    transparencyVerification: 'Transparansi & verifikasi',
    safetyFirst: 'Keamanan terlebih dahulu',
    safetyDesc: 'Pelajari cara menghindari penipuan dan melindungi aset Anda.',
    presaleAccess: 'Akses presale',
    presaleDesc: 'Bergabung dengan penjualan token tahap awal.',
    disclaimer: 'Informasi ini bersifat edukasi. Tidak ada jaminan keuntungan.'
  },
  en: {
    title: 'Market',
    subtitle: 'Coming soon',
    whatYouWillSee: 'What you will see',
    tokenInfo: 'Token information',
    officialLinks: 'Official links',
    transparencyVerification: 'Transparency & verification',
    safetyFirst: 'Safety first',
    safetyDesc: 'Learn how to avoid scams and protect your assets.',
    presaleAccess: 'Presale access',
    presaleDesc: 'Join the early stage token sale.',
    disclaimer: 'Educational information only. No profit guarantees.'
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border border-[#F0B90B]/25">
              <TrendingUp className="h-10 w-10 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">{c.title}</h1>
            <p className="text-xl text-muted-foreground">{c.subtitle}</p>
          </div>

          {/* Content Cards */}
          <div className="space-y-8 mb-12">
            {/* What You Will See */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{c.whatYouWillSee}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{c.tokenInfo}</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive token details and specifications</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{c.officialLinks}</h3>
                  <p className="text-sm text-muted-foreground">Verified official channels and resources</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{c.transparencyVerification}</h3>
                  <p className="text-sm text-muted-foreground">Public verification and transparency features</p>
                </div>
              </div>
            </div>

            {/* Safety First */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-3">{c.safetyFirst}</h2>
                  <p className="text-muted-foreground mb-4">{c.safetyDesc}</p>
                  <button
                    onClick={() => navigate(`/${safeLang}/anti-scam`)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    {c.safetyFirst}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Presale Access */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Coins className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-3">{c.presaleAccess}</h2>
                  <p className="text-muted-foreground mb-4">{c.presaleDesc}</p>
                  <button
                    onClick={() => navigate(`/${safeLang}/presale`)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Coins className="h-5 w-5" />
                    {c.presaleAccess}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">{c.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
