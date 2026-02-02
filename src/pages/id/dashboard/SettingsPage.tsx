import { useState } from 'react';
import { 
  Settings, 
  User, 
  Mail, 
  LogOut, 
  ChevronRight,
  Shield,
  Bell,
  Moon,
  Globe,
  Smartphone,
  Copy,
  Check,
  ArrowLeft,
  Crown,
  Wallet,
  Users,
  ExternalLink,
  FileText,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SettingRow } from '@/components/settings/SettingRow';

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate('/id');
    } catch (error) {
      toast({ title: 'Gagal keluar', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({ title: `${type} tersalin!` });
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      toast({ title: 'Gagal menyalin', variant: 'destructive' });
    }
  };

  const menuItems = [
    { icon: Shield, label: 'Security', desc: 'Password & 2FA', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', href: '#' },
    { icon: Bell, label: 'Notifications', desc: 'Push & email alerts', color: 'text-amber-400', bgColor: 'bg-amber-400/10', href: '#' },
    { icon: Moon, label: 'Appearance', desc: 'Dark mode settings', color: 'text-purple-400', bgColor: 'bg-purple-400/10', href: '#' },
    { icon: Globe, label: 'Language', desc: 'English / Indonesia', color: 'text-blue-400', bgColor: 'bg-blue-400/10', href: '#' },
    { icon: Smartphone, label: 'Device Management', desc: 'Active sessions', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', href: '#' },
  ];

  const referralStats = {
    totalReferrals: 0,
    activeDownline: 0,
    totalEarnings: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Strip */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0B90B]/10 via-transparent to-transparent h-1" />
        
        <div className="relative bg-[#1E2329]/80 backdrop-blur-sm border-b border-[#2B3139] px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/id/dashboard')}
                  className="flex items-center gap-2 text-[#848E9C] hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="text-sm">Kembali</span>
                </button>
                <div className="h-8 w-px bg-[#2B3139]" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-[#F0B90B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-3xl font-bold text-white">Pengaturan</h1>
                      <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                        Member
                      </Badge>
                    </div>
                    <p className="text-[#848E9C] text-sm">
                      Kelola keamanan, preferensi, dan akun kamu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Account Section */}
        <Card className="bg-[#11161C] border-[#1F2A33] rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-[#F0B90B]" />
              Akun
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              title="Email"
              description={user?.email || 'Loading...'}
              icon={Mail}
              right={
                <Badge variant="secondary" className="bg-[#848E9C]/20 text-[#848E9C]">
                  Read-only
                </Badge>
              }
            />
            
            <Separator className="bg-[#1F2A33]" />
            
            <SettingRow
              title="Member ID"
              description={profile?.member_code || 'Loading...'}
              icon={Crown}
              right={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(profile?.member_code || '', 'Member ID')}
                  className="border-[#1F2A33] hover:bg-[#F0B90B]/10 hover:border-[#F0B90B]/50"
                >
                  {copied === 'Member ID' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              }
            />
            
            <Separator className="bg-[#1F2A33]" />
            
            <SettingRow
              title="Keluar"
              description="Keluar dari akun kamu"
              icon={LogOut}
              right={
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isLoading ? 'Keluar...' : 'Keluar'}
                </Button>
              }
            />
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-[#11161C] border-[#1F2A33] rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              title="Metode Login"
              description="Google Authentication"
              icon={Lock}
              right={
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                  Terhubung
                </Badge>
              }
            />
            
            <Separator className="bg-[#1F2A33]" />
            
            <SettingRow
              title="Keamanan Akun"
              description="Akun kamu dilindungi dengan autentikasi Google"
              icon={Shield}
              right={
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                  Aman
                </Badge>
              }
            />
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="bg-[#11161C] border-[#1F2A33] rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Preferensi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              title="Bahasa"
              description="Indonesia"
              icon={Globe}
              right={
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  ID
                </Badge>
              }
            />
            
            <Separator className="bg-[#1F2A33]" />
            
            <SettingRow
              title="Tema"
              description="Mode gelap"
              icon={Moon}
              right={
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  Dark
                </Badge>
              }
            />
          </CardContent>
        </Card>

        {/* Legal & Help Section */}
        <Card className="bg-[#11161C] border-[#1F2A33] rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#848E9C]" />
              Legal & Bantuan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              title="Syarat & Ketentuan"
              description="Baca syarat dan ketentuan layanan"
              icon={ExternalLink}
              onClick={() => navigate('/id/syarat-ketentuan')}
              right={<ChevronRight className="h-4 w-4 text-[#848E9C]" />}
            />
            
            <Separator className="bg-[#1F2A33]" />
            
            <SettingRow
              title="Kebijakan Privasi"
              description="Pelajari cara kami melindungi data kamu"
              icon={ExternalLink}
              onClick={() => navigate('/id/kebijakan-privasi')}
              right={<ChevronRight className="h-4 w-4 text-[#848E9C]" />}
            />
            
            <Separator className="bg-[#1F2A33]" />
            
            <SettingRow
              title="FAQ"
              description="Pertanyaan yang sering diajukan"
              icon={ExternalLink}
              onClick={() => navigate('/id/faq')}
              right={<ChevronRight className="h-4 w-4 text-[#848E9C]" />}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
