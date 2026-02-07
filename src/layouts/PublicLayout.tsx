import { Outlet, useParams } from 'react-router-dom';
import LanguageSwitch from '@/components/public/LanguageSwitch';
import PublicBottomNav from '@/components/public/PublicBottomNav';

export default function PublicLayout() {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white flex flex-col">
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
        <div className="max-w-md mx-auto w-full px-4 py-6">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <PublicBottomNav />
    </div>
  );
}
