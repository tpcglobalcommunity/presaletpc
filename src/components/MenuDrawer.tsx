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
  Star,
  Wallet
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

interface MenuDrawerProps {
  onClose: () => void;
}

export function MenuDrawer({ onClose }: MenuDrawerProps) {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { lang = 'id' } = useParams();

  const withLang = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${lang}/${cleanPath}`;
  };

  const handleNav = (path: string) => {
    navigate(withLang(path));
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate(`/${lang}`);
  };

  const publicItems = [
    { icon: Shield, label: lang === 'en' ? 'Transparency' : 'Transparansi', path: 'transparansi' },
    { icon: AlertTriangle, label: lang === 'en' ? 'Anti-Scam' : 'Anti-Scam', path: 'anti-scam' },
    { icon: Wallet, label: lang === 'en' ? 'Phantom Wallet Tutorial' : 'Tutorial Phantom Wallet', path: 'tutorial/phantom-wallet' },
    { icon: Crown, label: lang === 'en' ? 'Verified Coordinators' : 'Koordinator Resmi', path: 'verified-coordinators' },
    { icon: Star, label: lang === 'en' ? 'TPC Chapters' : 'TPC Chapters', path: 'chapters' },
    { icon: BookOpen, label: lang === 'en' ? 'Education' : 'Edukasi', path: 'edukasi' },
    { icon: FileTextIcon, label: lang === 'en' ? 'Whitepaper' : 'Whitepaper', path: 'whitepaper' },
    { icon: Users, label: lang === 'en' ? 'DAO Lite' : 'DAO Lite', path: 'dao' },
    { icon: HelpCircle, label: lang === 'en' ? 'FAQ' : 'FAQ', path: 'faq' },
    { icon: FileText, label: lang === 'en' ? 'Terms & Conditions' : 'Syarat dan Ketentuan', path: 'syarat-ketentuan' },
    { icon: FileText, label: lang === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi', path: 'kebijakan-privasi' },
  ];

  const memberItems = [
    { icon: FileText, label: lang === 'en' ? 'Invoice' : 'Invoice', path: 'member/invoices', subtext: lang === 'en' ? 'TPC purchase history' : 'Riwayat pembelian TPC' },
    { icon: History, label: lang === 'en' ? 'Invoice History' : 'Riwayat Invoice', path: 'dashboard/history' },
    { icon: Share2, label: lang === 'en' ? 'My Referrals' : 'Referral Saya', path: 'member/referrals' },
    { icon: Settings, label: lang === 'en' ? 'Settings' : 'Pengaturan', path: 'dashboard/settings' },
  ];

  const adminItems = [
    { icon: LayoutDashboard, label: lang === 'en' ? 'Admin Dashboard' : 'Admin Dashboard', path: 'admin' },
    { icon: Cog, label: lang === 'en' ? 'Admin Settings' : 'Admin Settings', path: 'admin/settings' },
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
