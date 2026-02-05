import { Clock, AlertTriangle } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface CountdownCardProps {
  label: string;
  targetIso: string;
  className?: string;
}

export default function CountdownCard({ label, targetIso, className }: CountdownCardProps) {
  const parsed = useMemo(() => {
    const d = new Date(targetIso);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [targetIso]);

  if (!parsed) {
    return (
      <div className="rounded-xl border border-yellow-500/20 bg-black/30 p-4 text-center text-sm text-muted-foreground">
        Countdown belum dikonfigurasi
      </div>
    );
  }

  const { days, hours, minutes, seconds, isExpired } = useCountdown(parsed);

  return (
    <div className={cn(
      "bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl p-6 overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#F0B90B]" />
          <h3 className="text-white text-lg font-semibold">{label}</h3>
        </div>
        {isExpired && (
          <div className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-medium border border-red-500/30">
            Berakhir
          </div>
        )}
      </div>

      {/* Countdown Display */}
      {!isExpired && (
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-3">
              <div className="text-2xl font-bold text-white">
                {String(days).padStart(2, '0')}
              </div>
              <div className="text-xs text-[#848E9C] mt-1">Hari</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-3">
              <div className="text-2xl font-bold text-white">
                {String(hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-[#848E9C] mt-1">Jam</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-3">
              <div className="text-2xl font-bold text-white">
                {String(minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-[#848E9C] mt-1">Menit</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-3">
              <div className="text-2xl font-bold text-white">
                {String(seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-[#848E9C] mt-1">Detik</div>
            </div>
          </div>
        </div>
      )}

      {/* Expired State */}
      {isExpired && (
        <div className="text-center py-4">
          <p className="text-[#F0B90B] font-medium mb-2">Presale Telah Berakhir</p>
          <p className="text-xs text-[#848E9C]">
            Pantau pengumuman untuk stage berikutnya
          </p>
        </div>
      )}

      {/* Subtle Helper Text */}
      <div className="mt-4 pt-4 border-t border-[#1F2A33]">
        <p className="text-xs text-[#848E9C] text-center">
          Waktu dihitung otomatis berdasarkan zona waktu Jakarta (WIB / UTC+7)
        </p>
      </div>
    </div>
  );
}
