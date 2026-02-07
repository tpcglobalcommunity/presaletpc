import { NavLink, useLocation, useParams } from 'react-router-dom';
import { Home, TrendingUp, Coins, LogIn, Menu, CircleHelp, LucideIcon } from 'lucide-react';
import { publicPath } from '@/lib/publicPath';

type NavItem = {
  key: string;
  to: string;
  label: string;
  icon?: LucideIcon;
};

export default function PublicBottomNav() {
  const location = useLocation();
  const { lang = 'en' } = useParams<{ lang: string }>();

  // Only show on public pages (not member/admin)
  const isPublicPage = location.pathname.startsWith(`/${lang}`) && 
                      !location.pathname.includes('/member') && 
                      !location.pathname.includes('/admin');

  if (!isPublicPage) {
    return null;
  }

  // Icon mapping with runtime safety
  const iconMap: Record<string, LucideIcon> = {
    Home,
    TrendingUp,
    Coins,
    LogIn,
    Menu
  };

  // Navigation items - always EN labels
  const navItems = [
    { id: 'home', label: 'Home', icon: 'Home', hrefBase: '' },
    { id: 'presale', label: 'Presale', icon: 'Coins', hrefBase: 'presale' },
    { id: 'market', label: 'Market', icon: 'TrendingUp', hrefBase: 'market' },
    { id: 'academy', label: 'Academy', icon: 'TrendingUp', hrefBase: 'academy' },
    { id: 'login', label: 'Login', icon: 'LogIn', hrefBase: 'login' }
  ];

  return (
    <div className="bg-[#0B0E11]/95 backdrop-blur-sm border-t border-gray-800">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const href = item.hrefBase ? publicPath(lang as 'en' | 'id', item.hrefBase) : publicPath(lang as 'en' | 'id', '/');
          
          // Runtime safety guard
          if (!Icon) {
            console.warn(`Icon not found for nav item: ${item.icon}, using fallback`);
            return (
              <NavLink
                key={item.id}
                to={href}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-yellow-400'
                      : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                <CircleHelp className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          }
          
          return (
            <NavLink
              key={item.id}
              to={href}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
