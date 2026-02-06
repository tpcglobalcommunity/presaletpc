import { Outlet, useParams } from 'react-router-dom';
import PublicLangSwitch from '@/components/system/PublicLangSwitch';
import PublicBottomNav from '@/components/navigation/PublicBottomNav';

export default function PublicLayout() {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="min-h-screen bg-background">
      {/* Language Switch - Top Right */}
      <PublicLangSwitch currentLang={lang as 'id' | 'en'} />
      
      {/* Page Content with Top and Bottom Padding */}
      <div className="pt-16 pb-[76px]">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <PublicBottomNav />
    </div>
  );
}
