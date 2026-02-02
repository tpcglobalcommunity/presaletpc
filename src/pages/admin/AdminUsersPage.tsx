import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: any;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.error('Error fetching users:', error);
          // Fallback to profiles table if admin.listUsers fails
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            return;
          }

          const mappedUsers = (profiles || []).map(profile => ({
            id: profile.user_id,
            email: profile.email_current,
            created_at: profile.created_at,
            last_sign_in_at: null,
            user_metadata: {
              member_code: profile.member_code,
              referred_by: profile.referred_by
            }
          }));

          setUsers(mappedUsers);
        } else {
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error('Error:', error);
        // Fallback to profiles table
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!profilesError) {
          const mappedUsers = (profiles || []).map(profile => ({
            id: profile.user_id,
            email: profile.email_current,
            created_at: profile.created_at,
            last_sign_in_at: null,
            user_metadata: {
              member_code: profile.member_code,
              referred_by: profile.referred_by
            }
          }));

          setUsers(mappedUsers);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata?.member_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm]);

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
          <span className="text-[#F0B90B] font-medium">{filteredUsers.length} User</span>
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

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
            <p className="text-[#848E9C] font-medium">
              {users.length === 0 ? 'Data users belum tersedia' : 'Tidak ada user yang cocok dengan pencarian'}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="bg-[#1E2329] border-[#2B3139] hover:border-[#F0B90B]/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F0B90B]/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#F0B90B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">
                        {user.email}
                      </div>
                      {user.user_metadata?.member_code && (
                        <Badge className="bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20 text-xs mt-1">
                          {user.user_metadata.member_code}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#848E9C]" />
                  <span className="text-[#848E9C]">Bergabung:</span>
                  <span className="text-white">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                
                {user.last_sign_in_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#848E9C]" />
                    <span className="text-[#848E9C]">Login terakhir:</span>
                    <span className="text-white">
                      {new Date(user.last_sign_in_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}

                {user.user_metadata?.referred_by && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-[#F0B90B]" />
                    <span className="text-[#848E9C]">Referred by:</span>
                    <span className="text-[#F0B90B] font-medium">
                      {user.user_metadata.referred_by}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#2B3139]">
                  <div className="text-[#848E9C] text-xs font-mono truncate">
                    ID: {user.id}
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
