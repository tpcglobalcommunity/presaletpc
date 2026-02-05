import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Wallet, Banknote, AlertCircle, CheckCircle, Clock, Info, RefreshCw, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { callEdgeFunction } from '@/lib/edge';

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
}

interface WithdrawalRequest {
  amount: string;
  bank_account_id: string;
  notes: string;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  tpc_amount: number;
  bank_name: string;
  account_number: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  created_at: string;
  processed_at?: string;
  notes?: string;
}

export default function MemberWithdrawalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [walletStats, setWalletStats] = useState({
    total_tpc_balance: 0,
    pending_withdrawal: 0,
    total_withdrawn: 0
  });
  
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<WithdrawalRequest>({
    amount: '',
    bank_account_id: '',
    notes: ''
  });

  const WITHDRAWAL_MIN = 100; // Minimum 100 TPC
  const WITHDRAWAL_FEE_PERCENTAGE = 2; // 2% fee
  const WITHDRAWAL_MAX_DAILY = 10000; // Max 10,000 TPC per day

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats = {
        total_tpc_balance: 1250.50,
        pending_withdrawal: 0,
        total_withdrawn: 100.00
      };
      
      const mockBankAccounts: BankAccount[] = [
        {
          id: '1',
          bank_name: 'BCA',
          account_number: '1234567890',
          account_name: 'John Doe',
          is_default: true
        },
        {
          id: '2',
          bank_name: 'Mandiri',
          account_number: '0987654321',
          account_name: 'John Doe',
          is_default: false
        }
      ];
      
      const mockHistory: WithdrawalHistory[] = [
        {
          id: '1',
          amount: 100000,
          tpc_amount: 50,
          bank_name: 'BCA',
          account_number: '123****890',
          status: 'completed',
          created_at: '2024-01-13T09:20:00Z',
          processed_at: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          amount: 200000,
          tpc_amount: 100,
          bank_name: 'Mandiri',
          account_number: '098****321',
          status: 'pending',
          created_at: '2024-01-16T11:45:00Z'
        }
      ];
      
      setWalletStats(mockStats);
      setBankAccounts(mockBankAccounts);
      setWithdrawalHistory(mockHistory);
      
      // Set default bank account
      if (mockBankAccounts.length > 0) {
        const defaultAccount = mockBankAccounts.find(acc => acc.is_default) || mockBankAccounts[0];
        setFormData(prev => ({ ...prev, bank_account_id: defaultAccount.id }));
      }
      
    } catch (error) {
      console.error('Error fetching withdrawal data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data penarikan',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFee = (amount: number) => {
    return (amount * WITHDRAWAL_FEE_PERCENTAGE) / 100;
  };

  const calculateReceivedAmount = (amount: number) => {
    const fee = calculateFee(amount);
    return amount - fee;
  };

  const validateForm = () => {
    const amount = parseFloat(formData.amount);
    
    if (!formData.amount) {
      toast({
        title: 'Error',
        description: 'Masukkan jumlah penarikan',
        variant: 'destructive'
      });
      return false;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Jumlah tidak valid',
        variant: 'destructive'
      });
      return false;
    }
    
    if (amount < WITHDRAWAL_MIN) {
      toast({
        title: 'Error',
        description: `Minimum penarikan adalah ${WITHDRAWAL_MIN} TPC`,
        variant: 'destructive'
      });
      return false;
    }
    
    if (amount > walletStats.total_tpc_balance) {
      toast({
        title: 'Error',
        description: 'Saldo tidak mencukupi',
        variant: 'destructive'
      });
      return false;
    }
    
    if (amount > WITHDRAWAL_MAX_DAILY) {
      toast({
        title: 'Error',
        description: `Maksimum penarikan harian adalah ${WITHDRAWAL_MAX_DAILY} TPC`,
        variant: 'destructive'
      });
      return false;
    }
    
    if (!formData.bank_account_id) {
      toast({
        title: 'Error',
        description: 'Pilih rekening bank',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(formData.amount);
      
      // Get user profile for wallet address
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_address, tpc_wallet_address')
        .eq('user_id', user?.id)
        .single();
      
      if (profileError || !profile) {
        throw new Error('Profile not found');
      }
      
      const walletAddress = profile.wallet_address || profile.tpc_wallet_address;
      if (!walletAddress) {
        toast({
          title: 'Error',
          description: 'Alamat wallet belum diatur. Silakan lengkapi profil Anda terlebih dahulu.',
          variant: 'destructive'
        });
        return;
      }
      
      // Call RPC to request withdrawal
      const { data: withdrawalData, error: withdrawalError } = await supabase.rpc('member_request_withdrawal' as any, {
        p_amount_tpc: amount
      });
      
      if (withdrawalError) {
        throw new Error(withdrawalError.message);
      }
      
      // Send email notification to admin
      try {
        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;
        
        if (accessToken) {
          await callEdgeFunction('send-withdrawal-request-email', {
            amount_tpc: amount,
            wallet_address: walletAddress
          }, accessToken);
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the withdrawal if email fails
      }
      
      toast({
        title: 'Berhasil',
        description: 'Permintaan penarikan telah diajukan. Notifikasi email dikirim ke admin.',
      });
      
      // Reset form
      setFormData({
        amount: '',
        bank_account_id: bankAccounts.find(acc => acc.is_default)?.id || '',
        notes: ''
      });
      
      // Refresh data
      await fetchData();
      
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal mengajukan penarikan',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-500 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-500 border-red-500/30'
    };
    
    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      rejected: 'Rejected'
    };
    
    const icons = {
      pending: <Clock className="h-3 w-3" />,
      processing: <RefreshCw className="h-3 w-3 animate-spin" />,
      completed: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        <span className="flex items-center gap-1">
          {icons[status as keyof typeof icons] || icons.pending}
          {labels[status as keyof typeof labels] || labels.pending}
        </span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return accountNumber.substring(0, 4) + '****' + accountNumber.substring(accountNumber.length - 3);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] pb-20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#F0B90B] mx-auto mb-4" />
          <p className="text-white">Memuat data penarikan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] pb-20">
      {/* Header */}
      <div className="bg-[#1E2329] border-b border-[#2B3139] px-4 py-3 flex items-center">
        <button
          onClick={() => navigate('/id/member/wallet')}
          className="text-white mr-3"
        >
          ←
        </button>
        <h1 className="text-white font-semibold text-lg">Penarikan TPC</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Balance Info */}
        <Card className="bg-gradient-to-br from-[#F0B90B] to-[#F0B90B]/80 border-[#F0B90B]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-lg flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Saldo Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black mb-2">
              {walletStats.total_tpc_balance.toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} TPC
            </div>
            <div className="text-black/70 text-sm">
              ≈ Rp {(walletStats.total_tpc_balance * 2000).toLocaleString('id-ID')}
            </div>
            {walletStats.pending_withdrawal > 0 && (
              <div className="mt-2 text-yellow-800 text-sm">
                ⚠️ {walletStats.pending_withdrawal} TPC sedang dalam proses penarikan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Banknote className="h-5 w-5 mr-2" />
              Form Penarikan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount Input */}
              <div>
                <Label htmlFor="amount" className="text-white text-sm font-medium">
                  Jumlah Penarikan (TPC)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Minimal 100 TPC"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-[#2B3139]/50 border-[#2B3139] text-white placeholder:text-[#848E9C]"
                  min={WITHDRAWAL_MIN}
                  max={walletStats.total_tpc_balance}
                  step="0.01"
                />
                <div className="mt-1 text-xs text-[#848E9C]">
                  Minimal: {WITHDRAWAL_MIN} TPC | Maksimal: {WITHDRAWAL_MAX_DAILY} TPC/hari
                </div>
              </div>

              {/* Amount Preview */}
              {formData.amount && parseFloat(formData.amount) > 0 && (
                <div className="bg-[#2B3139]/30 rounded-lg p-3 border border-[#2B3139]/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#848E9C]">Jumlah:</span>
                    <span className="text-white">
                      {parseFloat(formData.amount).toLocaleString('id-ID')} TPC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#848E9C]">Fee ({WITHDRAWAL_FEE_PERCENTAGE}%):</span>
                    <span className="text-yellow-500">
                      -{calculateFee(parseFloat(formData.amount)).toLocaleString('id-ID')} TPC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white">Yang Diterima:</span>
                    <span className="text-green-500">
                      {calculateReceivedAmount(parseFloat(formData.amount)).toLocaleString('id-ID')} TPC
                    </span>
                  </div>
                </div>
              )}

              {/* Bank Account Selection */}
              <div>
                <Label htmlFor="bank_account" className="text-white text-sm font-medium">
                  Rekening Tujuan
                </Label>
                <select
                  id="bank_account"
                  value={formData.bank_account_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_account_id: e.target.value }))}
                  className="w-full bg-[#2B3139]/50 border-[#2B3139] text-white rounded-lg px-3 py-2 text-sm"
                >
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.bank_name} - {account.account_name} ({maskAccountNumber(account.account_number)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-white text-sm font-medium">
                  Catatan (Opsional)
                </Label>
                <textarea
                  id="notes"
                  placeholder="Masukkan catatan jika ada"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-[#2B3139]/50 border-[#2B3139] text-white placeholder:text-[#848E9C] rounded-lg px-3 py-2 text-sm resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !formData.amount || parseFloat(formData.amount) < WITHDRAWAL_MIN}
                className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Ajukan Penarikan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Important Info */}
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-200 text-sm">
            <div className="space-y-1">
              <div>• Proses penarikan 1-3 hari kerja</div>
              <div>• Fee penarikan {WITHDRAWAL_FEE_PERCENTAGE}% dari jumlah</div>
              <div>• Pastikan rekening bank sudah benar</div>
              <div>• Hubungi support jika ada kendala</div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Withdrawal History */}
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Riwayat Penarikan</span>
              <span className="text-sm text-[#848E9C] font-normal">
                {withdrawalHistory.length} transaksi
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {withdrawalHistory.length === 0 ? (
              <div className="text-center py-8">
                <Banknote className="h-12 w-12 text-[#848E9C] mx-auto mb-3" />
                <p className="text-[#848E9C]">Belum ada riwayat penarikan</p>
              </div>
            ) : (
              withdrawalHistory.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-3 bg-[#2B3139]/30 rounded-lg border border-[#2B3139]/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">
                        {withdrawal.tpc_amount.toLocaleString('id-ID')} TPC
                      </span>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                    <div className="text-[#848E9C] text-sm">
                      {withdrawal.bank_name} - {maskAccountNumber(withdrawal.account_number)}
                    </div>
                    <div className="text-[#848E9C] text-xs">
                      {formatDate(withdrawal.created_at)}
                      {withdrawal.processed_at && (
                        <span> • Diproses: {formatDate(withdrawal.processed_at)}</span>
                      )}
                    </div>
                    {withdrawal.notes && (
                      <div className="text-yellow-500 text-xs mt-1">
                        Catatan: {withdrawal.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
