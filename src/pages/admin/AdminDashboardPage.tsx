import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Users, Eye } from 'lucide-react';
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
}

interface DashboardStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalInvoices: number;
  totalTPC: number;
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
