import { useNavigate, useLocation } from 'react-router-dom';
import { memberNavConfig, getActiveNavItem } from '@/config/memberNav';
import { useAuth } from '@/contexts/AuthContext';

export function MemberBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { safeSignOut } = useAuth();
  
  const activeItem = getActiveNavItem(location.pathname);

  const handleNavClick = (item: any) => {
    if (item.id === 'logout') {
      safeSignOut();
      navigate('/id');
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#1E2329] via-[#1E2329]/95 to-[#1E2329]/90 backdrop-blur-xl border-t border-[#2B3139]/50 safe-area-pb">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto overflow-x-auto">
        {memberNavConfig.map((item) => {
          const isActive = activeItem?.id === item.id;
          const isLogout = item.id === 'logout';
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`relative flex flex-col items-center justify-center min-w-[60px] py-2 px-2 rounded-2xl transition-all duration-300 group flex-shrink-0 ${
                isLogout ? 'hover:bg-red-500/10' : ''
              }`}
            >
              {/* Active Background Indicator */}
              <div 
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? `${item.activeColor ? item.activeColor.replace('text-', 'bg-') + '/15' : 'bg-blue-500/15'} scale-100 shadow-lg` 
                    : 'scale-0 bg-transparent group-hover:scale-100 group-hover:bg-muted/50'
                }`}
              />
              
              {/* Icon Container */}
              <div className="relative z-10 mb-1">
                <div 
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? `${item.activeColor ? item.activeColor.replace('text-', 'bg-') + '/15' : 'bg-blue-500/15'} ${item.activeColor || 'text-blue-500'} scale-110 shadow-md` 
                      : isLogout
                        ? 'text-gray-400 group-hover:text-red-500'
                        : 'text-muted-foreground group-hover:text-foreground'
                  } group-hover:scale-105`}
                >
                  <item.icon 
                    className={`h-4 w-4 transition-all duration-300 ${
                      isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                    }`} 
                  />
                </div>
                
                {/* Active Dot Indicator */}
                {isActive && (
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${item.activeColor ? item.activeColor.replace('text-', 'bg-') : 'bg-blue-500'} shadow-sm`} />
                )}
              </div>
              
              {/* Label */}
              <span 
                className={`relative z-10 text-[10px] font-medium transition-all duration-300 ${
                  isActive 
                    ? `${item.activeColor || 'text-blue-500'} font-semibold`
                    : isLogout
                      ? 'text-gray-400 group-hover:text-red-500'
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
