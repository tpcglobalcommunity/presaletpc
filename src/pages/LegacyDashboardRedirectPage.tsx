import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LegacyDashboardRedirectPage() {
  const { lang } = useParams();
  const { user, isLoading } = useAuth();
  
  const safeLang = lang === 'en' ? 'en' : 'id';

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#F0B90B] mx-auto mb-4" />
          <p className="text-white/70 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to member dashboard
  if (user) {
    return <Navigate to={`/${safeLang}/member/dashboard`} replace />;
  }

  // If user is not logged in, redirect to login
  return <Navigate to={`/${safeLang}/login`} replace />;
}
