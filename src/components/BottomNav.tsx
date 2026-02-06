import { Home, TrendingUp, User, Menu, Coins, Target } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { MenuDrawer } from './MenuDrawer';
import { useState } from 'react';
import { buildLoginUrl } from '@/lib/authRedirect';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { lang = 'en' } = useParams(); // Language from URL, default to 'en'

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const withLang = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${lang}${cleanPath}`;
  };

  // Dev-only regression guard
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const checkRegression = () => {
      const currentPathname = window.location.pathname;
      
      // If we detect hardcoded language paths in navigation
      if (currentPathname.startsWith('/en') || currentPathname.startsWith('/id')) {
        // Check if any navigation action used hardcoded paths
        const navButtons = document.querySelectorAll('button[onclick*="navigate"]');
        navButtons.forEach(button => {
          const onClick = button.getAttribute('onclick');
          if (onClick && (onClick.includes('"/en"') || onClick.includes('"/id"'))) {
            console.error('🚨 REGRESSION: hardcoded language path detected in navigation', {
              componentName: 'BottomNav',
              onClick,
              currentPathname
            });
          }
        });
      }
    };
    
    // Check on route changes
    window.addEventListener('popstate', checkRegression);
    
    // Check immediately
    setTimeout(checkRegression, 100);
  }

  const navItems = [
    { icon: Home, label: 'Home', path: withLang('/') },
    { icon: TrendingUp, label: 'Market', path: withLang('market') },
    { 
      icon: Coins, 
      label: 'Presale', 
      path: withLang('presale'),
      isPrimary: true,
      requiresAuth: false // ✅ PUBLIC - tidak memerlukan auth
    },
    { 
      icon: User, 
      label: user ? 'Account' : 'Login', 
      path: user ? withLang('member') : withLang('login') 
    },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              if (item.requiresAuth && !user) {
                // Redirect to login with returnTo
                navigate(buildLoginUrl(lang, item.path));
              } else {
                navigate(withLang(item.path));
              }
            }}
            className={`flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-xl transition-all ${
              item.isPrimary
                ? 'relative -mt-6'
                : isActive(item.path)
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
        ))}
        
        {/* Menu button */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-xl text-muted-foreground hover:text-foreground transition-all">
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl bg-background-elevated border-border overflow-hidden flex flex-col">
            <SheetHeader className="shrink-0">
              <SheetTitle>Menu Navigasi</SheetTitle>
              <SheetDescription>
                Akses cepat ke fitur dan layanan TPC GLOBAL.
              </SheetDescription>
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
