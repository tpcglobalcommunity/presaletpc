import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function LegacyDashboardPathRedirectPage() {
  const { lang, "*": splat } = useParams();
  const L = lang || "id";
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E11]">
        <div className="text-white/70 text-sm">Memuat...</div>
      </div>
    );
  }

  if (!user) return <Navigate to={`/${L}/login`} replace />;

  const key = (splat || "").split("/")[0].toLowerCase();

  const to =
    !key ? `/${L}/member/dashboard` :
    (key === "history" ? `/${L}/member/invoices` :
     key === "invoices" ? `/${L}/member/invoices` :
     key === "invoice" ? `/${L}/member/invoices` :
     key === "referral" || key === "referrals" ? `/${L}/member/referrals` :
     key === "settings" ? `/${L}/member/settings` :
     `/${L}/member/dashboard`);

  return <Navigate to={to} replace />;
}
