import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Globe, Shield, Moon, Sun, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function MemberSettingsPage() {
  const { user, safeSignOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await safeSignOut();
      toast({ title: 'Berhasil logout' });
      navigate('/id');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Gagal logout', variant: 'destructive' });
    }
  };

  const handleProfile = () => {
    navigate('/id/member/profile');
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] pb-20">
      {/* Header */}
      <div className="bg-[#1E2329] border-b border-[#2B3139] px-4 py-3">
        <h1 className="text-white font-semibold text-lg">Pengaturan</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Account Settings */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-[#F0B90B]" />
            Akun
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={handleProfile}
              className="w-full bg-[#2B3139]/50 hover:bg-[#2B3139]/70 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-between transition-colors"
            >
              <span>Profil Saya</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button className="w-full bg-[#2B3139]/50 hover:bg-[#2B3139]/70 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-between transition-colors">
              <span>Ubah Password</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-500" />
            Preferensi
          </h2>
          
          <div className="space-y-4">
            {/* Language */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Bahasa</div>
                <div className="text-[#848E9C] text-sm">Pilih bahasa tampilan</div>
              </div>
              <select className="bg-[#2B3139]/50 text-white border border-[#2B3139] rounded-lg px-3 py-2 text-sm">
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Mode Gelap</div>
                <div className="text-[#848E9C] text-sm">Gunakan tema gelap</div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-green-500" />
            Notifikasi
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Notifikasi Aplikasi</div>
                <div className="text-[#848E9C] text-sm">Terima notifikasi dalam aplikasi</div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Email Notifikasi</div>
                <div className="text-[#848E9C] text-sm">Terima notifikasi via email</div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <h2 className="text-white font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-500" />
            Keamanan
          </h2>
          
          <div className="space-y-3">
            <button className="w-full bg-[#2B3139]/50 hover:bg-[#2B3139]/70 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-between transition-colors">
              <span>Two-Factor Authentication</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button className="w-full bg-[#2B3139]/50 hover:bg-[#2B3139]/70 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-between transition-colors">
              <span>Riwayat Login</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <h2 className="text-red-400 font-semibold mb-4">Zona Berbahaya</h2>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
