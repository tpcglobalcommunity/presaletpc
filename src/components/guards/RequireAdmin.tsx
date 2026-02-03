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

  if (isLoading) return null;

  if (!user) {
    return (
      <RequireAuth>
        <>{children}</>
      </RequireAuth>
    );
  }

  if (!isAdminUserId(user.id)) {
    return (
      <Navigate
        to={`/${safe}/member/dashboard`}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
