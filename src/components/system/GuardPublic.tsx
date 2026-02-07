import { Outlet, useLocation, Navigate } from 'react-router-dom';
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
    const to = normalizedPath + location.search + location.hash;
    return <Navigate to={to} replace />;
  }
  
  // Always render children (PublicLayout) after normalization
  return <Outlet />;
}
