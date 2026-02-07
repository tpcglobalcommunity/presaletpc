import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// GUARDS
import { RequireAuth } from "@/components/guards/RequireAuth";
import GuardPublic from "@/components/system/GuardPublic";

// LAYOUTS
import PublicLayout from "@/layouts/PublicLayout";

// PUBLIC ROUTES
import PublicRoute from "@/pages/public/PublicRoute";

// MEMBER (keep existing)
import MemberWithdrawalPage from "@/pages/member/MemberWithdrawalPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/en" replace />} />
        
        {/* PUBLIC ROUTES WITH GUARD */}
        <Route path="/:lang(en|id)/*" element={<GuardPublic />}>
          <Route element={<PublicLayout />}>
            {/* EN routes */}
            <Route index element={<PublicRoute page="home" />} />
            <Route path="login" element={<PublicRoute page="login" />} />
            <Route path="anti-scam" element={<PublicRoute page="anti-scam" />} />
            <Route path="market" element={<PublicRoute page="market" />} />
            <Route path="presale" element={<PublicRoute page="presale" />} />
            <Route path="academy" element={<PublicRoute page="academy" />} />
            <Route path="terms" element={<PublicRoute page="terms" />} />
            <Route path="privacy" element={<PublicRoute page="privacy" />} />
            <Route path="risk" element={<PublicRoute page="risk" />} />
          </Route>
        </Route>

        {/* MEMBER ROUTES (keep existing) */}
        <Route
          path="/member/withdrawal"
          element={
            <RequireAuth>
              <MemberWithdrawalPage />
            </RequireAuth>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </AuthProvider>
  );
}
