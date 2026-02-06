import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// PUBLIC
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import AntiScamPage from "@/pages/public/AntiScamPage";
import { PublicNotFoundPage } from "@/pages/public/PublicNotFoundPage";

// MEMBER
import MemberWithdrawalPage from "@/pages/member/MemberWithdrawalPage";

// GUARDS
import { RequireAuth } from "@/components/guards/RequireAuth";
import RequirePublicLang from "@/components/system/RequirePublicLang";
import PublicBottomNav from "@/components/navigation/PublicBottomNav";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/id" replace />} />

        {/* PUBLIC (LANG BASED) */}
        <Route path="/:lang" element={<RequirePublicLang />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="anti-scam" element={<AntiScamPage />} />
        </Route>

        {/* MEMBER */}
        <Route
          path="/member/withdrawal"
          element={
            <RequireAuth>
              <MemberWithdrawalPage />
            </RequireAuth>
          }
        />

        {/* FALLBACK */}
        <Route path="/404" element={<PublicNotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      
      {/* PUBLIC BOTTOM NAV */}
      <PublicBottomNav />
    </AuthProvider>
  );
}
