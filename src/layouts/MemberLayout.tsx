import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { MemberBottomNav } from '@/components/MemberBottomNav';

export function MemberLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/id/login" replace />;
  }

  return (
    <div className="min-h-screen pb-20">
      <Outlet />
      <MemberBottomNav />
    </div>
  );
}
