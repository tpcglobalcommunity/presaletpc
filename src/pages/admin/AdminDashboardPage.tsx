import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Users, Eye, DollarSign, Coins, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID, formatRupiah } from '@/lib/number';

interface Invoice {
  id: string;
  invoice_no: string;
  status: string;
  amount_input: number;
  base_currency: string;
  amount_usd: number;
  tpc_amount: number;
  created_at: string;
  email: string;
  amount_idr?: number;
  amount_sol?: number;
  amount_usdc?: number;
}

interface DashboardStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalInvoices: number;
  totalTPC: number;
}

interface FinancialStats {
  totalIDR: number;
  totalSOL: number;
  totalUSDC: number;
  grandTotalIDR: number;
  solToIDR: number;
  usdToIDR: number;
  isUsingFallbackRate: boolean;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalInvoices: 0,
    totalTPC: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFinancialLoading, setIsFinancialLoading] = useState(true);
  const [financialStats, setFinancialStats] = useState<FinancialStats>({
    totalIDR: 0,
    totalSOL: 0,
    totalUSDC: 0,
    grandTotalIDR: 0,
    solToIDR: 2100000, // Fallback rate
    usdToIDR: 17000, // Configurable constant
    isUsingFallbackRate: false,
  });

  // Helper function for admin invoice detail path
  const adminInvoiceDetailPath = (id: string) => `/${lang}/admin/invoices/${id}`;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all invoices for stats
        const { data: allInvoices, error: allError } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });

        if (allError) {
          console.error('Error fetching invoices:', allError);
          return;
        }

        const invoiceData = allInvoices || [];
        
        // Calculate stats
        const calculatedStats: DashboardStats = {
          totalPending: invoiceData.filter(inv => inv.status === 'PENDING_REVIEW').length,
          totalApproved: invoiceData.filter(inv => inv.status === 'PAID').length,
          totalRejected: invoiceData.filter(inv => inv.status === 'CANCELLED').length,
          totalInvoices: invoiceData.length,
          totalTPC: invoiceData
            .filter(inv => inv.status === 'PAID')
            .reduce((sum, inv) => sum + (inv.tpc_amount || 0), 0),
        };

        setStats(calculatedStats);

        // Get recent 5 invoices
        const recentInvoices = invoiceData.slice(0, 5);
        setInvoices(recentInvoices);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsFinancialLoading(true);
        
        // Fetch SOL/IDR rate from CoinGecko API
        let solToIDR = 2100000; // Fallback rate
        let isUsingFallbackRate = false;
        
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=idr');
          if (response.ok) {
            const data = await response.json();
            if (data.solana?.idr) {
              solToIDR = data.solana.idr;
            }
          }
        } catch (error) {
          console.log('Failed to fetch SOL/IDR rate, using fallback');
          isUsingFallbackRate = true;
        }

        // Fetch financial totals via RPC
        const { data: financialData, error: financialError } = await supabase.rpc('admin_get_paid_totals');

        if (financialError) {
          console.error('Error fetching financial totals:', financialError);
          return;
        }

        // Extract totals from RPC response
        const totals = financialData?.[0] || {
          total_idr: 0,
          total_sol: 0,
          total_usdc: 0,
          count_paid: 0
        };

        const totalIDR = Number(totals.total_idr) || 0;
        const totalSOL = Number(totals.total_sol) || 0;
        const totalUSDC = Number(totals.total_usdc) || 0;

        // Convert to IDR
        const usdToIDR = 17000; // Configurable constant
        const solToIDRValue = totalSOL * solToIDR;
        const usdcToIDRValue = totalUSDC * usdToIDR;
        const grandTotalIDR = totalIDR + solToIDRValue + usdcToIDRValue;

        setFinancialStats({
          totalIDR,
          totalSOL,
          totalUSDC,
          grandTotalIDR,
          solToIDR,
          usdToIDR,
          isUsingFallbackRate,
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setIsFinancialLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return {
          label: 'Review',
          bgColor: 'bg-amber-500/10',
          color: 'text-amber-400',
          borderColor: 'border-amber-500/20',
          icon: Clock,
        };
      case 'PAID':
        return {
          label: 'Lunas',
          bgColor: 'bg-emerald-500/10',
          color: 'text-emerald-400',
          borderColor: 'border-emerald-500/20',
          icon: CheckCircle,
        };
      case 'CANCELLED':
        return {
          label: 'Dibatalkan',
          bgColor: 'bg-red-500/10',
          color: 'text-red-400',
          borderColor: 'border-red-500/20',
          icon: XCircle,
        };
      default:
        return {
          label: 'Menunggu',
          bgColor: 'bg-gray-500/10',
          color: 'text-gray-400',
          borderColor: 'border-gray-500/20',
          icon: Clock,
        };
    }
  };

  if (isLoading || isFinancialLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-[#1E2329] border-[#2B3139]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-[#2B3139] rounded w-20"></div>
                <div className="h-4 w-4 bg-[#2B3139] rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-[#2B3139] rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <div className="h-6 bg-[#2B3139] rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-[#2B3139] rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total Invoice</CardTitle>
            <FileText className="h-4 w-4 text-[#848E9C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalInvoices}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats.totalPending}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{stats.totalApproved}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total TPC Terjual</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#F0B90B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F0B90B]">{formatNumberID(stats.totalTPC)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total IDR Diterima</CardTitle>
            <DollarSign className="h-4 w-4 text-[#F0B90B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F0B90B]">{formatRupiah(financialStats.totalIDR)}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total SOL Diterima</CardTitle>
            <Coins className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{formatNumberID(financialStats.totalSOL)} SOL</div>
            <div className="text-sm text-[#848E9C]">{formatRupiah(financialStats.totalSOL * financialStats.solToIDR)}</div>
            {financialStats.isUsingFallbackRate && (
              <div className="text-xs text-amber-400 mt-1" title="Using fallback rate">
                ⚠️ Fallback rate
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total USDC Diterima</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{formatNumberID(financialStats.totalUSDC)} USDC</div>
            <div className="text-sm text-[#848E9C]">{formatRupiah(financialStats.totalUSDC * financialStats.usdToIDR)}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total Dana Masuk</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{formatRupiah(financialStats.grandTotalIDR)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <p className="text-[#848E9C]">Belum ada invoice</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => {
                const statusConfig = getStatusConfig(invoice.status);
                const Icon = statusConfig.icon;
                const isReviewStatus = invoice.status === 'PENDING_REVIEW';
                
                return (
                  <div 
                    key={invoice.id} 
                    className="flex items-center justify-between p-4 bg-[#2B3139]/30 rounded-lg border border-[#2B3139] hover:border-[#F0B90B]/50 transition-all cursor-pointer group"
                    onClick={() => navigate(adminInvoiceDetailPath(invoice.id))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(adminInvoiceDetailPath(invoice.id));
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-medium group-hover:text-[#F0B90B] transition-colors">
                          {invoice.invoice_no}
                        </span>
                        <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        {isReviewStatus && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="ml-auto bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20 hover:bg-[#F0B90B]/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(adminInvoiceDetailPath(invoice.id));
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                      <div className="text-[#848E9C] text-sm">
                        {invoice.email} • {new Date(invoice.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {invoice.base_currency === 'IDR' 
                          ? formatRupiah(invoice.amount_input)
                          : `$${invoice.amount_usd?.toFixed(2)}`
                        }
                      </div>
                      <div className="text-[#F0B90B] text-sm">{formatNumberID(invoice.tpc_amount)} TPC</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
