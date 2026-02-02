import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import { MobileLayout } from "@/layouts/MobileLayout";
import { MemberLayout } from "@/layouts/MemberLayout";
import { AdminLayoutPremium } from "@/components/AdminLayoutPremium";

// Public Pages
import HomePage from "@/pages/id/HomePage";
import MarketPage from "@/pages/id/MarketPage";
import BuyTPCPage from "@/pages/id/BuyTPCPage";
import InvoiceSuccessPage from "@/pages/id/InvoiceSuccessPage";
import LoginPage from "@/pages/id/LoginPage";
import TransparansiPage from "@/pages/id/TransparansiPage";
import AntiScamPage from "@/pages/id/AntiScamPage";
import EdukasiPage from "@/pages/id/EdukasiPage";
import WhitepaperPage from "@/pages/id/WhitepaperPage";
import DAOPage from "@/pages/id/DAOPage";
import FAQPage from "@/pages/id/FAQPage";
import VerifiedCoordinatorsPage from "@/pages/chapters/VerifiedCoordinatorsPage";
import ChaptersSopPage from "@/pages/chapters/ChaptersSopPage";
import TermsConditionsPage from "@/pages/legal/TermsConditionsPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";

// Member Pages
import DashboardPage from "@/pages/id/dashboard/DashboardPage";
import InvoiceDetailPage from "@/pages/id/dashboard/InvoiceDetailPage";
import HistoryPage from "@/pages/id/dashboard/HistoryPage";
import ReferralPage from "@/pages/id/dashboard/ReferralPage";
import SettingsPage from "@/pages/id/dashboard/SettingsPage";

// New Member Pages
import MemberDashboardPage from "@/pages/member/MemberDashboardPage";
import MemberInvoicesPage from "@/pages/member/MemberInvoicesPage";
import MemberInvoiceDetailPage from "@/pages/member/MemberInvoiceDetailPage";
import MemberReferralPage from "@/pages/member/MemberReferralPage";
import MemberProfilePage from "@/pages/member/MemberProfilePage";

// Admin Pages
import AdminDashboardPageNew from "@/pages/admin/AdminDashboardPage";
import AdminInvoicesPageNew from "@/pages/admin/AdminInvoicesPage";
import AdminInvoiceDetailPageNew from "@/pages/admin/AdminInvoiceDetailPage";
import AdminUsersPageNew from "@/pages/admin/AdminUsersPage";
import AdminSettingsPageNew from "@/pages/admin/AdminSettingsPage";
import AdminAuditPageNew from "@/pages/admin/AdminAuditPage";
import AdminAnalyticsPageNew from "@/pages/admin/AdminAnalyticsPage";
import AdminNotificationsPageNew from "@/pages/admin/AdminNotificationsPage";

// Guards
import { RequireAdmin } from "@/components/guards/RequireAdmin";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter 
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <AuthProvider>
          <Routes>
            {/* Redirect root to /id */}
            <Route path="/" element={<Navigate to="/id" replace />} />

            {/* Indonesian Routes with Mobile Layout */}
            <Route path="/id" element={<MobileLayout />}>
              <Route index element={<HomePage />} />
              <Route path="market" element={<MarketPage />} />
              <Route path="buytpc" element={<BuyTPCPage />} />
              <Route path="buytpc/success" element={<InvoiceSuccessPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="transparansi" element={<TransparansiPage />} />
              <Route path="anti-scam" element={<AntiScamPage />} />
              <Route path="edukasi" element={<EdukasiPage />} />
              <Route path="whitepaper" element={<WhitepaperPage />} />
              <Route path="dao" element={<DAOPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="verified-coordinators" element={<VerifiedCoordinatorsPage />} />
              <Route path="chapters" element={<ChaptersSopPage />} />
              <Route path="syarat-ketentuan" element={<TermsConditionsPage />} />
              <Route path="kebijakan-privasi" element={<PrivacyPolicyPage />} />

              {/* Member Routes (Protected) */}
              <Route path="dashboard" element={<MemberLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="invoices/:invoiceNo" element={<InvoiceDetailPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="referral" element={<ReferralPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* New Member Area Routes */}
              <Route path="member" element={<MemberLayout />}>
                <Route index element={<Navigate to="/id/member/dashboard" replace />} />
                <Route path="dashboard" element={<MemberDashboardPage />} />
                <Route path="invoices" element={<MemberInvoicesPage />} />
                <Route path="invoices/:id" element={<MemberInvoiceDetailPage />} />
                <Route path="referrals" element={<MemberReferralPage />} />
                <Route path="profile" element={<MemberProfilePage />} />
              </Route>

              {/* Admin Routes (Premium with UUID Guard) */}
              <Route path="admin" element={<RequireAdmin><AdminLayoutPremium /></RequireAdmin>}>
                <Route index element={<AdminDashboardPageNew />} />
                <Route path="invoices" element={<AdminInvoicesPageNew />} />
                <Route path="invoices/:invoiceId" element={<AdminInvoiceDetailPageNew />} />
                <Route path="users" element={<AdminUsersPageNew />} />
                <Route path="analytics" element={<AdminAnalyticsPageNew />} />
                <Route path="notifications" element={<AdminNotificationsPageNew />} />
                <Route path="settings" element={<AdminSettingsPageNew />} />
                <Route path="audit" element={<AdminAuditPageNew />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
