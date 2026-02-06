import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import LanguageSwitch from '@/components/system/LanguageSwitch';

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
      
      {/* Language Switch - Public Only */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitch />
      </div>
    </div>
  );
}
