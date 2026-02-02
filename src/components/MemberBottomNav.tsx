import { LayoutDashboard, History, Share2, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function MemberBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/id/dashboard') {
      return location.pathname === '/id/dashboard' || location.pathname.startsWith('/id/dashboard/invoices');
    }
    return location.pathname === path;
  };

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/id/dashboard',
      activeColor: 'text-blue-500',
      activeBg: 'bg-blue-500/15'
    },
    { 
      icon: History, 
      label: 'Riwayat', 
      path: '/id/dashboard/history',
      activeColor: 'text-green-500',
      activeBg: 'bg-green-500/15'
    },
    { 
      icon: Share2, 
      label: 'Referral', 
      path: '/id/dashboard/referral',
      activeColor: 'text-purple-500',
      activeBg: 'bg-purple-500/15'
    },
    { 
      icon: Settings, 
      label: 'Pengaturan', 
      path: '/id/dashboard/settings',
      activeColor: 'text-orange-500',
      activeBg: 'bg-orange-500/15'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center min-w-[72px] py-2 px-3 rounded-2xl transition-all duration-300 group"
            >
              {/* Active Background Indicator */}
              <div 
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  active 
                    ? `${item.activeBg} scale-100` 
                    : 'scale-0 bg-transparent group-hover:scale-100 group-hover:bg-muted/50'
                }`}
              />
              
              {/* Icon Container */}
              <div className="relative z-10 mb-1.5">
                <div 
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    active 
                      ? `${item.activeBg} ${item.activeColor} scale-110` 
                      : 'text-muted-foreground group-hover:text-foreground group-hover:scale-105'
                  }`}
                >
                  <item.icon 
                    className={`h-5 w-5 transition-all duration-300 ${
                      active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                    }`} 
                  />
                </div>
                
                {/* Active Dot Indicator */}
                {active && (
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${item.activeColor.replace('text-', 'bg-')}`} />
                )}
              </div>
              
              {/* Label */}
              <span 
                className={`relative z-10 text-[11px] font-medium transition-all duration-300 ${
                  active 
                    ? item.activeColor
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
