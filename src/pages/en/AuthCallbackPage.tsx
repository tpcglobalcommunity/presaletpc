import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function EnAuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.warn("[AUTH] No session, back to login");
          navigate("/en/login", { replace: true });
          return;
        }

        const returnTo =
          sessionStorage.getItem("returnTo") || "/en/member";

        sessionStorage.removeItem("returnTo");

        console.log("[AUTH] Login success, redirect to:", returnTo);

        navigate(returnTo, { replace: true });
      } catch (err) {
        console.error("[AUTH] Fatal error:", err);
        navigate("/en/login", { replace: true });
      }
    };

    if (isMounted) handleAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-pulse text-sm opacity-70">
        Completing login...
      </div>
    </div>
  );
}
