import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const handleAuth = async () => {
      try {
        console.log("[AUTH CALLBACK RAW]", window.location.href);
        
        console.log("[AUTH CALLBACK] Starting session check...");
        const { data, error } = await supabase.auth.getSession();
        
        console.log("[AUTH SESSION]", data);
        console.log("[AUTH CALLBACK] Session result:", { 
          hasSession: !!data.session, 
          hasError: !!error,
          error: error?.message,
          sessionUser: data.session?.user?.email
        });

        if (error || !data.session) {
          console.error("[AUTH CALLBACK] No session found, redirecting to login");
          navigate("/id/login", { replace: true });
          return;
        }

        console.log("[AUTH CALLBACK] Session found, redirecting to dashboard");
        navigate("/id/dashboard", { replace: true });
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
