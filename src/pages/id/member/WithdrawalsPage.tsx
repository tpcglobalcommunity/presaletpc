import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle, Copy, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { callEdgeFunction } from '@/lib/edge';
import { formatDateID, formatNumberID, copyToClipboard, truncateWalletAddress, formatTPC } from '@/lib/utils';

interface CommissionSummary {
  total_earned: number;
  total_withdrawn: number;
  total_pending: number;
  total_available: number;
}

interface Withdrawal {
  id: string;
  amount_tpc: number;
  wallet_address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requested_at: string;
  processed_at?: string;
  tx_hash?: string;
  reject_reason?: string;
}

export default function WithdrawalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');

  const limit = 20;
  const offset = (currentPage - 1) * limit;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch commission summary
      const { data: summaryData, error: summaryError } = await supabase.rpc('member_get_commission_summary' as any);
      
      if (summaryError) {
        console.error('Error fetching summary:', summaryError);
      } else {
        setSummary(summaryData);
      }

      // Fetch user wallet address
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_address, tpc_wallet_address')
        .eq('user_id', user?.id)
        .single();

      if (!profileError && profileData) {
        const wallet = profileData.wallet_address || profileData.tpc_wallet_address || '';
        setWalletAddress(wallet);
      }

      // Fetch withdrawal history
      const { data: withdrawalsData, error: withdrawalsError } = await supabase.rpc('member_list_withdrawals' as any, {
        p_limit: limit,
        p_offset: offset
      });

      if (withdrawalsError) {
        console.error('Error fetching withdrawals:', withdrawalsError);
      } else {
        setWithdrawals(withdrawalsData || []);
        setTotalPages(Math.ceil((withdrawalsData?.length || 0) / limit) + 1);
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    
    if (!amount || amountNum <= 0) {
      toast({
        title: 'Error',
        description: 'Masukkan jumlah yang valid',
        variant: 'destructive'
      });
      return;
    }

    if (!summary || amountNum > summary.total_available) {
      toast({
        title: 'Error',
        description: 'Jumlah melebihi saldo tersedia',
        variant: 'destructive'
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: 'Error',
        description: 'Alamat wallet belum diatur. Silakan lengkapi profil Anda.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call RPC to request withdrawal
      const { data, error } = await supabase.rpc('member_request_withdrawal' as any, {
        p_amount_tpc: amountNum
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send email notification to admin
      try {
        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;
        
        if (accessToken) {
          await callEdgeFunction('send-withdrawal-request-email', {
            amount_tpc: amountNum,
            wallet_address: walletAddress
          }, accessToken);
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the withdrawal if email fails
        toast({
          title: 'Peringatan',
          description: 'Permintaan withdrawal berhasil, namun email notifikasi gagal dikirim.',
          variant: 'default'
        });
      }

      toast({
        title: 'Berhasil',
        description: 'Permintaan withdrawal telah diajukan. Notifikasi email dikirim ke admin.',
      });

      // Reset form and refresh data
      setAmount('');
      await fetchData();
      
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal mengajukan withdrawal',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await copyToClipboard(text);
      toast({
        title: 'Berhasil',
        description: `${label} disalin`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyalin',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      APPROVED: 'bg-green-500/20 text-green-500 border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-500 border-red-500/30'
    };

    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      REJECTED: XCircle
    };

    const labels = {
      PENDING: 'Menunggu',
      APPROVED: 'Disetujui',
      REJECTED: 'Ditolak'
    };

    const Icon = icons[status as keyof typeof icons];
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F0B90B] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/id/dashboard')}
          className="text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">Komisi & Withdraw</h1>
        <p className="text-[#848E9C]">Kelola komisi referral dan penarikan TPC Anda.</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-sm text-green-300">Total Komisi</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {formatTPC(summary.total_earned)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-blue-300">Sudah Withdraw</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {formatTPC(summary.total_withdrawn)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-amber-400" />
                <span className="text-sm text-amber-300">Dalam Proses</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {formatTPC(summary.total_pending)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-purple-400" />
                <span className="text-sm text-purple-300">Tersedia</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {formatTPC(summary.total_available)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdrawal Request Form */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-amber-400">Ajukan Withdraw</CardTitle>
        </CardHeader>
        <CardContent>
          {!walletAddress ? (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                Alamat wallet belum diatur. Silakan lengkapi profil Anda terlebih dahulu.
              </AlertDescription>
              <Button
                onClick={() => navigate('/id/dashboard/member/profile')}
                className="mt-3 bg-red-500 hover:bg-red-600"
              >
                Isi Wallet
              </Button>
            </Alert>
          ) : (
            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-white">Jumlah TPC</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Masukkan jumlah TPC"
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder-[#848E9C]"
                  max={summary?.total_available || 0}
                />
                {summary && (
                  <p className="text-sm text-[#848E9C] mt-1">
                    Tersedia: {formatTPC(summary.total_available)}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white">Wallet Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 bg-slate-800/50 border border-slate-700/50 text-white px-3 py-2 rounded font-mono text-sm">
                    {truncateWalletAddress(walletAddress)}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(walletAddress, 'Wallet Address')}
                    className="border-slate-700/50 text-white hover:bg-slate-800/50"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || (summary && parseFloat(amount) > summary.total_available)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/25"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                ) : (
                  'Ajukan Withdraw'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Riwayat Withdraw</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Withdraw</h3>
              <p className="text-[#848E9C]">Anda belum memiliki riwayat penarikan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-full flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {formatTPC(withdrawal.amount_tpc)}
                          </h4>
                          <p className="text-sm text-[#848E9C]">
                            {formatDateID(withdrawal.requested_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-[#848E9C]">Wallet:</span>
                        <code className="text-white font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">
                          {truncateWalletAddress(withdrawal.wallet_address)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(withdrawal.wallet_address, 'Wallet Address')}
                          className="text-[#848E9C] hover:text-white p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>

                      {withdrawal.processed_at && (
                        <p className="text-sm text-[#848E9C]">
                          Diproses: {formatDateID(withdrawal.processed_at)}
                        </p>
                      )}

                      {withdrawal.tx_hash && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-[#848E9C]">TX Hash:</span>
                          <code className="text-green-400 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">
                            {truncateWalletAddress(withdrawal.tx_hash, 10, 10)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(withdrawal.tx_hash!, 'Transaction Hash')}
                            className="text-[#848E9C] hover:text-white p-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}

                      {withdrawal.reject_reason && (
                        <div className="mt-2">
                          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded">
                            {withdrawal.reject_reason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(withdrawal.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-slate-700/50 text-white hover:bg-slate-800/50"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <span className="text-white px-4">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-slate-700/50 text-white hover:bg-slate-800/50"
              >
                Berikutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
