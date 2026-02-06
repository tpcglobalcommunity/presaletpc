import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { LanguageSwitch } from '@/components/system/LanguageSwitch';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Language Switch */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0E11]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/55">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F8D56B] flex items-center justify-center shadow-lg shadow-[#F0B90B]/10 border border-[#F0B90B]/25">
                <span className="text-black font-bold text-lg">TPC</span>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-white">Professional Trading Community</h1>
                <p className="text-[#848E9C] text-sm">Join TPC Global, learn from experts, access exclusive resources</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSwitch className="ml-auto" />
            </div>
          </div>
        </header>
        
      <main className="pb-24">
        <Outlet />
      </main>
        
      <BottomNav />
    </div>
  );
}
