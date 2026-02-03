import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import PageLoader from "@/components/PageLoader";

// Layouts
import { MobileLayout } from "@/layouts/MobileLayout";
import { MemberLayout } from "@/layouts/MemberLayout";
import { AdminLayoutPremium } from "@/components/AdminLayoutPremium";

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import("@/pages/id/HomePage"));
const MarketPage = lazy(() => import("@/pages/id/MarketPage"));
const BuyTPCPage = lazy(() => import("@/pages/id/BuyTPCPage"));
const InvoiceSuccessPage = lazy(() => import("@/pages/id/InvoiceSuccessPage"));
const LoginPage = lazy(() => import("@/pages/id/LoginPage"));
const AuthCallbackPage = lazy(() => import("@/pages/id/AuthCallbackPage"));
const TransparansiPage = lazy(() => import("@/pages/id/TransparansiPage"));
const AntiScamPage = lazy(() => import("@/pages/id/AntiScamPage"));
const EdukasiPage = lazy(() => import("@/pages/id/EdukasiPage"));
const WhitepaperPage = lazy(() => import("@/pages/id/WhitepaperPage"));
const DAOPage = lazy(() => import("@/pages/id/DAOPage"));
const FAQPage = lazy(() => import("@/pages/id/FAQPage"));
const VerifiedCoordinatorsPage = lazy(() => import("@/pages/chapters/VerifiedCoordinatorsPage"));
const ChaptersSopPage = lazy(() => import("@/pages/chapters/ChaptersSopPage"));
const TermsConditionsPage = lazy(() => import("@/pages/legal/TermsConditionsPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/legal/PrivacyPolicyPage"));

// English Public Pages (Lazy Loaded)
const EnHomePage = lazy(() => import("@/pages/id/HomePage"));
const EnMarketPage = lazy(() => import("@/pages/id/MarketPage"));
const EnBuyTPCPage = lazy(() => import("@/pages/id/BuyTPCPage"));
const EnInvoiceSuccessPage = lazy(() => import("@/pages/id/InvoiceSuccessPage"));
const EnLoginPage = lazy(() => import("@/pages/id/LoginPage"));
const EnAuthCallbackPage = lazy(() => import("@/pages/en/AuthCallbackPage"));
const EnTransparansiPage = lazy(() => import("@/pages/id/TransparansiPage"));
const EnAntiScamPage = lazy(() => import("@/pages/id/AntiScamPage"));
const EnEdukasiPage = lazy(() => import("@/pages/id/EdukasiPage"));
const EnWhitepaperPage = lazy(() => import("@/pages/id/WhitepaperPage"));
const EnDAOPage = lazy(() => import("@/pages/id/DAOPage"));
const EnFAQPage = lazy(() => import("@/pages/id/FAQPage"));
const EnTermsConditionsPage = lazy(() => import("@/pages/legal/TermsConditionsPage"));
const EnPrivacyPolicyPage = lazy(() => import("@/pages/legal/PrivacyPolicyPage"));

// Preload functions for key routes
export const preloadBuyTPC = () => import("@/pages/id/BuyTPCPage");
export const preloadMarket = () => import("@/pages/id/MarketPage");

// Member Pages (Lazy Loaded)
const DashboardPage = lazy(() => import("@/pages/id/dashboard/DashboardPage"));
const InvoiceDetailPage = lazy(() => import("@/pages/id/dashboard/InvoiceDetailPage"));
const HistoryPage = lazy(() => import("@/pages/id/dashboard/HistoryPage"));
const ReferralPage = lazy(() => import("@/pages/id/dashboard/ReferralPage"));
const SettingsPage = lazy(() => import("@/pages/id/dashboard/SettingsPage"));

// New Member Pages (Lazy Loaded)
const MemberDashboardPage = lazy(() => import("@/pages/member/MemberDashboardPage"));
const MemberInvoicesPage = lazy(() => import("@/pages/member/MemberInvoicesPage"));
const MemberInvoiceDetailPage = lazy(() => import("@/pages/member/MemberInvoiceDetailPage"));
const MemberReferralPage = lazy(() => import("@/pages/member/MemberReferralPage"));
const MemberProfilePage = lazy(() => import("@/pages/member/MemberProfilePage"));

// Admin Pages (Lazy Loaded)
const AdminDashboardPageNew = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminInvoicesPageNew = lazy(() => import("@/pages/admin/AdminInvoicesPage"));
const AdminInvoiceDetailPageNew = lazy(() => import("@/pages/admin/AdminInvoiceDetailPage"));
const AdminUsersPageNew = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminSettingsPageNew = lazy(() => import("@/pages/admin/AdminSettingsPage"));
const AdminAuditPageNew = lazy(() => import("@/pages/admin/AdminAuditPage"));
const AdminAnalyticsPageNew = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminNotificationsPageNew = lazy(() => import("@/pages/admin/AdminNotificationsPage"));
const MessageTemplatesPage = lazy(() => import("@/pages/admin/MessageTemplatesPageNew"));

// Guards
import { RequireAdmin } from "@/components/guards/RequireAdmin";

const NotFound = lazy(() => import("./pages/NotFound"));

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
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <HomePage />
                </Suspense>
              } />
              <Route path="market" element={
                <Suspense fallback={<PageLoader />}>
                  <MarketPage />
                </Suspense>
              } />
              <Route path="buytpc" element={
                <Suspense fallback={<PageLoader />}>
                  <BuyTPCPage />
                </Suspense>
              } />
              <Route path="buytpc/success" element={
                <Suspense fallback={<PageLoader />}>
                  <InvoiceSuccessPage />
                </Suspense>
              } />
              <Route path="login" element={
                <Suspense fallback={<PageLoader />}>
                  <LoginPage />
                </Suspense>
              } />
              <Route path="auth/callback" element={
                <Suspense fallback={<PageLoader />}>
                  <AuthCallbackPage />
                </Suspense>
              } />
              <Route path="transparansi" element={
                <Suspense fallback={<PageLoader />}>
                  <TransparansiPage />
                </Suspense>
              } />
              <Route path="anti-scam" element={
                <Suspense fallback={<PageLoader />}>
                  <AntiScamPage />
                </Suspense>
              } />
              <Route path="edukasi" element={
                <Suspense fallback={<PageLoader />}>
                  <EdukasiPage />
                </Suspense>
              } />
              <Route path="whitepaper" element={
                <Suspense fallback={<PageLoader />}>
                  <WhitepaperPage />
                </Suspense>
              } />
              <Route path="dao" element={
                <Suspense fallback={<PageLoader />}>
                  <DAOPage />
                </Suspense>
              } />
              <Route path="faq" element={
                <Suspense fallback={<PageLoader />}>
                  <FAQPage />
                </Suspense>
              } />
              <Route path="verified-coordinators" element={
                <Suspense fallback={<PageLoader />}>
                  <VerifiedCoordinatorsPage />
                </Suspense>
              } />
              <Route path="chapters" element={
                <Suspense fallback={<PageLoader />}>
                  <ChaptersSopPage />
                </Suspense>
              } />
              <Route path="syarat-ketentuan" element={
                <Suspense fallback={<PageLoader />}>
                  <TermsConditionsPage />
                </Suspense>
              } />
              <Route path="kebijakan-privasi" element={
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPolicyPage />
                </Suspense>
              } />

              {/* Member Routes (Protected) */}
              <Route path="dashboard" element={<MemberLayout />}>
                <Route index element={
                  <Suspense fallback={<PageLoader />}>
                    <DashboardPage />
                  </Suspense>
                } />
                <Route path="invoices/:invoiceNo" element={
                  <Suspense fallback={<PageLoader />}>
                    <InvoiceDetailPage />
                  </Suspense>
                } />
                <Route path="history" element={
                  <Suspense fallback={<PageLoader />}>
                    <HistoryPage />
                  </Suspense>
                } />
                <Route path="referral" element={
                  <Suspense fallback={<PageLoader />}>
                    <ReferralPage />
                  </Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<PageLoader />}>
                    <SettingsPage />
                  </Suspense>
                } />
              </Route>

              {/* New Member Area Routes */}
              <Route path="member" element={<MemberLayout />}>
                <Route index element={<Navigate to="/id/member/dashboard" replace />} />
                <Route path="dashboard" element={
                  <Suspense fallback={<PageLoader />}>
                    <MemberDashboardPage />
                  </Suspense>
                } />
                <Route path="invoices" element={
                  <Suspense fallback={<PageLoader />}>
                    <MemberInvoicesPage />
                  </Suspense>
                } />
                <Route path="invoices/:id" element={
                  <Suspense fallback={<PageLoader />}>
                    <MemberInvoiceDetailPage />
                  </Suspense>
                } />
                <Route path="referrals" element={
                  <Suspense fallback={<PageLoader />}>
                    <MemberReferralPage />
                  </Suspense>
                } />
                <Route path="profile" element={
                  <Suspense fallback={<PageLoader />}>
                    <MemberProfilePage />
                  </Suspense>
                } />
              </Route>

              {/* Admin Routes (Premium with UUID Guard) */}
              <Route path="admin" element={<RequireAdmin><AdminLayoutPremium /></RequireAdmin>}>
                <Route index element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboardPageNew />
                  </Suspense>
                } />
                <Route path="invoices" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminInvoicesPageNew />
                  </Suspense>
                } />
                <Route path="invoices/:invoiceId" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminInvoiceDetailPageNew />
                  </Suspense>
                } />
                <Route path="users" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminUsersPageNew />
                  </Suspense>
                } />
                <Route path="analytics" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminAnalyticsPageNew />
                  </Suspense>
                } />
                <Route path="notifications" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminNotificationsPageNew />
                  </Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminSettingsPageNew />
                  </Suspense>
                } />
                <Route path="audit" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminAuditPageNew />
                  </Suspense>
                } />
                <Route path="marketing" element={
                  <Suspense fallback={<PageLoader />}>
                    <MessageTemplatesPage />
                  </Suspense>
                } />
                <Route path="marketing/templates" element={
                  <Suspense fallback={<PageLoader />}>
                    <MessageTemplatesPage />
                  </Suspense>
                } />
              </Route>
            </Route>

            {/* English Routes with Mobile Layout */}
            <Route path="/en" element={<MobileLayout />}>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <EnHomePage />
                </Suspense>
              } />
              <Route path="login" element={
                <Suspense fallback={<PageLoader />}>
                  <EnLoginPage />
                </Suspense>
              } />
              <Route path="auth/callback" element={
                <Suspense fallback={<PageLoader />}>
                  <EnAuthCallbackPage />
                </Suspense>
              } />
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
