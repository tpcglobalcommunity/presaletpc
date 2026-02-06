import { NavLink, useParams } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarNavProps {
  pendingReviewCount?: number;
}

const menuItems = [
  {
    title: 'Dashboard',
    href: (lang: string) => `/${lang}/admin`,
    icon: LayoutDashboard,
  },
  {
    title: 'Invoice Management',
    href: (lang: string) => `/${lang}/admin/invoices`,
    icon: FileText,
  },
  {
    title: 'User Management',
    href: (lang: string) => `/${lang}/admin/users`,
    icon: Users,
  },
  {
    title: 'Settings',
    href: (lang: string) => `/${lang}/admin/settings`,
    icon: Settings,
  },
  {
    title: 'Audit Log',
    href: (lang: string) => `/${lang}/admin/audit`,
    icon: History,
  },
];

export default function AdminSidebarNav({ pendingReviewCount }: AdminSidebarNavProps) {
  const { lang = 'id' } = useParams();
  
  // Safe badge count - never NaN
  const badge = Number.isFinite(pendingReviewCount) ? pendingReviewCount : 0;

  return (
    <nav className="flex-1 p-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const href = item.href(lang);
        
        return (
          <NavLink
            key={item.title}
            to={href}
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20'
                  : 'text-[#848E9C] hover:text-white hover:bg-[#2B3139]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </div>
            {item.hasBadge && badge > 0 && (
              <Badge 
                variant="secondary" 
                className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                {badge}
              </Badge>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
