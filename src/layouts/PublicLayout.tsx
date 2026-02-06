import { Outlet, useParams } from 'react-router-dom';
import PublicBottomNav from '@/components/navigation/PublicBottomNav';

export default function PublicLayout() {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="min-h-screen bg-background">
      {/* Page Content with Bottom Padding */}
      <div className="pb-[76px]">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <PublicBottomNav />
    </div>
  );
}
