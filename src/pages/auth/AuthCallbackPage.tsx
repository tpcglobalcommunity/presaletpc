import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { lang = "id" } = useParams<{ lang: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleAuth = async () => {
      try {
        console.log("[AUTH CALLBACK RAW]", window.location.href);
        
        // Parse URL parameters for errors
        const urlParams = new URLSearchParams(window.location.search);
        const errorCode = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (errorCode) {
          console.error("[AUTH CALLBACK] OAuth error:", errorCode, errorDescription);
          setError(errorDescription || errorCode);
          setLoading(false);
          return;
        }

        console.log("[AUTH CALLBACK] Starting session check...");
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        console.log("[AUTH SESSION]", data);
        
        if (sessionError) {
          console.error("[AUTH CALLBACK] Session error:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (!data.session) {
          console.error("[AUTH CALLBACK] No session found");
          setError("Session tidak ditemukan. Silakan coba login kembali.");
          setLoading(false);
          return;
        }

        console.log("[AUTH CALLBACK] Session found, redirecting to dashboard");
        navigate(`/${lang}/dashboard`, { replace: true });
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
  }, [navigate, lang]);

  const handleBackToLogin = () => {
    navigate(`/${lang}/login`, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memproses autentikasi...</p>
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
