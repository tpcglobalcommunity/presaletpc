import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, Wallet, User, Mail, Calendar, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { callEdgeFunction } from '@/lib/edge';

interface Withdrawal {
  id: string;
  user_id: string;
  amount_tpc: number;
  wallet_address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  reject_reason?: string;
  tx_hash?: string;
  profiles: {
    email: string;
    member_code: string;
  };
}

export default function AdminWithdrawalPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    withdrawalId: string;
    reason: string;
  }>({ open: false, withdrawalId: '', reason: '' });
  const [txHashDialog, setTxHashDialog] = useState<{
    open: boolean;
    withdrawalId: string;
    txHash: string;
  }>({ open: false, withdrawalId: '', txHash: '' });

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('admin_list_withdrawals' as any, {
        p_status: statusFilter === 'all' ? null : statusFilter,
        p_limit: 100,
        p_offset: 0
      });

      if (error) {
        console.error('Error fetching withdrawals:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat data withdrawal',
          variant: 'destructive'
        });
        return;
      }

      setWithdrawals(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan yang tidak terduga',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    setTxHashDialog({ open: true, withdrawalId, txHash: '' });
  };

  const confirmApprove = async () => {
    if (!txHashDialog.txHash.trim()) {
      toast({
        title: 'Error',
        description: 'Transaction hash harus diisi',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(txHashDialog.withdrawalId);
    
    try {
      // Call RPC to approve withdrawal
      const { data, error } = await supabase.rpc('admin_approve_withdrawal' as any, {
        p_withdrawal_id: txHashDialog.withdrawalId,
        p_tx_hash: txHashDialog.txHash.trim()
      });

      if (error) {
        throw new Error(error.message);
      }

      // Find the withdrawal for email notification
      const withdrawal = withdrawals.find(w => w.id === txHashDialog.withdrawalId);
      
      if (withdrawal) {
        // Send email notification to member
        try {
          const session = await supabase.auth.getSession();
          const accessToken = session.data.session?.access_token;
          
          if (accessToken) {
            await callEdgeFunction('send-withdrawal-approved-email', {
              withdrawal_id: withdrawal.id,
              amount_tpc: withdrawal.amount_tpc,
              tx_hash: txHashDialog.txHash.trim(),
              wallet_address: withdrawal.wallet_address
            }, accessToken);
          }
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't fail the approval if email fails
        }
      }

      toast({
        title: 'Berhasil',
        description: 'Withdrawal berhasil disetujui. Notifikasi email dikirim ke member.',
      });

      setTxHashDialog({ open: false, withdrawalId: '', txHash: '' });
      await fetchWithdrawals();
      
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal menyetujui withdrawal',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (withdrawalId: string) => {
    setRejectDialog({ open: true, withdrawalId, reason: '' });
  };

  const confirmReject = async () => {
    if (!rejectDialog.reason.trim()) {
      toast({
        title: 'Error',
        description: 'Alasan penolakan harus diisi',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(rejectDialog.withdrawalId);
    
    try {
      const { data, error } = await supabase.rpc('admin_reject_withdrawal' as any, {
        p_withdrawal_id: rejectDialog.withdrawalId,
        p_reason: rejectDialog.reason.trim()
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Berhasil',
        description: 'Withdrawal berhasil ditolak.',
      });

      setRejectDialog({ open: false, withdrawalId: '', reason: '' });
      await fetchWithdrawals();
      
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal menolak withdrawal',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(null);
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
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F0B90B] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/id/admin/dashboard')}
          className="text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-white mb-2">Manajemen Withdrawal</h1>
        <p className="text-[#848E9C]">Kelola permintaan withdrawal komisi member</p>
      </div>

      {/* Filter */}
      <Card className="bg-[#1E2329] border border-[#2B3139] mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="status-filter" className="text-white">Filter Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-[#2B3139] border-[#3D444B] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B3139] border-[#3D444B]">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals List */}
      <div className="space-y-4">
        {withdrawals.length === 0 ? (
          <Card className="bg-[#1E2329] border border-[#2B3139]">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Tidak Ada Withdrawal</h3>
              <p className="text-[#848E9C]">
                {statusFilter === 'all' 
                  ? 'Belum ada permintaan withdrawal'
                  : `Tidak ada withdrawal dengan status ${statusFilter}`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          withdrawals.map((withdrawal) => (
            <Card key={withdrawal.id} className="bg-[#1E2329] border border-[#2B3139]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F0B90B]/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-[#F0B90B]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {withdrawal.amount_tpc.toLocaleString('id-ID')} TPC
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#848E9C]">
                        <User className="w-3 h-3" />
                        {withdrawal.profiles.member_code} • {withdrawal.profiles.email}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-[#848E9C] mb-1">Wallet Address</div>
                    <div className="text-white font-mono text-sm break-all">
                      {withdrawal.wallet_address}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[#848E9C] mb-1">Waktu Request</div>
                    <div className="text-white text-sm">
                      {new Date(withdrawal.requested_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {withdrawal.tx_hash && (
                  <div className="mb-4">
                    <div className="text-sm text-[#848E9C] mb-1">Transaction Hash</div>
                    <div className="text-white font-mono text-sm break-all">
                      {withdrawal.tx_hash}
                    </div>
                  </div>
                )}

                {withdrawal.reject_reason && (
                  <div className="mb-4">
                    <div className="text-sm text-[#848E9C] mb-1">Alasan Penolakan</div>
                    <div className="text-red-400 text-sm">
                      {withdrawal.reject_reason}
                    </div>
                  </div>
                )}

                {withdrawal.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(withdrawal.id)}
                      disabled={isProcessing === withdrawal.id}
                      className="bg-[#F0B90B] hover:bg-[#F8D56B] text-black"
                    >
                      {isProcessing === withdrawal.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Setujui
                    </Button>
                    <Button
                      onClick={() => handleReject(withdrawal.id)}
                      disabled={isProcessing === withdrawal.id}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Approve Dialog */}
      {txHashDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-[#1E2329] border border-[#2B3139] w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Setujui Withdrawal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tx-hash" className="text-white">Transaction Hash</Label>
                <Input
                  id="tx-hash"
                  value={txHashDialog.txHash}
                  onChange={(e) => setTxHashDialog(prev => ({ ...prev, txHash: e.target.value }))}
                  placeholder="Masukkan transaction hash"
                  className="bg-[#2B3139] border-[#3D444B] text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={confirmApprove}
                  disabled={isProcessing === txHashDialog.withdrawalId}
                  className="bg-[#F0B90B] hover:bg-[#F8D56B] text-black"
                >
                  {isProcessing === txHashDialog.withdrawalId ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  ) : (
                    'Setujui'
                  )}
                </Button>
                <Button
                  onClick={() => setTxHashDialog({ open: false, withdrawalId: '', txHash: '' })}
                  variant="outline"
                  className="border-[#3D444B] text-white hover:bg-[#2B3139]"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Dialog */}
      {rejectDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-[#1E2329] border border-[#2B3139] w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Tolak Withdrawal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reject-reason" className="text-white">Alasan Penolakan</Label>
                <Textarea
                  id="reject-reason"
                  value={rejectDialog.reason}
                  onChange={(e) => setRejectDialog(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Masukkan alasan penolakan"
                  className="bg-[#2B3139] border-[#3D444B] text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={confirmReject}
                  disabled={isProcessing === rejectDialog.withdrawalId}
                  variant="destructive"
                >
                  {isProcessing === rejectDialog.withdrawalId ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Tolak'
                  )}
                </Button>
                <Button
                  onClick={() => setRejectDialog({ open: false, withdrawalId: '', reason: '' })}
                  variant="outline"
                  className="border-[#3D444B] text-white hover:bg-[#2B3139]"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
