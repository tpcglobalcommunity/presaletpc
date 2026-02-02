import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, Search, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  transfer_method?: string;
  proof_url?: string;
  submitted_at?: string;
}

type FilterStatus = 'all' | 'UNPAID' | 'PENDING_REVIEW' | 'PAID' | 'CANCELLED';

export default function AdminInvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching invoices:', error);
          return;
        }

        setInvoices(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID': return { color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/20', label: 'Lunas', icon: CheckCircle };
      case 'PENDING_REVIEW': return { color: 'text-amber-400', bgColor: 'bg-amber-400/10', borderColor: 'border-amber-400/20', label: 'Review', icon: Clock };
      case 'UNPAID': return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: 'Belum Bayar', icon: FileText };
      case 'CANCELLED': return { color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20', label: 'Dibatalkan', icon: XCircle };
      default: return { color: 'text-[#848E9C]', bgColor: 'bg-[#848E9C]/10', borderColor: 'border-[#848E9C]/20', label: status, icon: FileText };
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Daftar Invoice</h1>
          <p className="text-[#848E9C]">Kelola semua invoice pembelian TPC</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
                <Input
                  placeholder="Cari invoice atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2B3139] border-[#3A3F47] text-white placeholder-[#848E9C]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: FilterStatus) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48 bg-[#2B3139] border-[#3A3F47] text-white">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E2329] border-[#2B3139]">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="UNPAID">Belum Bayar</SelectItem>
                <SelectItem value="PENDING_REVIEW">Review</SelectItem>
                <SelectItem value="PAID">Lunas</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardHeader>
          <CardTitle className="text-white">
            Invoice ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <p className="text-[#848E9C]">
                {invoices.length === 0 ? 'Belum ada invoice' : 'Tidak ada invoice yang cocok dengan filter'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2B3139]">
                    <th className="text-left py-3 px-4 text-[#848E9C] font-medium">Invoice</th>
                    <th className="text-left py-3 px-4 text-[#848E9C] font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-[#848E9C] font-medium">Nominal</th>
                    <th className="text-left py-3 px-4 text-[#848E9C] font-medium">TPC</th>
                    <th className="text-left py-3 px-4 text-[#848E9C] font-medium">Metode</th>
                    <th className="text-left py-3 px-4 text-[#848E9C] font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-[#848E9C] font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const statusConfig = getStatusConfig(invoice.status);
                    const Icon = statusConfig.icon;
                    const isReviewStatus = invoice.status === 'PENDING_REVIEW';
                    
                    return (
                      <tr 
                        key={invoice.id} 
                        className="border-b border-[#2B3139] hover:bg-[#2B3139]/30 cursor-pointer group"
                        onClick={() => navigate(`/id/admin/invoices/${invoice.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/id/admin/invoices/${invoice.id}`);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[#F0B90B] hover:text-[#F8D56B] font-medium transition-colors">
                              {invoice.invoice_no}
                            </span>
                            {isReviewStatus && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20 hover:bg-[#F0B90B]/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/id/admin/invoices/${invoice.id}`);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#848E9C] text-sm">
                          {maskEmail(invoice.email)}
                        </td>
                        <td className="py-3 px-4 text-white">
                          {invoice.base_currency === 'IDR' 
                            ? formatRupiah(invoice.amount_input)
                            : `$${invoice.amount_usd?.toFixed(2)}`
                          }
                        </td>
                        <td className="py-3 px-4 text-[#F0B90B] font-medium">
                          {formatNumberID(invoice.tpc_amount)}
                        </td>
                        <td className="py-3 px-4 text-[#848E9C] text-sm">
                          {invoice.transfer_method || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-[#848E9C] text-sm">
                          {new Date(invoice.created_at).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
