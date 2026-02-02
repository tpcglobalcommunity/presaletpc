import { Users, Clock, CheckCircle, Share2, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberID, formatRupiah } from '@/lib/number';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface DashboardStats {
  total_users: number;
  total_invoices: number;
  unpaid_invoices: number;
  paid_invoices: number;
  total_referrals: number;
  new_users_this_month: number;
  new_invoices_this_month: number;
  total_revenue: number;
  active_users: number;
}

export function AdminDashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data, error } = await supabase.rpc('get_dashboard_stats_admin');
      if (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
          total_users: 0,
          total_invoices: 0,
          unpaid_invoices: 0,
          paid_invoices: 0,
          total_referrals: 0,
          new_users_this_month: 0,
          new_invoices_this_month: 0,
          total_revenue: 0,
          active_users: 0
        };
      }
      return data?.[0] as DashboardStats || {
        total_users: 0,
        total_invoices: 0,
        unpaid_invoices: 0,
        paid_invoices: 0,
        total_referrals: 0,
        new_users_this_month: 0,
        new_invoices_this_month: 0,
        total_revenue: 0,
        active_users: 0
      };
    },
  });

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { value: '+0%', type: 'neutral' as const };
    const change = ((current - previous) / previous) * 100;
    return {
      value: change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`,
      type: change > 0 ? 'increase' as const : change < 0 ? 'decrease' as const : 'neutral' as const
    };
  };

  const totalRevenue = stats?.total_revenue || 0;

  const statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: formatNumberID(stats?.total_users || 0),
      change: calculateChange(stats?.total_users || 0, 1070).value,
      changeType: calculateChange(stats?.total_users || 0, 1070).type,
      icon: <Users className="h-5 w-5" />,
      color: 'text-[#F0B90B]',
      bgColor: 'bg-[#F0B90B]/10',
      borderColor: 'border-[#F0B90B]/20'
    },
    {
      title: 'Pending Review',
      value: formatNumberID(stats?.unpaid_invoices || 0),
      change: 'Butuh verifikasi',
      changeType: 'neutral',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20'
    },
    {
      title: 'Total Revenue',
      value: formatRupiah(totalRevenue),
      change: 'Total pendapatan',
      changeType: 'increase',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20'
    },
    {
      title: 'Total Referrals',
      value: formatNumberID(stats?.total_referrals || 0),
      change: 'Aktif 10 level',
      changeType: 'neutral',
      icon: <Share2 className="h-5 w-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-20 bg-[#2B3139] rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-[#2B3139] rounded-lg animate-pulse"></div>
            </div>
            <div className="h-8 w-24 bg-[#2B3139] rounded animate-pulse mb-2"></div>
            <div className="h-3 w-16 bg-[#2B3139] rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <div 
          key={index}
          className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-5 hover:border-[#3A3F47] transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#848E9C] text-sm font-medium">{card.title}</span>
            <div className={`p-2.5 rounded-lg ${card.bgColor} ${card.color}`}>
              {card.icon}
            </div>
          </div>
          
          <div className="text-2xl font-bold text-white mb-2">
            {card.value}
          </div>
          
          <div className="flex items-center gap-2">
            {card.changeType === 'increase' && (
              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>{card.change}</span>
              </div>
            )}
            {card.changeType === 'decrease' && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <TrendingDown className="h-3 w-3" />
                <span>{card.change}</span>
              </div>
            )}
            {card.changeType === 'neutral' && (
              <span className="text-[#848E9C] text-xs">{card.change}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
