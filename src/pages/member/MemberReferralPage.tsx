import { useEffect, useState } from 'react';
import { Users, Copy, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Clock, Share2, ExternalLink, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID } from '@/lib/number';
import { useReferralNetwork } from '@/hooks/useReferralNetwork';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ReferralStatCard } from '@/components/member/referrals/ReferralStatCard';
import { ReferralTabsHeader } from '@/components/member/referrals/ReferralTabsHeader';
import { ReferralNodeRow } from '@/components/member/referrals/ReferralNodeRow';

export default function MemberReferralPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [referralCode] = useState(profile?.member_code || user?.user_metadata?.referral_code || 'TPC-GLOBAL');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tree');
  const [searchValue, setSearchValue] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [referralSummary, setReferralSummary] = useState({
    totalDownline: 0,
    downlineAktif: 0,
    downlineBeliTPC: 0,
    totalCommissionEarned: 0,
    totalWithdrawn: 0,
    totalPendingWithdraw: 0,
    saldoTersedia: 0
  });

  // Fetch referral network data
  const { data: referralNetwork } = useReferralNetwork(referralCode);

  const referralLink = `${window.location.origin}/id/buytpc?ref=${referralCode}`;

  useEffect(() => {
    const calculateReferralSummary = async () => {
      if (!referralNetwork || !referralCode) return;

      try {
        setIsLoading(true);

        // Get all downline emails from referral network
        const downlineEmails = new Set<string>();
        referralNetwork.forEach(node => {
          if (node.email) {
            downlineEmails.add(node.email);
          }
        });

        // Fetch invoices for all downlines
        const { data: downlineInvoices, error: invoicesError } = await supabase
          .from('invoices')
          .select('email, tpc_amount, status')
          .in('email', Array.from(downlineEmails))
          .eq('status', 'PAID');

        if (invoicesError) throw invoicesError;

        // Calculate downline stats
        const downlineEmailsWithInvoices = new Set<string>();
        let totalTPCPurchased = 0;

        downlineInvoices?.forEach(invoice => {
          downlineEmailsWithInvoices.add(invoice.email);
          totalTPCPurchased += Number(invoice.tpc_amount) || 0;
        });

        // Calculate commission (5% of TPC purchased by downlines)
        const commissionRate = 0.05; // 5%
        const totalCommissionEarned = totalTPCPurchased * commissionRate;

        // For now, assume no withdrawals (no withdrawals table yet)
        const totalWithdrawn = 0;
        const totalPendingWithdraw = 0;
        const saldoTersedia = Math.max(0, totalCommissionEarned - totalWithdrawn - totalPendingWithdraw);

        setReferralSummary({
          totalDownline: downlineEmails.size,
          downlineAktif: downlineEmailsWithInvoices.size,
          downlineBeliTPC: downlineEmailsWithInvoices.size,
          totalCommissionEarned,
          totalWithdrawn,
          totalPendingWithdraw,
          saldoTersedia
        });

      } catch (error) {
        console.error('Error calculating referral summary:', error);
        toast({ 
          title: 'Gagal memuat data referral', 
          variant: 'destructive' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    calculateReferralSummary();
  }, [referralNetwork, referralCode, toast]);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: 'Kode referral disalin!' });
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Link referral disalin!' });
  };

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
              
              <div className="flex gap-2">
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-[#1F2A33] text-white hover:bg-[#F0B90B]/10 hover:border-[#F0B90B]/50">
                      <Share2 className="h-4 w-4 mr-2" />
                      Bagikan Kode
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1E2329] border-[#2B3139] text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Bagikan Kode Referral</DialogTitle>
                      <DialogDescription className="text-[#848E9C]">
                        Bagikan kode referral Anda untuk mendapatkan komisi
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-[#848E9C] mb-2 block">Kode Referral</label>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={referralCode}
                            className="flex-1 bg-[#11161C] border border-[#2B3139] rounded-lg px-3 py-2 text-white font-mono"
                          />
                          <Button onClick={handleCopyReferralCode} variant="outline" className="border-[#1F2A33] hover:bg-[#F0B90B]/10">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-[#848E9C] mb-2 block">Link Referral</label>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={referralLink}
                            className="flex-1 bg-[#11161C] border border-[#2B3139] rounded-lg px-3 py-2 text-white text-sm"
                          />
                          <Button onClick={handleCopyReferralLink} variant="outline" className="border-[#1F2A33] hover:bg-[#F0B90B]/10">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button onClick={handleCopyReferralLink} className="bg-[#F0B90B] hover:bg-[#F8D56B] text-black">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Salin Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReferralStatCard
            title="Total Downline"
            value={isLoading ? '...' : formatNumberID(referralSummary.totalDownline)}
            icon={Users}
            variant="blue"
            isLoading={isLoading}
          />
          <ReferralStatCard
            title="Downline Aktif"
            value={isLoading ? '...' : formatNumberID(referralSummary.downlineAktif)}
            subValue="pernah beli TPC"
            icon={TrendingUp}
            variant="emerald"
            isLoading={isLoading}
          />
          <ReferralStatCard
            title="Total Komisi"
            value={isLoading ? '...' : formatNumberID(referralSummary.totalCommissionEarned)}
            subValue="TPC"
            icon={ArrowUpRight}
            variant="gold"
            isLoading={isLoading}
          />
          <ReferralStatCard
            title="Saldo Tersedia"
            value={isLoading ? '...' : formatNumberID(referralSummary.saldoTersedia)}
            subValue="TPC"
            icon={Wallet}
            variant="blue"
            isLoading={isLoading}
          />
        </div>

        {/* Tabs and Content */}
        <Card className="bg-[#11161C] border-[#1F2A33] rounded-2xl overflow-hidden">
          <ReferralTabsHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            levelFilter={levelFilter}
            onLevelFilterChange={setLevelFilter}
          />

          <CardContent className="p-0">
            {activeTab === 'tree' && (
              <div className="p-4 space-y-2">
                {referralNetwork && referralNetwork.length > 0 ? (
                  referralNetwork.map((node, index) => (
                    <ReferralNodeRow
                      key={`${node.email}-${index}`}
                      node={{
                        email: node.email,
                        member_code: node.member_code,
                        level: node.level,
                        isActive: false, // Will be determined by checking invoices
                        hasChildren: false // Will be determined by checking network structure
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-[#848E9C] mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Belum ada referral di jaringan kamu</h3>
                    <p className="text-[#848E9C] text-sm mb-4">
                      Bagikan kode referral untuk mulai mengembangkan jaringan
                    </p>
                    <Button onClick={() => setShareDialogOpen(true)} className="bg-[#F0B90B] hover:bg-[#F8D56B] text-black">
                      <Share2 className="h-4 w-4 mr-2" />
                      Bagikan Kode Referral
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'level' && (
              <div className="p-4">
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-[#848E9C] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">View Per Level</h3>
                  <p className="text-[#848E9C] text-sm">
                    Grup berdasarkan level akan segera tersedia
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="p-4">
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-[#848E9C] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Aktivitas Referral</h3>
                  <p className="text-[#848E9C] text-sm">
                    Log aktivitas akan segera tersedia
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
