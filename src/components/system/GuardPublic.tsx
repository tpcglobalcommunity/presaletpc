import { Navigate, useLocation } from 'react-router-dom';
import { normalizePublicPath } from '@/lib/publicPath';

interface GuardPublicProps {
  children?: React.ReactNode;
}

export default function GuardPublic({ children }: GuardPublicProps) {
  const location = useLocation();
  
  // Normalize the current path
  const normalizedPath = normalizePublicPath(location.pathname);
  
  // If path needs normalization, redirect
  if (normalizedPath !== location.pathname) {
    return <Navigate to={normalizedPath} replace />;
  }
  
  // Otherwise render children
  return <>{children}</>;
}
