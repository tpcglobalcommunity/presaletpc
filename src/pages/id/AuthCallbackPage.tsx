import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const handleAuth = async () => {
      try {
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

        // Apply pending sponsor after login
        const LS_KEY = 'tpc_pending_sponsor_code';
        const code = (localStorage.getItem(LS_KEY) || '').trim().toUpperCase();
        
        if (code) {
          try {
            const { data: sponsorData, error: sponsorError } = await supabase.rpc('apply_pending_sponsor', { 
              p_referral_code: code 
            });
            
            if (sponsorError) {
              console.warn('[AUTH CALLBACK] Failed to apply sponsor:', sponsorError.message);
            } else {
              console.log('[AUTH CALLBACK] Sponsor applied:', sponsorData);
            }
          } catch (sponsorErr) {
            console.warn('[AUTH CALLBACK] Sponsor apply error:', sponsorErr);
            // Don't block login if sponsor apply fails
          }
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
