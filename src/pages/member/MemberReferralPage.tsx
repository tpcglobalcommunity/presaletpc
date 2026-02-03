import { useEffect, useState } from 'react';
import { Users, Copy, TrendingUp, Wallet, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID } from '@/lib/number';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ReferralStats {
  level: number;
  count: number;
  created_at: string;
}

export default function MemberReferralPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState<ReferralStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const referralLink = `${window.location.origin}/id/buytpc?ref=${referralCode}`;

  // Calculate total downline from stats
  const totalDownline = referralStats.reduce((sum, stat) => sum + stat.count, 0);

  // Fetch user profile and referral stats
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch user profile to get referral code
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('member_code')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profile?.member_code) {
          setReferralCode(profile.member_code);
        }

        // Fetch referral stats
        const { data, error } = await supabase.rpc('get_referral_tree_stats');

        if (error) {
          console.error('Error fetching referral stats:', error);
          toast({
            title: 'Error',
            description: 'Gagal memuat data referral',
            variant: 'destructive'
          });
        } else {
          setReferralStats(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: 'Kode referral disalin!' });
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Link referral disalin!' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Strip */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0B90B]/10 via-transparent to-transparent h-1" />
        
        <div className="relative bg-[#1E2329]/80 backdrop-blur-sm border-b border-[#2B3139] px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">Referral</h1>
                  <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                    10 Level
                  </Badge>
                </div>
                <p className="text-[#848E9C] text-sm">
                  Pantau jaringan 10 level dan komisi kamu
                </p>
              </div>
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#F0B90B] hover:bg-[#F8D56B] text-white">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1E2329] border-[#2B3139] text-white">
                  <DialogHeader>
                    <DialogTitle>Share Referral</DialogTitle>
                    <DialogDescription>
                      Bagikan kode atau link referral kamu
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[#848E9C]">Kode Referral</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={referralCode}
                          readOnly
                          className="flex-1 px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-white"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyReferralCode}
                          className="border-[#2B3139] text-[#848E9C] hover:text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-[#848E9C]">Link Referral</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={referralLink}
                          readOnly
                          className="flex-1 px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-white text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyReferralLink}
                          className="border-[#2B3139] text-[#848E9C] hover:text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#848E9C] text-base">Total Downline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#F0B90B]/20 rounded-lg">
                  <Users className="h-6 w-6 text-[#F0B90B]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatNumberID(totalDownline)}</p>
                  <p className="text-xs text-[#848E9C]">Total referral</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#848E9C] text-base">Kode Referral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#10B981]/20 rounded-lg">
                  <Copy className="h-6 w-6 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-white">{referralCode}</p>
                  <p className="text-xs text-[#848E9C]">Kode unik kamu</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyReferralCode}
                  className="border-[#2B3139] text-[#848E9C] hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#848E9C] text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#059669]/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-[#059669]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">Aktif</p>
                  <p className="text-xs text-[#848E9C]">Sistem referral aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Stats by Level */}
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Statistik Downline per Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referralStats.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-[#848E9C] mb-2">Belum ada downline</p>
                <p className="text-sm text-[#848E9C]">
                  Mulai bagikan kode referral kamu untuk mendapatkan downline
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {referralStats.map((stat) => (
                  <div
                    key={stat.level}
                    className="flex items-center justify-between p-3 bg-[#0B0E11] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F0B90B]/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-[#F0B90B]">
                          {stat.level}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Level {stat.level}</p>
                        <p className="text-xs text-[#848E9C]">
                          {new Date(stat.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#F0B90B]">
                        {formatNumberID(stat.count)}
                      </p>
                      <p className="text-xs text-[#848E9C]">orang</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
