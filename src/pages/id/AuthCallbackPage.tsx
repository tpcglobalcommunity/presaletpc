import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const safeReturnTo = (raw: string | null) => {
      if (!raw) return null;
      const v = raw.trim();
      if (!v.startsWith("/")) return null;
      if (v.includes("://")) return null;
      if (!(v.startsWith("/id/") || v.startsWith("/en/"))) return null;
      return v;
    };

    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          navigate("/id/login", { replace: true });
          return;
        }

        // Apply pending sponsor after login
        const LS_KEY = "tpc_pending_sponsor_code";
        const code = (localStorage.getItem(LS_KEY) || "").trim().toUpperCase();

        if (code) {
          try {
            const { error: sponsorError } = await supabase.rpc("apply_pending_sponsor", {
              p_referral_code: code,
            });

            if (sponsorError) {
              console.warn("[AUTH CALLBACK] Failed to apply sponsor:", sponsorError.message);
            }
          } catch (sponsorErr) {
            console.warn("[AUTH CALLBACK] Sponsor apply error:", sponsorErr);
          } finally {
            localStorage.removeItem(LS_KEY);
          }
        }

        // ✅ Honor tpc_return_to for invoice success flow
        const returnToRaw = localStorage.getItem("tpc_return_to");
        const returnTo = safeReturnTo(returnToRaw);

        if (returnTo) {
          localStorage.removeItem("tpc_return_to");
          navigate(returnTo, { replace: true });
        } else {
          // ✅ member namespace hard lock
          navigate("/id/member", { replace: true });
        }
      } catch (err) {
        console.error("[AUTH CALLBACK] Fatal error:", err);
        navigate("/id/login", { replace: true });
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
        Processing authentication...
      </div>
    </div>
  );
}
