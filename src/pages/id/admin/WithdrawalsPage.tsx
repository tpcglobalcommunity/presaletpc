import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Wallet, CheckCircle, XCircle, Clock, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { callEdgeFunction } from '@/lib/edge';
import { formatDateID, formatNumberID, copyToClipboard, truncateWalletAddress } from '@/lib/utils';

interface Withdrawal {
  id: string;
  user_id: string;
  amount_tpc: number;
  wallet_address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requested_at: string;
  processed_at?: string;
  tx_hash?: string;
  reject_reason?: string;
  processed_by?: string;
  email: string;
  member_code: string;
}

export default function WithdrawalsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    withdrawal: Withdrawal | null;
    txHash: string;
  }>({ open: false, withdrawal: null, txHash: '' });
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    withdrawal: Withdrawal | null;
    reason: string;
  }>({ open: false, withdrawal: null, reason: '' });

  const limit = 20;
  const offset = (currentPage - 1) * limit;

  useEffect(() => {
    fetchWithdrawals();
  }, [searchTerm, statusFilter, currentPage]);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('admin_list_withdrawals' as any, {
        p_search: searchTerm || null,
        p_status: statusFilter === 'all' ? null : statusFilter,
        p_limit: limit,
        p_offset: offset
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
      // Estimate total pages (in real implementation, you'd get total count from RPC)
      setTotalPages(Math.ceil((data?.length || 0) / limit) + 1);
      
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

  const handleApprove = (withdrawal: Withdrawal) => {
    setApproveDialog({ open: true, withdrawal, txHash: '' });
  };

  const confirmApprove = async () => {
    if (!approveDialog.withdrawal || !approveDialog.txHash.trim()) {
      toast({
        title: 'Error',
        description: 'Transaction hash harus diisi',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(approveDialog.withdrawal.id);
    
    try {
      // Call RPC to approve withdrawal
      const { data, error } = await supabase.rpc('admin_approve_withdrawal' as any, {
        p_withdrawal_id: approveDialog.withdrawal.id,
        p_tx_hash: approveDialog.txHash.trim()
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send email notification to member
      try {
        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;
        
        if (accessToken) {
          await callEdgeFunction('send-withdrawal-approved-email', {
            withdrawal_id: approveDialog.withdrawal.id,
            amount_tpc: approveDialog.withdrawal.amount_tpc,
            tx_hash: approveDialog.txHash.trim(),
            wallet_address: approveDialog.withdrawal.wallet_address
          }, accessToken);
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the approval if email fails
        toast({
          title: 'Peringatan',
          description: 'Withdrawal berhasil disetujui, namun email notifikasi gagal dikirim.',
          variant: 'default'
        });
      }

      toast({
        title: 'Berhasil',
        description: 'Withdrawal berhasil disetujui dan notifikasi email dikirim.',
      });

      setApproveDialog({ open: false, withdrawal: null, txHash: '' });
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

  const handleReject = (withdrawal: Withdrawal) => {
    setRejectDialog({ open: true, withdrawal, reason: '' });
  };

  const confirmReject = async () => {
    if (!rejectDialog.withdrawal || !rejectDialog.reason.trim()) {
      toast({
        title: 'Error',
        description: 'Alasan penolakan harus diisi',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(rejectDialog.withdrawal.id);
    
    try {
      // Call RPC to reject withdrawal
      const { data, error } = await supabase.rpc('admin_reject_withdrawal' as any, {
        p_withdrawal_id: rejectDialog.withdrawal.id,
        p_reason: rejectDialog.reason.trim()
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send email notification to member
      try {
        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;
        
        if (accessToken) {
          await callEdgeFunction('send-withdrawal-rejected-email', {
            withdrawal_id: rejectDialog.withdrawal.id,
            amount_tpc: rejectDialog.withdrawal.amount_tpc,
            wallet_address: rejectDialog.withdrawal.wallet_address,
            reason: rejectDialog.reason.trim()
          }, accessToken);
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the rejection if email fails
        toast({
          title: 'Peringatan',
          description: 'Withdrawal berhasil ditolak, namun email notifikasi gagal dikirim.',
          variant: 'default'
        });
      }

      toast({
        title: 'Berhasil',
        description: 'Withdrawal berhasil ditolak dan notifikasi email dikirim.',
      });

      setRejectDialog({ open: false, withdrawal: null, reason: '' });
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
          onClick={() => navigate('/id/admin/dashboard')}
          className="text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">Withdrawals</h1>
        <p className="text-[#848E9C]">Kelola permintaan withdraw komisi TPC.</p>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C] w-4 h-4" />
                <Input
                  placeholder="Cari email / wallet / status"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder-[#848E9C] pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/50 border-slate-700/50">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="APPROVED">Disetujui</SelectItem>
                  <SelectItem value="REJECTED">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals List */}
      <div className="space-y-4">
        {withdrawals.length === 0 ? (
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Wallet className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Tidak Ada Withdrawal</h3>
              <p className="text-[#848E9C]">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tidak ada withdrawal yang cocok dengan filter'
                  : 'Belum ada permintaan withdrawal'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          withdrawals.map((withdrawal) => (
            <Card key={withdrawal.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-full flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {formatNumberID(withdrawal.amount_tpc)} TPC
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#848E9C]">
                          <span>{withdrawal.member_code}</span>
                          <span>•</span>
                          <span>{withdrawal.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-[#848E9C] mb-1">Wallet Address</div>
                        <div className="flex items-center gap-2">
                          <code className="text-white font-mono text-sm bg-slate-800/50 px-2 py-1 rounded">
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
                      </div>
                      <div>
                        <div className="text-sm text-[#848E9C] mb-1">Waktu Request</div>
                        <div className="text-white text-sm">
                          {formatDateID(withdrawal.requested_at)}
                        </div>
                      </div>
                    </div>

                    {withdrawal.tx_hash && (
                      <div className="mt-4">
                        <div className="text-sm text-[#848E9C] mb-1">Transaction Hash</div>
                        <div className="flex items-center gap-2">
                          <code className="text-green-400 font-mono text-sm bg-slate-800/50 px-2 py-1 rounded">
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
                      </div>
                    )}

                    {withdrawal.reject_reason && (
                      <div className="mt-4">
                        <div className="text-sm text-[#848E9C] mb-1">Alasan Penolakan</div>
                        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-3 py-2 rounded">
                          {withdrawal.reject_reason}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(withdrawal.status)}
                    {withdrawal.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(withdrawal)}
                          disabled={isProcessing === withdrawal.id}
                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/25"
                        >
                          {isProcessing === withdrawal.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleReject(withdrawal)}
                          disabled={isProcessing === withdrawal.id}
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          {isProcessing === withdrawal.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
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

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onOpenChange={(open) => setApproveDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">Approve Withdrawal</DialogTitle>
          </DialogHeader>
          
          {approveDialog.withdrawal && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Ringkasan Withdrawal</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#848E9C]">Jumlah:</span>
                    <span className="text-white font-semibold">{formatNumberID(approveDialog.withdrawal.amount_tpc)} TPC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#848E9C]">Email:</span>
                    <span className="text-white">{approveDialog.withdrawal.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#848E9C]">Wallet:</span>
                    <span className="text-white font-mono text-xs">{truncateWalletAddress(approveDialog.withdrawal.wallet_address)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="tx-hash" className="text-white">Transaction Hash *</Label>
                <Input
                  id="tx-hash"
                  value={approveDialog.txHash}
                  onChange={(e) => setApproveDialog(prev => ({ ...prev, txHash: e.target.value }))}
                  placeholder="Masukkan transaction hash"
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder-[#848E9C] mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              onClick={() => setApproveDialog({ open: false, withdrawal: null, txHash: '' })}
              variant="outline"
              className="border-slate-700/50 text-white hover:bg-slate-800/50"
            >
              Batal
            </Button>
            <Button
              onClick={confirmApprove}
              disabled={isProcessing === approveDialog.withdrawal?.id}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
            >
              {isProcessing === approveDialog.withdrawal?.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              ) : (
                'Konfirmasi Approve'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">Reject Withdrawal</DialogTitle>
          </DialogHeader>
          
          {rejectDialog.withdrawal && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Ringkasan Withdrawal</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#848E9C]">Jumlah:</span>
                    <span className="text-white font-semibold">{formatNumberID(rejectDialog.withdrawal.amount_tpc)} TPC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#848E9C]">Email:</span>
                    <span className="text-white">{rejectDialog.withdrawal.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#848E9C]">Wallet:</span>
                    <span className="text-white font-mono text-xs">{truncateWalletAddress(rejectDialog.withdrawal.wallet_address)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="reject-reason" className="text-white">Alasan Penolakan *</Label>
                <textarea
                  id="reject-reason"
                  value={rejectDialog.reason}
                  onChange={(e) => setRejectDialog(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Masukkan alasan penolakan"
                  className="w-full bg-slate-800/50 border-slate-700/50 text-white placeholder-[#848E9C] mt-1 p-3 rounded resize-none h-24"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              onClick={() => setRejectDialog({ open: false, withdrawal: null, reason: '' })}
              variant="outline"
              className="border-slate-700/50 text-white hover:bg-slate-800/50"
            >
              Batal
            </Button>
            <Button
              onClick={confirmReject}
              disabled={isProcessing === rejectDialog.withdrawal?.id}
              variant="destructive"
            >
              {isProcessing === rejectDialog.withdrawal?.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Konfirmasi Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
