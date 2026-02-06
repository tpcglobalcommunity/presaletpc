import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Coins, ArrowRight, Shield, Clock, Users, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

// Presale page copy
const presaleCopy = {
  id: {
    title: 'Presale',
    subtitle: 'Segera hadir',
    supporting: 'Program penjualan token tahap awal akan segera tersedia.',
    whatYouWillGet: 'Apa yang akan Anda dapatkan',
    earlyAccess: 'Akses awal ke token',
    earlyAccessDesc: 'Dapatkan token dengan harga khusus peserta awal.',
    tokenUtility: 'Utilitas token',
    tokenUtilityDesc: 'Pelajari kegunaan dan manfaat token dalam ekosistem.',
    communityAccess: 'Akses komunitas',
    communityAccessDesc: 'Bergabung dengan komunitas eksklusif TPC.',
    safetyFirst: 'Keamanan & Verifikasi',
    safetyDesc: 'Semua transaksi dilindungi dan dapat diverifikasi.',
    antiScam: 'Anti-Scam',
    disclaimer: 'Informasi ini bersifat edukasi dan tidak merupakan ajakan investasi atau jaminan keuntungan.'
  },
  en: {
    title: 'Presale',
    subtitle: 'Coming soon',
    supporting: 'Early stage token sale will be available soon.',
    whatYouWillGet: 'What you will get',
    earlyAccess: 'Early access to token',
    earlyAccessDesc: 'Get tokens at special early pricing.',
    tokenUtility: 'Token utility',
    tokenUtilityDesc: 'Learn about token utility and benefits in the ecosystem.',
    communityAccess: 'Community access',
    communityAccessDesc: 'Join the exclusive TPC community.',
    safetyFirst: 'Safety & Verification',
    safetyDesc: 'All transactions are protected and verifiable.',
    antiScam: 'Anti-Scam',
    disclaimer: 'This information is for educational purposes only and does not constitute investment advice or profit guarantees.'
  }
};

export default function PresalePage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict lang validation: only "en" or "id" allowed
  const safeLang = lang === 'en' ? 'en' : 'id';
  const c = presaleCopy[safeLang];

  return (
    <>
      <Helmet>
        <title>{c.title} - TPC Global</title>
        <meta name="description" content={`TPC Global Presale - ${c.subtitle}`} />
      </Helmet>
      
      <div className="min-h-screen bg-[#0B0E11]">
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          {/* HERO SECTION */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/20 flex items-center justify-center border border-[#F0B90B]/30 backdrop-blur-sm">
              <Coins className="h-12 w-12 text-[#F0B90B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">{c.title}</h1>
            <p className="text-2xl text-[#F0B90B] font-medium mb-3">{c.subtitle}</p>
            <p className="text-[#848E9C] text-lg max-w-2xl mx-auto">{c.supporting}</p>
          </div>

          {/* INFORMATION CARDS */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">{c.whatYouWillGet}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Early Access */}
              <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-[#F0B90B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">{c.earlyAccess}</h3>
                <p className="text-[#848E9C] text-sm leading-relaxed text-center">
                  {c.earlyAccessDesc}
                </p>
              </div>

              {/* Token Utility */}
              <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-[#F0B90B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">{c.tokenUtility}</h3>
                <p className="text-[#848E9C] text-sm leading-relaxed text-center">
                  {c.tokenUtilityDesc}
                </p>
              </div>

              {/* Community Access */}
              <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 hover:border-[#F0B90B]/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-[#F0B90B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 text-center">{c.communityAccess}</h3>
                <p className="text-[#848E9C] text-sm leading-relaxed text-center">
                  {c.communityAccessDesc}
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
                <h2 className="text-2xl font-bold text-white mb-3">{c.safetyFirst}</h2>
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

          {/* BENEFITS HIGHLIGHTS */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-[#F0B90B]" />
                </div>
                <h3 className="text-lg font-semibold text-white">{c.earlyAccess}</h3>
              </div>
              <ul className="space-y-2 text-sm text-[#848E9C]">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#F0B90B]" />
                  <span>Pricing exclusive to early participants</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#F0B90B]" />
                  <span>Limited allocation available</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#F0B90B]" />
                  <span>Priority support access</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#F0B0B]" />
                </div>
                <h3 className="text-lg font-semibold text-white">{c.communityAccess}</h3>
              </div>
              <ul className="space-y-2 text-sm text-[#848E9C]">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#F0B90B]" />
                  <span>Early community member benefits</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#F0B90B]" />
                  <span>Exclusive content and updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#F0B90B]" />
                  <span>Direct team communication</span>
                </li>
              </ul>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="bg-[#1C2128] border border-[#30363D]/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#848E9C] leading-relaxed">{c.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
