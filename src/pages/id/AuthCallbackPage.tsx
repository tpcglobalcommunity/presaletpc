import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const handleAuth = async () => {
      try {
        console.log("[AUTH CALLBACK RAW URL]", window.location.href);
        
        // Cookie policy diagnostic (DEV only)
        if (import.meta.env.DEV) {
          console.log("[AUTH COOKIE] document.cookie:", document.cookie);
          console.log("[AUTH COOKIE] navigator.cookieEnabled:", navigator.cookieEnabled);
          console.log("[AUTH COOKIE] cookie count:", document.cookie.split(';').length);
        }
        
        // Check for Supabase auth token cookie
        const cookies = document.cookie.split(';').map(c => c.trim());
        const authCookie = cookies.find(c => c.startsWith('sb-') && c.includes('auth-token'));
        console.log("[AUTH CALLBACK] Auth cookie found:", !!authCookie);
        if (authCookie) {
          console.log("[AUTH CALLBACK] Auth cookie name:", authCookie.split('=')[0]);
          console.log("[AUTH CALLBACK] Auth cookie length:", authCookie.length);
        }
        
        console.log("[AUTH CALLBACK] Starting session check...");
        const { data, error } = await supabase.auth.getSession();
        
        console.log("[AUTH CALLBACK SESSION]", data);
        console.log("[AUTH CALLBACK] Session result:", { 
          hasSession: !!data.session, 
          hasError: !!error,
          error: error?.message,
          sessionUser: data.session?.user?.email
        });

        if (error || !data.session) {
          console.warn("[AUTH] No session, back to login");
          navigate("/id/login", { replace: true });
          return;
        }

        const returnTo =
          sessionStorage.getItem("returnTo") || "/id/dashboard";

        sessionStorage.removeItem("returnTo");

        console.log("[AUTH] Login success, redirect to:", returnTo);

        navigate(returnTo, { replace: true });
      } catch (err) {
        console.error("[AUTH] Fatal error:", err);
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
        Menyelesaikan login...
      </div>
    </div>
  );
}
