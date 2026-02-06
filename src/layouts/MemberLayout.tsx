import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { MemberBottomNav } from '@/components/MemberBottomNav';

export function MemberLayout() {
  const { user, isLoading, sessionInitialized, profile, profileComplete } = useAuth();
  const { lang } = useParams();
  const safeLang = lang === 'en' ? 'en' : 'id';

  // Hanya render loader saat initial auth bootstrap
  if (isLoading && !sessionInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/${safeLang}/login`} replace />;
  }

  // Profile completeness gate - redirect to onboarding if profile is incomplete
  if (profile && !profileComplete) {
    const currentPath = window.location.pathname;
    const isOnboardingRoute = currentPath.includes('/onboarding');
    const isAuthCallback = currentPath.includes('/auth/callback');
    
    if (!isOnboardingRoute && !isAuthCallback) {
      return <Navigate to={`/${safeLang}/onboarding`} replace />;
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <Outlet />
      <MemberBottomNav />
    </div>
  );
}
