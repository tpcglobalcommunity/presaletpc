import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
