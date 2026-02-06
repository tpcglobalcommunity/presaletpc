import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isProtectedPath } from "@/config/publicRoutes";

interface PublicRouteGuardProps {
  children: React.ReactNode;
}

export function PublicRouteGuard({ children }: PublicRouteGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { lang } = useParams();

  const safe = lang === "en" ? "en" : "id";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
      </div>
    );
  }

  // Allow public paths without authentication - EXPLICIT PROTECTION ONLY
  if (!isProtectedPath(location.pathname)) {
    return <>{children}</>;
  }

  // Redirect to login for protected paths
  if (!user && isProtectedPath(location.pathname)) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/${safe}/login?returnTo=${returnTo}`} replace />;
  }

  return <>{children}</>;
}
