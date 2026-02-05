import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ensureProfile } from "@/lib/ensureProfile";
import { loadBuyDraft, clearBuyDraft } from "@/lib/buyDraft";

// CURRENT BEHAVIOR vs TARGET BEHAVIOR:
// CURRENT: Calls ensureProfile which can fail on sponsor assignment, causing auth callback to crash
// TARGET: Calls ensureProfile which uses ensure_profile_minimal (no sponsor logic), never fails on auth

interface AuthCallbackPageProps {
  forcedLang?: "id" | "en";
}

export default function AuthCallbackPage({ forcedLang }: AuthCallbackPageProps = {}) {
  const navigate = useNavigate();
  const { lang = "id" } = useParams<{ lang: string }>();
  const { user, isAdmin } = useAuth();
  
  // Determine final lang: forcedLang takes priority, then URL param, then fallback
  const finalLang = forcedLang || lang || "id";
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleAuth = async () => {
      try {
        console.log("[AUTH CALLBACK RAW]", window.location.href);
        
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDesc = urlParams.get('error_description');
        
        // A) Handle OAuth errors
        if (error) {
          console.error("[AUTH CALLBACK] OAuth error:", error, errorCode, errorDesc);
          const errorMessage = errorDesc || error;
          setError(`${errorMessage}${errorCode ? ` (${errorCode})` : ''}`);
          setLoading(false);
          return;
        }

        // B) Handle OAuth code exchange
        if (code) {
          const exchangeKey = `tpc_oauth_exchanged_${finalLang}`;
          const alreadyExchanged = sessionStorage.getItem(exchangeKey);
          
          if (!alreadyExchanged) {
            console.log("[AUTH CALLBACK] Code present, exchanging for session...");
            setLoading(true);
            
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
            
            if (exchangeError) {
              console.error("[AUTH CALLBACK] Exchange error:", exchangeError);
              setError(`Gagal menukar kode: ${exchangeError.message}`);
              setLoading(false);
              return;
            }
            
            console.log("[AUTH CALLBACK] Exchange success, session established");
            sessionStorage.setItem(exchangeKey, '1');
            
            // Clean URL to remove code parameter
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            url.searchParams.delete('error');
            url.searchParams.delete('error_code');
            url.searchParams.delete('error_description');
            const cleanUrl = url.toString();
            window.history.replaceState({}, document.title, cleanUrl);
          } else {
            console.log("[AUTH CALLBACK] Code present but already exchanged, skipping exchange");
          }
        }

        // C) Check session (after potential exchange)
        console.log("[AUTH CALLBACK] Checking session...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[AUTH CALLBACK] Session error:", sessionError);
          setError(`Error sesi: ${sessionError.message}`);
          setLoading(false);
          return;
        }

        if (sessionData.session) {
          console.log("[AUTH CALLBACK] Session found, ensuring profile exists");
          
          // Ensure profile exists after successful session
          try {
            await ensureProfile(sessionData.session.user.id);
          } catch (profileError) {
            console.warn("[AUTH CALLBACK] Profile sync failed:", profileError);
          }
          
          // Check for buy draft and resume if exists
          const draft = loadBuyDraft();
          if (draft) {
            console.log("[AUTH CALLBACK] Found buy draft, resuming purchase");
            clearBuyDraft(); // Clear draft immediately
            
            // Redirect to buytpc with draft data
            const params = new URLSearchParams();
            if (draft.ref_code) params.set('ref', draft.ref_code);
            if (draft.amount_input) params.set('amount', draft.amount_input);
            if (draft.wallet_address) params.set('wallet', draft.wallet_address);
            if (draft.currency && draft.currency !== 'IDR') params.set('currency', draft.currency);
            
            const buyUrl = `/${finalLang}/buytpc${params.toString() ? '?' + params.toString() : ''}`;
            navigate(buyUrl, { replace: true });
            return;
          }
          
          console.log("[AUTH CALLBACK] Session found, redirecting to dashboard");
          const target = isAdmin ? `/${finalLang}/admin` : `/${finalLang}/member`;
          navigate(target, { replace: true });
          return;
        }

        // No session found
        if (code) {
          console.error("[AUTH CALLBACK] Code exchanged but no session found");
          setError("Session tidak terbentuk setelah pertukaran kode. Silakan coba login kembali.");
        } else {
          console.error("[AUTH CALLBACK] No session found");
          setError("Session tidak ditemukan. Silakan coba login kembali.");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("[AUTH CALLBACK] Fatal error:", err);
        setError("Terjadi kesalahan yang tidak terduga. Silakan coba login kembali.");
        setLoading(false);
      }
    };

    if (isMounted) handleAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, finalLang]);

  const handleBackToLogin = () => {
    navigate(`/${finalLang}/login`, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Menyelesaikan login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4 mx-auto">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            
            <h2 className="text-xl font-semibold text-center mb-2">Autentikasi Gagal</h2>
            
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {error}
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleBackToLogin}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
