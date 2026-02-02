import { Shield, Lock, Settings, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ADMIN_USER_IDS } from '@/config/admin';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan Admin</h1>
        <p className="text-[#848E9C]">Konfigurasi sistem dan keamanan</p>
      </div>

      {/* Security Lock */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#F0B90B]" />
            Keamanan Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#F0B90B]/10 border border-[#F0B90B]/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-[#F0B90B]" />
              <span className="text-[#F0B90B] font-medium">Admin UUID Whitelist</span>
            </div>
            <div className="space-y-2">
              {ADMIN_USER_IDS.map((uuid, index) => (
                <div key={uuid} className="flex items-center gap-3">
                  <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                    Admin {index + 1}
                  </Badge>
                  <code className="text-white font-mono text-sm bg-black/30 px-2 py-1 rounded">
                    {uuid}
                  </code>
                </div>
              ))}
            </div>
            <div className="text-[#848E9C] text-xs mt-3">
              Hanya UUID yang terdaftar di atas yang dapat mengakses area admin.
              Perubahan harus dilakukan melalui kode sumber.
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Status Keamanan</span>
            </div>
            <div className="text-white text-sm">
              ✅ Admin access terkunci dengan UUID whitelist<br/>
              ✅ Semua aksi admin memerlukan autentikasi<br/>
              ✅ Row Level Security aktif untuk data user<br/>
              ✅ RPC functions dengan SECURITY DEFINER
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#848E9C]" />
            Pengaturan Sistem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#2B3139]">
              <span className="text-white">Environment</span>
              <Badge className="bg-[#2B3139] text-[#848E9C] border-[#3A3F47]">
                {import.meta.env.MODE}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-[#2B3139]">
              <span className="text-white">Database</span>
              <Badge className="bg-[#2B3139] text-[#848E9C] border-[#3A3F47]">
                Supabase PostgreSQL
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-[#2B3139]">
              <span className="text-white">Authentication</span>
              <Badge className="bg-[#2B3139] text-[#848E9C] border-[#3A3F47]">
                Supabase Auth
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-white">Storage</span>
              <Badge className="bg-[#2B3139] text-[#848E9C] border-[#3A3F47]">
                Supabase Storage
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-[#1E2329] border-[#2B3139]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-[#848E9C]" />
            Informasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-[#848E9C] text-sm space-y-2">
            <p>• Panel admin ini menggunakan keamanan berlapis dengan UUID whitelist</p>
            <p>• Semua perubahan konfigurasi sistem harus dilakukan melalui deployment kode</p>
            <p>• Log aktivitas admin akan segera tersedia di halaman Audit</p>
            <p>• Untuk bantuan teknis, hubungi tim development TPC Global</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
