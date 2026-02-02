import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingRowProps {
  title: string;
  description?: string;
  right?: ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  hover?: boolean;
}

export function SettingRow({ 
  title, 
  description, 
  right, 
  icon: Icon, 
  onClick,
  hover = true 
}: SettingRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-xl border border-[#1F2A33] bg-[#11161C]/50',
        'transition-all duration-200',
        hover && 'hover:border-[#F0B90B]/40 hover:bg-[#F0B90B]/[0.03] cursor-pointer',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-[#F0B90B]/20 flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5 text-[#F0B90B]" />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-white font-medium">{title}</div>
          {description && (
            <div className="text-sm text-[#848E9C] mt-0.5">{description}</div>
          )}
        </div>
      </div>
      
      {right && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {right}
        </div>
      )}
    </div>
  );
}
