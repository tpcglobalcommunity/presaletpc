import { NavLink, useLocation, useParams } from 'react-router-dom';
import { Home, Shield, LogIn } from 'lucide-react';

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

  // Simple inline copy
  const navCopy = {
    id: {
      home: 'Beranda',
      antiScam: 'Anti-Scam',
      login: 'Masuk'
    },
    en: {
      home: 'Home',
      antiScam: 'Anti-Scam',
      login: 'Login'
    }
  };

  const t = navCopy[lang as keyof typeof navCopy];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="flex items-center justify-around py-2">
        <NavLink
          to={`/${lang}`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">{t.home}</span>
        </NavLink>

        <NavLink
          to={`/${lang}/anti-scam`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <Shield className="h-5 w-5" />
          <span className="text-xs font-medium">{t.antiScam}</span>
        </NavLink>

        <NavLink
          to={`/${lang}/login`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <LogIn className="h-5 w-5" />
          <span className="text-xs font-medium">{t.login}</span>
        </NavLink>
      </div>
    </div>
  );
}
