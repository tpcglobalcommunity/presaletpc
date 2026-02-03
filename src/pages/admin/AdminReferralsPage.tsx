import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Search, Filter, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID } from '@/lib/number';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AdminReferral {
  referral_id: string;
  user_email: string;
  user_referral_code: string;
  parent_email: string | null;
  parent_referral_code: string | null;
  level: number;
  created_at: string;
}

export default function AdminReferralsPage() {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<AdminReferral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [totalReferrals, setTotalReferrals] = useState(0);

  const safeLang = lang === 'en' ? 'en' : 'id';
  const base = `/${safeLang}/admin`;

  // Fetch all referrals
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.rpc('get_all_referrals_admin');

        if (error) {
          console.error('Error fetching referrals:', error);
          toast({
            title: 'Error',
            description: 'Gagal memuat data referral',
            variant: 'destructive'
          });
          return;
        }

        setReferrals(data || []);
        setTotalReferrals(data?.length || 0);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [toast]);

  // Filter referrals
  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = !searchTerm || 
      referral.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.user_referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (referral.parent_email && referral.parent_email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = levelFilter === 'all' || referral.level.toString() === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C]">
      {/* Header */}
      <div className="relative bg-[#1E2329]/80 backdrop-blur-sm border-b border-[#2B3139] px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`${base}/dashboard`)}
              className="text-[#848E9C] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Referral Management</h1>
              <p className="text-[#848E9C] text-sm">
                Kelola jaringan referral 10 level
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#848E9C] text-base">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#F0B90B]/20 rounded-lg">
                  <Users className="h-6 w-6 text-[#F0B90B]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatNumberID(totalReferrals)}</p>
                  <p className="text-xs text-[#848E9C]">Total referral</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#848E9C] text-base">Active Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#10B981]/20 rounded-lg">
                  <Users className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">10</p>
                  <p className="text-xs text-[#848E9C]">Level aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2329] border-[#2B3139]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#848E9C] text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#059669]/20 rounded-lg">
                  <Users className="h-6 w-6 text-[#059669]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">Aktif</p>
                  <p className="text-xs text-[#848E9C]">Sistem referral berjalan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-[#1E2329] border-[#2B3139] mb-6">
          <CardHeader>
            <CardTitle className="text-white">Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
                  <Input
                    placeholder="Cari email atau kode referral..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0B0E11] border-[#2B3139] text-white placeholder-[#848E9C]"
                  />
                </div>
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#0B0E11] border-[#2B3139] text-white">
                  <SelectValue placeholder="Semua Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Level</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Daftar Referral</span>
              <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                {filteredReferrals.length} referral
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B] mx-auto"></div>
                <p className="text-[#848E9C] mt-4">Memuat data...</p>
              </div>
            ) : filteredReferrals.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-[#848E9C] mb-2">Belum ada referral</p>
                <p className="text-sm text-[#848E9C]">
                  Tidak ada data referral untuk ditampilkan
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#848E9C]">User</TableHead>
                      <TableHead className="text-[#848E9C]">Kode Referral</TableHead>
                      <TableHead className="text-[#848E99C]">Parent</TableHead>
                      <TableHead className="text-[#848E9C]">Kode Parent</TableHead>
                      <TableHead className="text-[#848E9C]">Level</TableHead>
                      <TableHead className="text-[#848E9C]">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.map((referral) => (
                      <TableRow key={referral.referral_id}>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{referral.user_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                            {referral.user_referral_code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {referral.parent_email ? (
                            <div>
                              <p className="text-white font-medium">{referral.parent_email}</p>
                            </div>
                          ) : (
                            <span className="text-[#848E9C]">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {referral.parent_referral_code ? (
                            <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">
                              {referral.parent_referral_code}
                            </Badge>
                          ) : (
                            <span className="text-[#848E9C]">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              referral.level === 1 
                                ? 'bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30'
                                : referral.level <= 3
                                ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30'
                                : 'bg-[#6B7280]/20 text-[#6B7280] border-[#6B7280]/30'
                            }
                          >
                            Level {referral.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#848E9C]">
                          {new Date(referral.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
