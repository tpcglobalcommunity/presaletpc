import { Loader2 } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#0F141A] to-[#11161C] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F0B90B] mx-auto mb-4" />
        <p className="text-[#848E9C] text-sm">Memuat...</p>
      </div>
    </div>
  );
}
