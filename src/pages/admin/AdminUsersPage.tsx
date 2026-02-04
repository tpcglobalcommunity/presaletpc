import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Search, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  member_code: string;
  referred_by: string | null;
  role_name: string;
  created_at: string;
  total_invoices: number;
  paid_invoices: number;
  total_revenue: number;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<AdminUser[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch admin users data via RPC
        const { data: profilesData, error: profilesError } = await supabase
          .rpc('get_admin_users_data');

        if (profilesError) {
          console.error('[ADMIN USERS] Error fetching profiles:', profilesError);
          return;
        }

        // Filter only members and sort by created_at desc
        const profiles = (profilesData || [])
          .filter(user => user.role_name === 'member')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setProfiles(profiles);

      } catch (error) {
        console.error('[ADMIN USERS] Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(profile => {
        const email = (profile.email || "").toLowerCase();
        const fullName = (profile.full_name || "").toLowerCase();
        const memberCode = (profile.member_code || "").toLowerCase();
        return email.includes(q) || fullName.includes(q) || memberCode.includes(q);
      });
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getDisplayName = (profile: AdminUser) => {
    // Use full_name from RPC, fallback to member_code
    return profile.full_name || profile.member_code || "Member";
  };

  const getEmail = (profile: AdminUser) => {
    return profile.email || "Email tidak tersedia";
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
          <h1 className="text-2xl font-bold text-white">Daftar Member</h1>
          <p className="text-[#848E9C]">Kelola semua member terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#F0B90B]" />
          <span className="text-[#F0B90B] font-medium">{filteredProfiles.length} Member</span>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
            <Input
              placeholder="Cari nama, email, atau member code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#2B3139] border-[#3A3F47] text-white placeholder-[#848E9C]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardContent className="p-0">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
              <p className="text-[#848E9C] font-medium">
                {profiles.length === 0 ? 'Belum ada member terdaftar' : 'Tidak ada member yang cocok dengan pencarian'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2B3139] bg-[#0B0E11]/30">
                    <th className="text-left p-4 text-[#848E9C] font-medium">Tanggal Register</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">Nama</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">Email</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">Sponsor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => {
                    return (
                      <tr key={profile.id} className="border-b border-[#2B3139] hover:bg-[#0B0E11]/30 transition-colors">
                        <td className="p-4">
                          <div className="text-gray-400 text-sm font-medium">
                            {formatDate(profile.created_at)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">
                            {getDisplayName(profile)}
                          </div>
                          <div className="text-[#F0B90B] text-xs mt-1">
                            {profile.member_code}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-[#F0B90B] text-sm">
                            {getEmail(profile)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-300 text-sm">
                            {profile.referred_by || '-'}
                          </div>
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
