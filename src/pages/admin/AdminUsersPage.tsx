import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Search, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  member_code: string;
  role_name: string;
  created_at: string;
  total_invoices: number;
  paid_invoices: number;
  total_revenue: number;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase.rpc('get_admin_users_data');

        if (error) {
          console.error('[ADMIN USERS] Error fetching profiles:', error);
          return;
        }

        // Filter only members (role_name = 'member')
        const memberProfiles = (data || []).filter(profile => profile.role_name === 'member');
        setProfiles(memberProfiles);
      } catch (error) {
        console.error('[ADMIN USERS] Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(profile => 
        (profile.email && profile.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.full_name && profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        profile.member_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm]);

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case 'member':
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Member</Badge>;
    }
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
          <h1 className="text-2xl font-bold text-white">Daftar User</h1>
          <p className="text-[#848E9C]">Kelola semua user terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#F0B90B]" />
          <span className="text-[#F0B90B] font-medium">{filteredProfiles.length} User</span>
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

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
            <p className="text-[#848E9C] font-medium">
              {profiles.length === 0 ? 'Data users belum tersedia' : 'Tidak ada user yang cocok dengan pencarian'}
            </p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <Card key={profile.id} className="bg-[#1E2329] border-[#2B3139] hover:border-[#F0B90B]/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F0B90B]/20 flex items-center justify-center">
                      {profile.role_name === 'admin' ? (
                        <Shield className="h-5 w-5 text-[#F0B90B]" />
                      ) : (
                        <Users className="h-5 w-5 text-[#F0B90B]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-lg truncate select-text">
                        {profile.full_name || 'Nama tidak tersedia'}
                      </div>
                      <div className="text-[#F0B90B] text-sm truncate select-text mt-1 font-medium">
                        {profile.email || 'Email tidak tersedia'}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className="bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20 text-xs">
                          {profile.member_code}
                        </Badge>
                        {getRoleBadge(profile.role_name)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#848E9C]" />
                  <span className="text-[#848E9C]">Bergabung:</span>
                  <span className="text-white">
                    {new Date(profile.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#2B3139]">
                  <div className="text-[#848E9C] text-xs font-mono truncate">
                    ID: {profile.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
