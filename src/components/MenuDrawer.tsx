import { 
  Shield, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  HelpCircle,
  FileText,
  History,
  Share2,
  Settings,
  LogOut,
  LayoutDashboard,
  Cog,
  FileText as FileTextIcon,
  Crown,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

interface MenuDrawerProps {
  onClose: () => void;
}

export function MenuDrawer({ onClose }: MenuDrawerProps) {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate('/id');
  };

  const publicItems = [
    { icon: Shield, label: 'Transparansi', path: '/id/transparansi' },
    { icon: AlertTriangle, label: 'Anti-Scam', path: '/id/anti-scam' },
    { icon: Crown, label: 'Koordinator Resmi', path: '/id/verified-coordinators' },
    { icon: Star, label: 'TPC Chapters', path: '/id/chapters' },
    { icon: BookOpen, label: 'Edukasi', path: '/id/edukasi' },
    { icon: FileTextIcon, label: 'Whitepaper', path: '/id/whitepaper' },
    { icon: Users, label: 'DAO Lite', path: '/id/dao' },
    { icon: HelpCircle, label: 'FAQ', path: '/id/faq' },
    { icon: FileText, label: 'Syarat dan Ketentuan', path: '/id/syarat-ketentuan' },
  ];

  const memberItems = [
    { icon: FileText, label: 'Invoice', path: '/id/member/invoices', subtext: 'Riwayat pembelian TPC' },
    { icon: History, label: 'Riwayat Invoice', path: '/id/dashboard/history' },
    { icon: Share2, label: 'Referral Saya', path: '/id/member/referrals' },
    { icon: Settings, label: 'Pengaturan', path: '/id/dashboard/settings' },
  ];

  const adminItems = [
    { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/id/admin' },
    { icon: Cog, label: 'Admin Settings', path: '/id/admin/settings' },
  ];

  return (
    <div className="flex flex-col h-full pt-4 pb-20 overflow-y-auto">
      <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6 shrink-0" />
      
      <h2 className="text-title px-4 mb-4">Menu</h2>

      {/* Public Items */}
      <div className="space-y-1 px-2">
        {publicItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNav(item.path)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-foreground hover:bg-card transition-colors"
          >
            <item.icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Member Items */}
      {user && (
        <>
          <Separator className="my-4" />
          <h3 className="text-sm font-semibold text-muted-foreground px-4 mb-2">MEMBER</h3>
          <div className="space-y-1 px-2">
            {memberItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-foreground hover:bg-card transition-colors"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.label}</span>
                  {item.subtext && (
                    <span className="text-xs text-muted-foreground">{item.subtext}</span>
                  )}
                </div>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </>
      )}

      {/* Admin Items */}
      {isAdmin && (
        <>
          <Separator className="my-4" />
          <h3 className="text-sm font-semibold text-warning px-4 mb-2">SUPER ADMIN</h3>
          <div className="space-y-1 px-2">
            {adminItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-foreground hover:bg-warning/10 transition-colors"
              >
                <item.icon className="h-5 w-5 text-warning" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
