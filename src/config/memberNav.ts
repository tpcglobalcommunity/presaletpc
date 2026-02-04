import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  Share2, 
  Settings,
  ArrowUpRight,
  User,
  LogOut
} from 'lucide-react';

export interface MemberNavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  activeColor?: string;
  activeMatcher?: (pathname: string) => boolean;
  badge?: {
    text: string;
    color: string;
  };
  action?: () => void;
}

export const memberNavConfig: MemberNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/id/member',
    activeColor: 'text-blue-500',
    activeMatcher: (pathname) => 
      pathname === '/id/member' || 
      pathname === '/id/member/dashboard' ||
      pathname === '/id/dashboard/member'
  },
  {
    id: 'invoices',
    label: 'Invoice',
    icon: FileText,
    path: '/id/member/invoices',
    activeColor: 'text-green-500',
    activeMatcher: (pathname) => 
      pathname === '/id/member/invoices' || 
      pathname.startsWith('/id/member/invoices/')
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Wallet,
    path: '/id/member/wallet',
    activeColor: 'text-[#F0B90B]',
    activeMatcher: (pathname) => pathname === '/id/member/wallet'
  },
  {
    id: 'referrals',
    label: 'Referral',
    icon: Share2,
    path: '/id/member/referrals',
    activeColor: 'text-purple-500',
    activeMatcher: (pathname) => pathname === '/id/member/referrals'
  },
  {
    id: 'withdraw',
    label: 'Withdraw',
    icon: ArrowUpRight,
    path: '/id/member/withdraw',
    activeColor: 'text-red-500',
    activeMatcher: (pathname) => pathname === '/id/member/withdraw'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/id/member/profile',
    activeColor: 'text-cyan-500',
    activeMatcher: (pathname) => pathname === '/id/member/profile'
  },
  {
    id: 'settings',
    label: 'Pengaturan',
    icon: Settings,
    path: '/id/member/settings',
    activeColor: 'text-orange-500',
    activeMatcher: (pathname) => pathname === '/id/member/settings'
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    path: '#logout',
    activeColor: 'text-gray-500',
    activeMatcher: (pathname) => false,
    action: () => {
      // Will be implemented in component
      console.log('Logout action');
    }
  }
];

export const getActiveNavItem = (pathname: string): MemberNavItem | null => {
  return memberNavConfig.find(item => item.activeMatcher?.(pathname) || pathname === item.path) || null;
};

export const getNavItemById = (id: string): MemberNavItem | null => {
  return memberNavConfig.find(item => item.id === id) || null;
};
