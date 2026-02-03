import { Navigate, useLocation, useParams } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUserId } from "@/config/admin";

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { user, isLoading } = useAuth();
  const { lang } = useParams();
  const location = useLocation();

  const safe = lang === "en" ? "en" : "id";

  // Tunggu auth selesai init
  if (isLoading) return null;

  // Belum login → wajib lewat RequireAuth
  if (!user) {
    return (
      <RequireAuth>
        <>{children}</>
      </RequireAuth>
    );
  }

  // Sudah login tapi bukan admin
  if (!isAdminUserId(user.id)) {
    return (
      <Navigate
        to={`/${safe}/member/dashboard`}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Admin valid
  return <>{children}</>;
}
