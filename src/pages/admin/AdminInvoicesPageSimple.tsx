import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, Search, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID, formatRupiah } from '@/lib/number';
import { useToast } from '@/hooks/use-toast';

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

type FilterStatus = 'all' | 'UNPAID' | 'PENDING_REVIEW' | 'PAID' | 'CANCELLED';

export default function AdminInvoicesPage() {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('invoices')
          .select('id, invoice_no, status, amount_input, base_currency, amount_usd, tpc_amount, created_at, email')
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
      <div className="p-6">
        <div className="animate-pulse rounded-lg h-8 w-8 border-b-2 border-[#F0B90B] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Manajemen Invoice</h1>
        <p className="text-[#848E9C]">Kelola semua invoice pembelian TPC</p>
      </div>

      {/* Filters */}
      <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
              <Input
                placeholder="Cari invoice atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2B3139] border-[#3A3F47] text-white placeholder-[#848E9C] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/40 focus:border-[#F0B90B]/50"
              />
            </div>
          </div>
          <div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
              <SelectTrigger className="w-full bg-[#2B3139] border-[#3A3F47] text-white">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#2B3139] border-[#3A3F47]">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                <SelectItem value="PAID">Lunas</SelectItem>
                <SelectItem value="UNPAID">Belum Bayar</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
            <p className="text-[#848E9C]">Tidak ada invoice ditemukan</p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => {
            const statusConfig = getStatusConfig(invoice.status);
            const Icon = statusConfig.icon;
            
            return (
              <Card key={invoice.id} className="bg-[#1E2329] border border-[#2B3139] hover:border-[#F0B90B]/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">{invoice.invoice_no}</h3>
                        <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="text-[#848E9C] text-sm">
                        {maskEmail(invoice.email)} • {new Date(invoice.created_at).toLocaleDateString('id-ID')}
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
                  </div>
                  <Button
                    onClick={() => navigate(`/${lang}/admin/invoices/${invoice.id}`)}
                    className="ml-4 bg-[#F0B90B] hover:bg-[#F8D56B] text-black"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
