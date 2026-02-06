import { NavLink, useLocation, useParams } from 'react-router-dom';
import { Home, TrendingUp, Coins, LogIn, Menu } from 'lucide-react';
import { publicBottomNavItems } from '@/config/publicBottomNav';

export default function PublicBottomNav() {
  const location = useLocation();
  const { lang = 'id' } = useParams<{ lang: string }>();

  // Only show on public pages (not member/admin)
  const isPublicPage = location.pathname.startsWith(`/${lang}`) && 
                      !location.pathname.includes('/member') && 
                      !location.pathname.includes('/admin');

  if (!isPublicPage) {
    return null;
  }

  // Derive lang ONLY to build URL
  const safeLang = lang === 'en' ? 'en' : 'id';

  // Icon mapping
  const iconMap = {
    Home,
    TrendingUp,
    Coins,
    LogIn,
    Menu
  } as const;

  // Hardcoded English labels
  const labels = {
    home: 'Home',
    market: 'Market',
    presale: 'Presale',
    login: 'Login',
    menu: 'Menu'
  } as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="flex items-center justify-around py-2">
        {publicBottomNavItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const href = item.hrefBase ? `/${safeLang}/${item.hrefBase}` : `/${safeLang}`;
          
          return (
            <NavLink
              key={item.id}
              to={href}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{labels[item.id as keyof typeof labels]}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
