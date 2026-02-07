import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// GUARDS
import { RequireAuth } from "@/components/guards/RequireAuth";
import GuardPublic from "@/components/system/GuardPublic";

// LAYOUTS
import PublicLayout from "@/layouts/PublicLayout";

// PUBLIC PAGES (will be created in Phase 3)
import HomePage from "@/pages/public/en/HomePage";
import LoginPage from "@/pages/public/en/LoginPage";
import AntiScamPage from "@/pages/public/en/AntiScamPage";
import MarketPage from "@/pages/public/en/MarketPage";
import PresalePage from "@/pages/public/en/PresalePage";
import AcademyPage from "@/pages/public/en/AcademyPage";
import TermsPage from "@/pages/public/en/TermsPage";
import PrivacyPage from "@/pages/public/en/PrivacyPage";
import RiskDisclosurePage from "@/pages/public/en/RiskDisclosurePage";

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
            <Route path="en" element={<HomePage />} />
            <Route path="en/login" element={<LoginPage />} />
            <Route path="en/anti-scam" element={<AntiScamPage />} />
            <Route path="en/market" element={<MarketPage />} />
            <Route path="en/presale" element={<PresalePage />} />
            <Route path="en/academy" element={<AcademyPage />} />
            <Route path="en/terms" element={<TermsPage />} />
            <Route path="en/privacy" element={<PrivacyPage />} />
            <Route path="en/risk" element={<RiskDisclosurePage />} />
            
            {/* ID routes (will be created in Phase 3) */}
            <Route path="id" element={<HomePage />} />
            <Route path="id/login" element={<LoginPage />} />
            <Route path="id/anti-scam" element={<AntiScamPage />} />
            <Route path="id/market" element={<MarketPage />} />
            <Route path="id/presale" element={<PresalePage />} />
            <Route path="id/academy" element={<AcademyPage />} />
            <Route path="id/terms" element={<TermsPage />} />
            <Route path="id/privacy" element={<PrivacyPage />} />
            <Route path="id/risk" element={<RiskDisclosurePage />} />
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
