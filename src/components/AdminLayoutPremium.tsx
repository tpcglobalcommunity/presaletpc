import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  TrendingUp,
  Shield,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: ReactNode;
  href: string;
  badge?: string;
  children?: MenuItem[];
}

export function AdminLayoutPremium() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    total_users: 0,
    pending_review: 0
  });

  useEffect(() => {
    const fetchSidebarStats = async () => {
      const { data, error } = await supabase.rpc('get_dashboard_stats_admin');
      if (!error && data && data.length > 0) {
        const dashboardData = data[0] as {
          total_users: number;
          total_invoices: number;
          unpaid_invoices: number;
          paid_invoices: number;
          total_referrals: number;
        };
        setStats({
          total_users: dashboardData.total_users,
          pending_review: dashboardData.total_invoices - dashboardData.paid_invoices // Calculate pending
        });
      }
    };

    fetchSidebarStats();
  }, []);

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/id/admin',
    },
    {
      title: 'User Management',
      icon: <Users className="h-5 w-5" />,
      href: '/id/admin/users',
      badge: stats.total_users.toString(), // Angka otomatis dari DB
    },
    {
      title: 'Invoice Management',
      icon: <FileText className="h-5 w-5" />,
      href: '/id/admin/invoices',
      badge: stats.pending_review.toString(), // Menunjukkan jumlah yang perlu diperiksa
    },
    {
      title: 'Analytics',
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/id/admin/analytics',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/id/admin/settings',
    },
  ];


  const handleLogout = async () => {
    await signOut();
    navigate('/id', { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#070B14] via-[#070B14] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
          <p className="text-gray-400">Anda tidak memiliki izin untuk mengakses area ini.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#070B14] via-[#070B14] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h1>
          <p className="text-gray-400">Anda tidak memiliki izin admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B14] via-[#070B14] to-black">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-black/50 backdrop-blur-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        "border-r border-white/10",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TPC Admin</h1>
              <p className="text-xs text-gray-400">Super Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-white/10 text-gray-300",
                isActive && "bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-500"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs font-semibold bg-yellow-500 text-black rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Users className="h-5 w-5 text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Super Admin</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden bg-black/50 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TPC Admin</h1>
                <p className="text-xs text-gray-400">Super Admin Panel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Header - Dark Theme */}
        <div className="bg-[#1E2329] border-b border-[#2B3139]">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left Section - Empty or Breadcrumb */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#848E9C]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-[#0B0E11] border border-[#2B3139] rounded-lg text-white placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg bg-[#0B0E11] border border-[#2B3139] text-[#848E9C] hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F0B90B] rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">Super Admin</p>
                  <p className="text-xs text-[#848E9C]">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
