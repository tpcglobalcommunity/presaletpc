import { Loader2 } from 'lucide-react';

export default function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#F0B90B] mx-auto mb-4" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-[#F0B90B]/20 border-t-[#F0B90B] mx-auto mb-4" />
        </div>
        <p className="text-[#848E9C] text-sm font-medium">Memuat halaman...</p>
      </div>
    </div>
  );
}
