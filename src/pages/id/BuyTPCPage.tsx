import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { handleGatedActionLogin } from '@/lib/authReturnTo';
import tpcLogo from '@/assets/tpc.png';
import { ArrowRight, Users, Shield, Lock, ExternalLink } from 'lucide-react';

export default function BuyTPCPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  const { user } = useAuth();
  
  // Handle referral code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('tpc_ref_code', refCode);
    }
  }, []);

  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-96 md:h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="mb-6 md:mb-8">
              <img
                src={tpcLogo}
                alt="TPC Logo"
                className="w-20 h-20 md:w-32 md:h-32 rounded-2xl object-contain drop-shadow-lg mx-auto"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              {t('Buy TPC', 'Beli TPC')}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto">
              {t(
                'Join TPC ecosystem and secure your tokens at best presale price',
                'Bergabung dengan ekosistem TPC dan dapatkan token dengan harga presale terbaik'
              )}
            </p>
          </div>

          {/* Lock Notice */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-xl border border-amber-500/30 text-white overflow-hidden shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <Lock className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
                {t('buytpc:lockTitle', 'buytpc:lockTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="text-center space-y-4 md:space-y-6">
                <div className="text-lg md:text-xl text-amber-400 font-semibold mb-4">
                  {t('buytpc:lockDesc', 'buytpc:lockDesc')}
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Shield className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm md:text-base">
                      {t(
                        'After login, you can create invoices, upload proof, and track status.',
                        'Setelah login, kita bisa buat invoice, upload bukti, dan pantau status transaksi.'
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm md:text-base">
                      {t(
                        'Full transaction history and wallet management available.',
                        'History transaksi lengkap dan manajemen wallet tersedia.'
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-4 md:pt-6 border-t border-slate-700/30">
                  {user ? (
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-4 md:py-6 text-lg md:text-xl rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => navigate(`/${lang}/member`)}
                    >
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        <span>{t('buytpc:lockCtaMember', 'buytpc:lockCtaMember')}</span>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-4 md:py-6 text-lg md:text-xl rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => handleGatedActionLogin(navigate, 'id', '/id/buytpc')}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                        <span>{t('buytpc:lockCtaLogin', 'buytpc:lockCtaLogin')}</span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">Stage 1</div>
                <div className="text-lg md:text-xl text-gray-300 mb-2">$0.001</div>
                <div className="text-sm md:text-base text-gray-400">
                  {t('Current Price', 'Harga Saat Ini')}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">300M TPC</div>
                <div className="text-lg md:text-xl text-gray-300 mb-2">{t('Total Supply', 'Total Supply')}</div>
                <div className="text-sm md:text-base text-gray-400">
                  {t('Presale Allocation', 'Alokasi Presale')}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">1B TPC</div>
                <div className="text-lg md:text-xl text-gray-300 mb-2">{t('Total Supply', 'Total Supply')}</div>
                <div className="text-sm md:text-base text-gray-400">
                  {t('Fixed Supply', 'Supply Tetap')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold">
                {t('Why Buy in Member Area?', 'Mengapa Beli di Member Area?')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white font-semibold">
                      {t('Secure Transactions', 'Transaksi Aman')}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {t(
                      'All purchases are recorded on blockchain with full transparency.',
                      'Semua pembelian dicatat di blockchain dengan transparansi penuh.'
                    )}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-white font-semibold">
                      {t('Member Dashboard', 'Dashboard Member')}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {t(
                      'Track your purchase history and manage your tokens.',
                      'Pantau history pembelian dan kelola token Anda.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Official Links */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white overflow-hidden shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4">
                  {t('Official Resources', 'Sumber Resmi')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800"
                    onClick={() => window.open(`/${lang}/whitepaper`, '_blank')}
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('Whitepaper', 'Whitepaper')}</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800"
                    onClick={() => window.open(`/${lang}/faq`, '_blank')}
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('FAQ', 'FAQ')}</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <div className="mt-8">
            <div className="bg-slate-900/30 rounded-lg p-4 md:p-6 border border-slate-700/30">
              <p className="text-xs md:text-sm text-gray-400 text-center leading-relaxed">
                TPC adalah token utilitas untuk ekosistem edukasi dan komunitas. Bukan produk investasi dan tidak menjanjikan imbal hasil. Pembelian token memiliki risiko. Informasi yang disampaikan bukan nasihat keuangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
