import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes, 
  Route, 
  Navigate,
  useParams
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// WWW to non-www redirect guard
if (typeof window !== "undefined" && window.location.hostname === "www.tpcglobal.io") {
  const target = `https://tpcglobal.io${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(target);
}

// Layouts
import { MobileLayout } from "@/layouts/MobileLayout";

// Auth Callback
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";

// Public Pages (STABLE VERSIONS ONLY)
import HomePage from "@/pages/id/HomePage";
import LoginPage from "@/pages/id/LoginPage";
import NotFound from "@/pages/NotFound";

// LangRoute helper
function LangRoute({
  id,
  en,
}: {
  id: React.ReactNode;
  en: React.ReactNode;
}) {
  const params = useParams();
  const lang = params.lang === "en" ? "en" : "id";
  return lang === "en" ? en : id;
}

// LangIndexPage - STABLE VERSION ONLY
function LangIndexPage() {
  const params = useParams();
  const lang = params.lang === "en" ? "en" : "id";
  // Index /id atau /en render home sesuai bahasa
  if (lang === "en") {
    return <Navigate to="/en/login" replace />; // EN redirect ke login untuk stabilization
  }
  return <HomePage />; // ID gunakan stable HomePage
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Root redirect to default language */}
              <Route path="/" element={<Navigate replace to="/id" />} />
              
              {/* Language shell - STABILIZATION ROUTER */}
              <Route path="/:lang" element={<MobileLayout />}>
                {/* Index route */}
                <Route index element={<LangIndexPage />} />
                
                {/* Auth callback */}
                <Route path="auth/callback" element={<AuthCallbackPage />} />
                
                {/* Login */}
                <Route
                  path="login"
                  element={
                    <LangRoute
                      id={<LoginPage />}
                      en={<LoginPage />}
                    />
                  }
                />
                
                {/* 404 - MUST BE LAST */}
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Global 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
