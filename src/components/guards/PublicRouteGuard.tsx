import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicRouteGuardProps {
  children: React.ReactNode;
}

export function PublicRouteGuard({ children }: PublicRouteGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { lang } = useParams();

  const safe = lang === "en" ? "en" : "id";

  // DEBUG: Log flow
  console.log('[PUBLIC_GUARD] Path:', location.pathname, 'Lang:', lang, 'Safe:', safe, 'User:', !!user, 'Loading:', isLoading);

  if (isLoading) {
    console.log('[PUBLIC_GUARD] Loading...');
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
      </div>
    );
  }

  // PUBLIC ALLOWLIST - These paths don't require authentication
  const path = location.pathname;
  const publicPaths = [
    `/${safe}/buytpc`,
    `/${safe}/login`,
    `/${safe}/auth/callback`,
    `/${safe}/auth/callback-page`,
    `/${safe}`,
    `/${safe}/`,
    `/${safe}/anti-scam`,
    `/${safe}/edukasi`,
    `/${safe}/faq`,
    `/${safe}/whitepaper`,
    `/${safe}/dao`,
    `/${safe}/transparansi`,
    `/${safe}/market`,
    `/${safe}/invoice/success`,
    `/${safe}/tutorial/phantom-wallet`,
  ];

  const isPublic =
    publicPaths.includes(path) ||
    path.startsWith(`/${safe}/buytpc/`) ||
    path.startsWith(`/${safe}/tutorial/`);

  console.log('[PUBLIC_GUARD] IsPublic:', isPublic, 'Path:', path, 'Expected:', `/${safe}/buytpc`);

  // Allow public paths without authentication
  if (isPublic) {
    console.log('[PUBLIC_GUARD] Allowing public path');
    return <>{children}</>;
  }

  // Redirect to login for protected paths
  if (!user) {
    console.log('[PUBLIC_GUARD] Redirecting to login for protected path:', path);
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/${safe}/login?returnTo=${returnTo}`} replace />;
  }

  console.log('[PUBLIC_GUARD] Allowing authenticated user');
  return <>{children}</>;
}
