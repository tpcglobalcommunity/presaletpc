import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferralStatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  variant: 'gold' | 'emerald' | 'amber' | 'red' | 'blue' | 'gray';
  isLoading?: boolean;
}

const variantStyles = {
  gold: 'bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border-[#F0B90B]/30',
  emerald: 'bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border-emerald-400/30',
  amber: 'bg-gradient-to-br from-amber-500/20 to-amber-400/10 border-amber-400/30',
  red: 'bg-gradient-to-br from-red-500/20 to-red-400/10 border-red-400/30',
  blue: 'bg-gradient-to-br from-blue-500/20 to-blue-400/10 border-blue-400/30',
  gray: 'bg-[#1E2329] border-[#2B3139]'
};

const iconVariantStyles = {
  gold: 'bg-[#F0B90B]/20 text-[#F0B90B]',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/20 text-amber-400',
  red: 'bg-red-500/20 text-red-400',
  blue: 'bg-blue-500/20 text-blue-400',
  gray: 'bg-[#848E9C]/20 text-[#848E9C]'
};

export function ReferralStatCard({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  variant, 
  isLoading = false 
}: ReferralStatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn(
        'border-[#1F2A33] bg-[#11161C] rounded-2xl',
        'animate-pulse'
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-[#2B3139] rounded"></div>
              <div className="h-8 w-16 bg-[#2B3139] rounded"></div>
            </div>
            <div className="h-12 w-12 bg-[#2B3139] rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'border rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
      variantStyles[variant]
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-[#848E9C] font-medium uppercase tracking-wider">
              {title}
            </div>
            <div className="text-2xl font-bold text-white">
              {value}
            </div>
            {subValue && (
              <div className="text-xs text-[#848E9C]">
                {subValue}
              </div>
            )}
          </div>
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            iconVariantStyles[variant]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
