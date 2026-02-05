import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Coins, 
  FileText, 
  Users, 
  ArrowRight, 
  Shield, 
  TrendingUp,
  Wallet,
  Activity,
  Target,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID } from '@/lib/number';

export default function MemberDashboardPage() {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { user } = useAuth();
  
  const safeLang = lang === "en" ? "en" : "id";
  
  // State for referral bonus stats
  const [referralStats, setReferralStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Fetch referral bonus stats
  useEffect(() => {
    const fetchReferralStats = async () => {
      if (!user) return;
      
      setIsLoadingStats(true);
      try {
        const { data, error } = await supabase.rpc('member_get_dashboard_stats' as any);
        
        if (error) {
          console.error('Error fetching referral stats:', error);
        } else {
          setReferralStats(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchReferralStats();
  }, [user]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E2329] to-[#2B3139] border-b border-[#2B3139]/50 px-4 py-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F0B90B] to-[#F0B90B]/80 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Member</h1>
              <p className="text-slate-400 text-sm">
                {user?.email || "-"}
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F0B90B]">1,250</div>
              <div className="text-xs text-slate-400">TPC Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">12</div>
              <div className="text-xs text-slate-400">Referrals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">5</div>
              <div className="text-xs text-slate-400">Invoices</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Buy TPC Card */}
          <Card className="bg-gradient-to-br from-[#F0B90B]/20 to-[#F0B90B]/5 border-[#F0B90B]/30 hover:border-[#F0B90B]/50 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#F0B90B]/20 rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5 text-[#F0B90B]" />
                </div>
                <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                  Hot
                </Badge>
              </div>
              <CardTitle className="text-white text-lg">Beli TPC</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-slate-400 text-sm mb-4">Investasi token TPC sekarang</p>
              <Button
                onClick={handleBuyTPC}
                className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium"
                size="sm"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                Beli Sekarang
              </Button>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                  Ready
                </Badge>
              </div>
              <CardTitle className="text-white text-lg">Wallet</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-slate-400 text-sm mb-4">Kelola saldo & transaksi</p>
              <Button
                onClick={() => navigate(`/${safeLang}/member/wallet`)}
                variant="outline"
                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                size="sm"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                Lihat Wallet
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Referral Bonus Stats Card */}
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Bonus Referral</CardTitle>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Active
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingStats ? (
                <div className="animate-pulse">
                  <div className="h-2 bg-green-500/30 rounded-full"></div>
                  <p className="text-center text-green-400">Memuat data...</p>
                </div>
              ) : referralStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {formatNumberID(referralStats.total_referral_bonus_earned || 0)}
                      </div>
                      <p className="text-sm text-green-300">Total Bonus Didapat</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {formatNumberID(referralStats.total_referral_bonus_withdrawn || 0)}
                      </div>
                      <p className="text-sm text-blue-300">Total Bonus Diambil</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-400">
                        {formatNumberID(referralStats.total_referral_bonus_available || 0)}
                      </div>
                      <p className="text-sm text-amber-300">Bonus Tersedia</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-green-500/30">
                    <p className="text-sm text-green-300 text-center">
                      <span className="font-semibold">Catatan:</span> Bonus hanya diberikan untuk direct sponsor (1 level). 
                      Bonus diproses saat invoice berstatus <strong>PAID</strong> atau <strong>APPROVED</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg">Data Bonus Tidak Tersedia</p>
                  <p className="text-sm">Silakan hubungi admin untuk informasi lebih lanjut.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Invoice Card */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-green-500 text-xs">5 Aktif</span>
              </div>
              <CardTitle className="text-white text-base">Invoice</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-slate-400 text-sm mb-3">Riwayat pembelian</p>
              <Button
                onClick={handleInvoices}
                variant="ghost"
                className="w-full text-green-500 hover:bg-green-500/10"
                size="sm"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                Lihat
              </Button>
            </CardContent>
          </Card>

          {/* Referral Card */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-purple-500 text-xs">12 Total</span>
              </div>
              <CardTitle className="text-white text-base">Referral</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-slate-400 text-sm mb-3">Kelola referral</p>
              <Button
                onClick={handleReferrals}
                variant="ghost"
                className="w-full text-purple-500 hover:bg-purple-500/10"
                size="sm"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                Kelola
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="bg-gradient-to-r from-[#1E2329] to-[#2B3139] border-[#2B3139]/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-[#F0B90B]" />
              Progress Target
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Investment Goal</span>
                <span className="text-white font-medium">62.5%</span>
              </div>
              <Progress value={62.5} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>2,500,000 / 4,000,000 IDR</span>
                <span>1,250 / 2,000 TPC</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Referral Target</span>
                <span className="text-white font-medium">60%</span>
              </div>
              <Progress value={60} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>12 / 20 Referrals</span>
                <span>Q1 2024 Goal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Aktivitas Terakhir
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-500/10"
                onClick={() => navigate(`/${safeLang}/member/wallet`)}
              >
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#2B3139]/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Pembelian TPC</div>
                  <div className="text-slate-400 text-xs">2 hari yang lalu</div>
                </div>
              </div>
              <div className="text-green-500 text-sm">+500 TPC</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#2B3139]/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Referral Baru</div>
                  <div className="text-slate-400 text-xs">5 hari yang lalu</div>
                </div>
              </div>
              <div className="text-blue-500 text-sm">+25 TPC</div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Info */}
        <div className="grid grid-cols-1 gap-4">
          {/* Account Status */}
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-white font-semibold">Status Akun</div>
                    <div className="text-green-400 text-sm">Verified Member</div>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  Aktif
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Important Info */}
          <Card className="bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Tips Investasi</h3>
                  <p className="text-yellow-200 text-sm leading-relaxed">
                    Diversifikasi portfolio Anda dengan investasi berkala untuk hasil optimal. 
                    <span className="block mt-1">Risiko ditanggung masing-masing.</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
