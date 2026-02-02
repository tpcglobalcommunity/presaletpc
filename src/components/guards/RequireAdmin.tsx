import { Navigate } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUserId } from '@/config/admin';

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { user } = useAuth();

  // First check authentication
  if (!user) {
    return (
      <RequireAuth>
        <RequireAdmin>{children}</RequireAdmin>
      </RequireAuth>
    );
  }

  // Then check admin access
  if (!isAdminUserId(user.id)) {
    return <Navigate to="/id/dashboard" replace />;
  }

  return <>{children}</>;
}
