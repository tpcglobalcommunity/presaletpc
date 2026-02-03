import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function MemberProfilePage() {
  const { user, profile, safeSignOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await safeSignOut();
      toast({ title: 'Berhasil logout' });
      navigate('/id');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Gagal logout', variant: 'destructive' });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] pb-20">
      {/* Header */}
      <div className="bg-[#1E2329] border-b border-[#2B3139] px-4 py-3">
        <h1 className="text-white font-semibold text-lg">Profil Saya</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#F0B90B] flex items-center justify-center">
              <User className="h-8 w-8 text-black" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">Member TPC</div>
              <div className="text-[#848E9C] text-sm">Verified Member</div>
            </div>
          </div>
        </div>

        {/* Email Info */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="h-5 w-5 text-[#848E9C]" />
            <span className="text-white font-medium">Email</span>
          </div>
          <div className="bg-[#2B3139]/50 rounded-lg p-3">
            <div className="text-white text-sm">{user?.email}</div>
          </div>
          <div className="text-[#848E9C] text-xs mt-2">Email tidak dapat diubah</div>
        </div>

        {/* Wallet Info */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="h-5 w-5 text-[#F0B90B]" />
            <span className="text-white font-medium">Wallet TPC</span>
          </div>
          <div className="bg-[#2B3139]/50 rounded-lg p-3">
            <div className="text-white text-sm font-mono">
              {/* Will show wallet from latest paid invoice or placeholder */}
              {'-'}
            </div>
          </div>
          <div className="text-[#848E9C] text-xs mt-2">
            Wallet TPC akan muncul setelah pembelian pertama berhasil
          </div>
        </div>

        {/* Member Since */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#848E9C] text-sm">Bergabung Sejak</div>
              <div className="text-white font-medium">
                {user?.created_at 
                  ? new Date(user.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : '-'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/id/dashboard/settings')}
            className="w-full bg-[#1E2329] border border-[#2B3139] hover:border-[#F0B90B]/50 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <User className="h-5 w-5" />
            Pengaturan Akun
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Support */}
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Bantuan</h3>
          <div className="space-y-2 text-sm">
            <div className="text-[#848E9C]">
              Butuh bantuan? Hubungi kami melalui:
            </div>
            <div className="space-y-1">
              <div className="text-white">• Email: support@tpc.global</div>
              <div className="text-white">• Telegram: @TPCSupport</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
