import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Search, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  created_at: string;
  email_initial: string;
  email_current: string;
  member_code: string;
  referred_by?: string | null;
}

interface Sponsor {
  id: string;
  user_id: string;
  member_code: string;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            created_at,
            email_initial,
            email_current,
            member_code,
            referred_by
          `)
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('[ADMIN USERS] Error fetching profiles:', profilesError);
          return;
        }

        const profiles = profilesData || [];
        setProfiles(profiles);

        // Collect sponsor member codes (referred_by contains member_code)
        const sponsorCodes = [...new Set(
          profiles
            .map(p => p.referred_by)
            .filter(Boolean)
        )] as string[];

        // Fetch sponsors if any exist
        if (sponsorCodes.length > 0) {
          const { data: sponsorsData, error: sponsorsError } = await supabase
            .from('profiles')
            .select('id, user_id, member_code')
            .in('member_code', sponsorCodes);

          if (sponsorsError) {
            console.error('[ADMIN USERS] Error fetching sponsors:', sponsorsError);
          } else {
            setSponsors(sponsorsData || []);
          }
        }

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
      filtered = filtered.filter(profile => 
        (profile.email_current && profile.email_current.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.email_initial && profile.email_initial.toLowerCase().includes(searchTerm.toLowerCase())) ||
        profile.member_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm]);

  const getSponsor = (referredByCode: string | null) => {
    if (!referredByCode) return null;
    return sponsors.find(s => s.member_code === referredByCode);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
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
              placeholder="Cari email atau member code..."
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
                {profiles.length === 0 ? 'Belum ada user terdaftar' : 'Tidak ada user yang cocok dengan pencarian'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2B3139]">
                    <th className="text-left p-4 text-[#848E9C] font-medium">Register</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">Nama</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">Email</th>
                    <th className="text-left p-4 text-[#848E9C] font-medium">Sponsor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => {
                    const sponsor = getSponsor(profile.referred_by);
                    return (
                      <tr key={profile.id} className="border-b border-[#2B3139] hover:bg-[#0B0E11]/50">
                        <td className="p-4">
                          <div className="text-white text-sm">
                            {formatDate(profile.created_at)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">
                            User
                          </div>
                          <div className="text-[#F0B90B] text-xs mt-1">
                            {profile.member_code}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-[#F0B90B] text-sm">
                            {profile.email_current || profile.email_initial}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white text-sm">
                            {sponsor ? sponsor.member_code : '-'}
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
