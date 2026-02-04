import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RootDashboardRedirectPage() {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  
  // Parse pathname to extract language and subpath
  // Expected format: /{lang}/dashboard/{subpath}
  const pathname = location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  
  // Default language
  let lang = 'id';
  let subpath = '';
  
  if (pathParts.length >= 2) {
    // Check if first part is a language
    if (pathParts[0] === 'id' || pathParts[0] === 'en') {
      lang = pathParts[0];
      
      // Find dashboard and get subpath after it
      const dashboardIndex = pathParts.indexOf('dashboard');
      if (dashboardIndex !== -1 && dashboardIndex + 1 < pathParts.length) {
        subpath = pathParts[dashboardIndex + 1];
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E11]">
        <div className="text-white/70 text-sm">Memuat...</div>
      </div>
    );
  }

  if (!user) return <Navigate to={`/${lang}/login`} replace />;

  // Map legacy subpaths to new canonical routes
  const key = subpath.toLowerCase();
  const to =
    !key ? `/${lang}/member/dashboard` :
    (key === "history" ? `/${lang}/member/invoices` :
     key === "invoices" ? `/${lang}/member/invoices` :
     key === "invoice" ? `/${lang}/member/invoices` :
     key === "referral" || key === "referrals" ? `/${lang}/member/referrals` :
     key === "settings" ? `/${lang}/member/settings` :
     `/${lang}/member/dashboard`);

  return <Navigate to={to} replace />;
}
