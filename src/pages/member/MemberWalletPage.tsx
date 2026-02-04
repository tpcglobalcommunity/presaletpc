import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  type: 'purchase' | 'commission' | 'withdrawal' | 'bonus';
  amount: number;
  tpc_amount?: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

interface WalletStats {
  total_tpc_balance: number;
  total_commission: number;
  total_withdrawn: number;
  pending_withdrawal: number;
}

export default function MemberWalletPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [walletStats, setWalletStats] = useState<WalletStats>({
    total_tpc_balance: 0,
    total_commission: 0,
    total_withdrawn: 0,
    pending_withdrawal: 0
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWalletData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats: WalletStats = {
        total_tpc_balance: 1250.50,
        total_commission: 320.75,
        total_withdrawn: 100.00,
        pending_withdrawal: 0
      };
      
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'purchase',
          amount: 1000000,
          tpc_amount: 500,
          status: 'completed',
          description: 'Pembelian TPC - Invoice #INV-001',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'commission',
          amount: 50000,
          tpc_amount: 25,
          status: 'completed',
          description: 'Komisi dari referral user123',
          created_at: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          type: 'withdrawal',
          amount: 100000,
          tpc_amount: 50,
          status: 'completed',
          description: 'Penarikan ke wallet 0x1234...',
          created_at: '2024-01-13T09:20:00Z'
        },
        {
          id: '4',
          type: 'bonus',
          amount: 0,
          tpc_amount: 10,
          status: 'completed',
          description: 'Bonus sponsor awal',
          created_at: '2024-01-12T14:15:00Z'
        }
      ];
      
      setWalletStats(mockStats);
      setTransactions(mockTransactions);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data wallet',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWalletData();
  };

  const handleWithdraw = () => {
    navigate('/id/member/withdraw');
  };

  const handleBuyTPC = () => {
    navigate('/id/buytpc');
  };

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-500/20 text-green-500 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      failed: 'bg-red-500/20 text-red-500 border-red-500/30'
    };
    
    const labels = {
      completed: 'Selesai',
      pending: 'Pending',
      failed: 'Gagal'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {labels[status as keyof typeof labels] || labels.pending}
      </Badge>
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'commission':
      case 'bonus':
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] pb-20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#F0B90B] mx-auto mb-4" />
          <p className="text-white">Memuat data wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F0B90B] to-[#F0B90B]/80 border-b border-[#F0B90B]/30 px-4 py-4 flex items-center justify-between">
        <h1 className="text-white font-semibold text-lg flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          Wallet Saya
        </h1>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          disabled={isRefreshing}
          className="text-white hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Balance Card */}
        <Card className="bg-gradient-to-br from-[#F0B90B] via-[#F0B90B]/90 to-[#F0B90B]/70 border-[#F0B90B]/30 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-black/80 text-sm font-medium">Saldo Tersedia</h2>
                <p className="text-black/60 text-xs">Updated {new Date().toLocaleTimeString('id-ID')}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-black" />
              </div>
            </div>
            
            <div className="text-4xl font-bold text-black mb-2">
              {walletStats.total_tpc_balance.toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} TPC
            </div>
            <div className="text-black/70 text-sm mb-4">
              ≈ Rp {(walletStats.total_tpc_balance * 2000).toLocaleString('id-ID')}
            </div>
            
            {walletStats.pending_withdrawal > 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-center text-yellow-800 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{walletStats.pending_withdrawal} TPC sedang dalam proses penarikan</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 text-sm">Total Komisi</span>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {walletStats.total_commission.toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} TPC
              </div>
              <div className="text-blue-200 text-xs">
                +12.5% bulan ini
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-sm">Total Ditarik</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {walletStats.total_withdrawn.toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} TPC
              </div>
              <div className="text-green-200 text-xs">
                3 transaksi berhasil
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleBuyTPC}
            className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium h-12 shadow-lg"
          >
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Beli TPC
          </Button>
          
          <Button
            onClick={handleWithdraw}
            variant="outline"
            className="border-[#2B3139] text-white hover:bg-[#2B3139]/50 h-12 shadow-lg"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Tarik
          </Button>
        </div>

        {/* Transactions */}
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Riwayat Transaksi
              </span>
              <Badge className="bg-[#2B3139]/50 text-[#848E9C] border-[#2B3139]">
                {transactions.length} transaksi
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#2B3139]/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-[#848E9C]" />
                </div>
                <p className="text-[#848E9C]">Belum ada transaksi</p>
                <p className="text-[#848E9C] text-xs mt-2">Mulai investasi untuk melihat riwayat transaksi</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-[#2B3139]/30 rounded-xl border border-[#2B3139]/50 hover:bg-[#2B3139]/40 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'purchase' ? 'bg-green-500/20' :
                      transaction.type === 'commission' || transaction.type === 'bonus' ? 'bg-blue-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-[#848E9C] text-sm">
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold text-lg ${
                      transaction.type === 'withdrawal' ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}
                      {transaction.tpc_amount?.toLocaleString('id-ID', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} TPC
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      {getStatusIcon(transaction.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Wallet Info */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/5 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Wallet className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-3">Informasi Wallet</h3>
                <div className="text-blue-200 text-sm space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>1 TPC ≈ Rp 2,000 (estimasi)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Komisi otomatis masuk setelah referral berhasil</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Penarikan minimal 100 TPC</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Proses penarikan 1-3 hari kerja</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
