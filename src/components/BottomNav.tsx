import { Home, TrendingUp, User, Menu, Coins } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { MenuDrawer } from './MenuDrawer';
import { useEffect, useMemo, useState } from 'react';
import { buildLoginUrl } from '@/lib/authRedirect';

type Lang = 'en' | 'id';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const params = useParams();
  const lang = ((params.lang as Lang) || 'en') as Lang;

  const [menuOpen, setMenuOpen] = useState(false);

  // Build "/{lang}/{path}" dengan aman, tanpa "/en/en" dan tanpa "/enmarket"
  const withLang = (path: string) => {
    // normalisasi input
    let p = path.trim();
    if (!p.startsWith('/')) p = `/${p}`;
    // dedupe prefix kalau sudah ada /en atau /id
    p = p.replace(/^\/(en|id)(?=\/|$)/, '');
    // root case
    if (p === '') p = '/';
    return `/${lang}${p}`;
  };

  const isActive = (rawPath: string) => location.pathname === withLang(rawPath);

  const navItems = useMemo(
    () => [
      { icon: Home, label: 'Home', rawPath: '/' },
      { icon: TrendingUp, label: 'Market', rawPath: '/market' },
      {
        icon: Coins,
        label: 'Presale',
        rawPath: '/presale',
        isPrimary: true,
        requiresAuth: false, // PUBLIC
      },
      {
        icon: User,
        label: user ? 'Account' : 'Login',
        rawPath: user ? '/member' : '/login',
        requiresAuth: false,
      },
    ],
    [user]
  );

  // Dev-only regression guard (jangan bikin listener tiap render)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const checkRegression = () => {
      const currentPathname = window.location.pathname;

      // Kalau route sudah /en atau /id, pastikan kita tidak menghasilkan /en/en atau /id/id
      if (/^\/(en|id)\//.test(currentPathname) && /^\/(en|id)\/\1\//.test(currentPathname)) {
        console.error('🚨 REGRESSION: duplicate language prefix detected', {
          componentName: 'BottomNav',
          currentPathname,
        });
      }
    };

    window.addEventListener('popstate', checkRegression);
    const t = window.setTimeout(checkRegression, 50);

    return () => {
      window.removeEventListener('popstate', checkRegression);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const href = withLang(item.rawPath);

          return (
            <button
              key={item.rawPath}
              onClick={() => {
                if (item.requiresAuth && !user) {
                  // buildLoginUrl(lang, returnTo)
                  navigate(buildLoginUrl(lang, href));
                } else {
                  navigate(href);
                }
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-xl transition-all ${
                item.isPrimary
                  ? 'relative -mt-6'
                  : isActive(item.rawPath)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.isPrimary ? (
                <div className="btn-gold rounded-full p-4 animate-pulse-gold">
                  <item.icon className="h-6 w-6" />
                </div>
              ) : (
                <>
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}

              {item.isPrimary && (
                <span className="text-xs font-bold text-primary mt-1">{item.label}</span>
              )}
            </button>
          );
        })}

        {/* Menu button */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-xl text-muted-foreground hover:text-foreground transition-all">
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[80vh] rounded-t-3xl bg-background-elevated border-border overflow-hidden flex flex-col"
          >
            <SheetHeader className="shrink-0">
              <SheetTitle>Menu Navigasi</SheetTitle>
              <SheetDescription>Akses cepat ke fitur dan layanan TPC GLOBAL.</SheetDescription>
            </SheetHeader>

            <div className="mt-4 flex-1 overflow-y-auto pb-safe">
              <MenuDrawer onClose={() => setMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
