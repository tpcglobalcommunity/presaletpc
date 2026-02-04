import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Coins, FileText, Users, ArrowRight, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MemberDashboardPage() {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { user } = useAuth();
  
  const safeLang = lang === "en" ? "en" : "id";

  const handleBuyTPC = () => {
    navigate(`/${safeLang}/buytpc`);
  };

  const handleInvoices = () => {
    navigate(`/${safeLang}/member/invoices`);
  };

  const handleReferrals = () => {
    navigate(`/${safeLang}/member/referrals`);
  };

  return (
    <div className="mobile-container pt-6 pb-28 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Dashboard Member</h1>
          <p className="text-slate-400">
            {user?.email || "-"}
          </p>
        </div>

        {/* Primary Action Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Buy TPC Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Beli TPC</h3>
                  <p className="text-sm text-slate-400">Beli token TPC sekarang</p>
                </div>
              </div>
              <Button
                onClick={handleBuyTPC}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                size="sm"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Invoice Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Invoice Saya</h3>
                  <p className="text-sm text-slate-400">Lihat riwayat pembelian</p>
                </div>
              </div>
              <Button
                onClick={handleInvoices}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                size="sm"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Referral Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Referral</h3>
                  <p className="text-sm text-slate-400">Kelola referral Anda</p>
                </div>
              </div>
              <Button
                onClick={handleReferrals}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                size="sm"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-yellow-500" />
            Status Akun
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <span className="text-green-500 font-medium">Aktif</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Saldo TPC</span>
              <span className="text-slate-300 text-sm">Akan tampil setelah sinkronisasi wallet</span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium mb-2">Penting</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Edukasi saja, bukan saran finansial. Risiko ditanggung masing-masing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
