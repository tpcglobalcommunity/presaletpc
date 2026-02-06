import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// PUBLIC
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import AntiScamPage from "@/pages/public/AntiScamPage";
import { PublicNotFoundPage } from "@/pages/public/PublicNotFoundPage";

// MEMBER
import MemberWithdrawalPage from "@/pages/member/MemberWithdrawalPage";

// GUARD
import { RequireAuth } from "@/components/guards/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/id" replace />} />

        {/* PUBLIC (LANG BASED) */}
        <Route path="/:lang" element={<HomePage />} />
        <Route path="/:lang/login" element={<LoginPage />} />
        <Route path="/:lang/anti-scam" element={<AntiScamPage />} />

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
    </AuthProvider>
  );
}
