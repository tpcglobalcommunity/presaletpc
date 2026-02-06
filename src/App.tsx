import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// PUBLIC PAGES (DIRECT IMPORT)
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import AntiScamPage from "@/pages/public/AntiScamPage";
import { PublicNotFoundPage } from "@/pages/public/PublicNotFoundPage";

// MEMBER PAGES
import MemberWithdrawalPage from "@/pages/member/MemberWithdrawalPage";

// GUARD
import { RequireAuth } from "@/components/guards/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/anti-scam" element={<AntiScamPage />} />

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
