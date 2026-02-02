import { useState } from 'react';
import { ChevronDown, ChevronRight, User, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReferralNode {
  email?: string;
  member_code?: string;
  level: number;
  hasChildren?: boolean;
  isActive?: boolean;
  children?: ReferralNode[];
}

interface ReferralNodeRowProps {
  node: ReferralNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  level?: number;
}

export function ReferralNodeRow({ 
  node, 
  isExpanded = false, 
  onToggle, 
  level = 0 
}: ReferralNodeRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  const maskedEmail = node.email ? 
    node.email.substring(0, 3) + '***' + node.email.substring(node.email.indexOf('@')) : 
    '-';

  const indent = level * 24;

  return (
    <div className="group">
      <div 
        className={cn(
          'flex items-center gap-3 p-4 rounded-xl border border-[#1F2A33] bg-[#11161C]/50',
          'transition-all duration-200 hover:border-[#F0B90B]/40 hover:bg-[#F0B90B]/[0.03]',
          'cursor-pointer'
        )}
        style={{ marginLeft: `${indent}px` }}
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse Icon */}
        {node.hasChildren && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 hover:bg-[#F0B90B]/10"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-[#848E9C]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[#848E9C]" />
            )}
          </Button>
        )}

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0B90B]/20 to-[#F8D56B]/10 border border-[#F0B90B]/30 flex items-center justify-center">
          {node.isActive ? (
            <CheckCircle className="h-5 w-5 text-[#F0B90B]" />
          ) : (
            <User className="h-5 w-5 text-[#848E9C]" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium text-sm">
              {maskedEmail}
            </span>
            <Badge variant="secondary" className="text-xs bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
              L{node.level}
            </Badge>
            {node.isActive && (
              <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-400/30">
                Aktif
              </Badge>
            )}
          </div>
          {node.member_code && (
            <div className="text-xs text-[#848E9C] font-mono">
              {node.member_code}
            </div>
          )}
        </div>

        {/* Status */}
        {node.isActive && (
          <div className="text-xs text-emerald-400 font-medium">
            Beli TPC
          </div>
        )}
      </div>

      {/* Connector Line */}
      {level > 0 && (
        <div 
          className="absolute left-4 border-l-2 border-[#1F2A33] opacity-50"
          style={{ 
            marginLeft: `${indent - 12}px`,
            height: '40px',
            marginTop: '-40px'
          }}
        />
      )}
    </div>
  );
}
