import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { normalizePublicPathname, isAllowedPublicRawPath } from '@/config/publicRoutes';

interface PublicCanonicalGuardProps {
  children: React.ReactNode;
}

/**
 * Public Canonical Guard - Ensures all public routes follow strict rules
 * 
 * 1. Normalizes malformed paths (/enmarket -> /en/market)
 * 2. Removes duplicate language prefixes (/en/en/market -> /en/market)
 * 3. Redirects to 404 if path not in allowlist
 * 4. Does NOT import or reference any member/admin code
 */
export function PublicCanonicalGuard({ children }: PublicCanonicalGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    
    // Normalize the current pathname
    const { lang, rawPath, canonical } = normalizePublicPathname(pathname);
    
    // If current pathname is not canonical, redirect
    if (pathname !== canonical) {
      navigate(canonical, { replace: true });
      return;
    }
    
    // If raw path is not in allowlist, redirect to 404
    if (!isAllowedPublicRawPath(rawPath)) {
      navigate(`/${lang}/404`, { replace: true });
      return;
    }
    
    // Path is valid and canonical - allow access
  }, [location.pathname, navigate]);

  return <>{children}</>;
}
