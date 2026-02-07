import { Outlet, useParams } from 'react-router-dom';
import LanguageSwitch from '@/components/public/LanguageSwitch';
import PublicBottomNav from '@/components/public/PublicBottomNav';

export default function PublicLayout() {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* Mobile Layout Container - Centered on desktop */}
      <div className="mx-auto w-full max-w-[520px] min-h-screen relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <img 
              src="/tpc-logo.png" 
              alt="TPC Global" 
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="text-lg font-semibold text-white">TPC Global</span>
          </div>
          <LanguageSwitch currentLang={lang as 'en' | 'id'} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 pb-20 overflow-y-auto">
          <div className="px-4 py-6">
            <Outlet />
          </div>
        </main>
        
        {/* Bottom Navigation - Constrained to container width */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0B0E11]/95 backdrop-blur-sm border-t border-gray-800 z-40">
          <div className="mx-auto w-full max-w-[520px]">
            <PublicBottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}
