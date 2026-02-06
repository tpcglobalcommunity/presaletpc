// React & Router Core
import { lazy, Suspense } from "react";
import {
  Routes, 
  Route, 
  Navigate,
  useParams
} from "react-router-dom";

// UI & State Management
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PublicRouteGuard } from "@/components/guards/PublicRouteGuard";
import { RequireAdmin } from "@/components/guards/RequireAdmin";

// Contexts & Error Boundaries
import { AuthProvider } from "@/contexts/AuthContext";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import FullScreenLoader from "@/components/FullScreenLoader";
import PageLoader from "@/components/PageLoader";
import AppErrorBoundary from "@/components/system/AppErrorBoundary";
import LangRoute from "@/components/system/LangRoute";
import IdOnly from "@/components/system/IdOnly";
import RedirectLegacyRoute from "@/components/system/RedirectLegacyRoute";

// Layouts
import { MobileLayout } from "@/layouts/MobileLayout";
import { MemberLayout } from "@/layouts/MemberLayout";
import { AdminLayoutPremium } from "@/components/AdminLayoutPremium";

// WWW to non-www redirect guard
if (typeof window !== "undefined" && window.location.hostname === "www.tpcglobal.io") {
  const target = `https://tpcglobal.io${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(target);
}

// Auth Callback
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import NotFound from "@/pages/NotFound";

// Public Pages (ID)
import HomePage from "@/pages/id/HomePage";
import BuyTPCPage from "@/pages/id/BuyTPCPage";
import PresaleInfoPage from "@/pages/id/PresaleInfoPage";
import AntiScamPage from "@/pages/public/AntiScamPage";
import EdukasiPage from "@/pages/id/EdukasiPage";
import FAQPage from "@/pages/id/FAQPage";
import WhitepaperPage from "@/pages/id/WhitepaperPage";
import DAOPage from "@/pages/id/DAOPage";
import TransparansiPage from "@/pages/id/TransparansiPage";
import MarketPage from "@/pages/id/MarketPage";
import InvoiceSuccessPage from "@/pages/id/InvoiceSuccessPage";
import TermsConditionsPage from "@/pages/legal/TermsConditionsPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";

// Shared Public Pages
import TutorialPhantomWalletPage from "@/pages/public/TutorialPhantomWalletPage";
import LoginPageV2 from "@/pages/public/LoginPage"; // V2
import LegacyAuthRedirectPage from "@/pages/public/LegacyAuthRedirectPage";
import OnboardingPage from "@/pages/id/OnboardingPage";
import VerifiedCoordinatorsPage from "@/pages/chapters/VerifiedCoordinatorsPage";
import ChaptersSopPage from "@/pages/chapters/ChaptersSopPage";

// Member Pages (Lazy Loaded)
const MemberDashboardPage = lazy(() => import("@/pages/member/MemberDashboardPage"));
const MemberInvoicesPage = lazy(() => import("@/pages/member/MemberInvoicesPage"));
const MemberInvoiceDetailPage = lazy(() => import("@/pages/member/MemberInvoiceDetailPage"));
const MemberReferralPage = lazy(() => import("@/pages/member/MemberReferralPage"));
const MemberProfilePage = lazy(() => import("@/pages/member/MemberProfilePage"));
const MemberSettingsPage = lazy(() => import("@/pages/member/MemberSettingsPage"));
const MemberWalletPage = lazy(() => import("@/pages/member/MemberWalletPage"));
const MemberWithdrawalPage = lazy(() => import("@/pages/member/MemberWithdrawalPage"));
const CompleteProfilePage = lazy(() => import("@/pages/id/CompleteProfilePage"));
const BuyTPCMemberPage = lazy(() => import("@/pages/id/member/BuyTPCMemberPage"));

// Admin Pages (Lazy Loaded)
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminInvoicesPage = lazy(() => import("@/pages/admin/AdminInvoicesPage"));
const AdminInvoiceDetailPage = lazy(() => import("@/pages/admin/AdminInvoiceDetailPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminReferralsPage = lazy(() => import("@/pages/admin/AdminReferralsPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));

// LangIndexPage
function LangIndexPage() {
  const params = useParams();
  const lang = params?.lang === "en" ? "en" : "id";
  // Index /id atau /en render home sesuai bahasa
  if (lang === "en") {
    return <Navigate to="/en/login" replace />; // EN redirect ke login
  }
  return <HomePage />; // ID gunakan HomePage
}

const queryClient = new QueryClient();

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Root redirect to default language */}
              <Route path="/" element={<Navigate replace to="/id" />} />
                
                {/* Language shell */}
                <Route path="/:lang" element={<PublicRouteGuard><MobileLayout /></PublicRouteGuard>}>
                {/* Index route */}
                <Route index element={<LangIndexPage />} />
                
                {/* Auth callback */}
                <Route path="auth/callback" element={<AuthCallbackPage />} />
                
                {/* Login */}
                <Route
                  path="login"
                  element={
                    <LangRoute
                      id={<LoginPageV2 />}
                      en={<LoginPageV2 />}
                    />
                  }
                />
                
                {/* Onboarding Route */}
                <Route
                  path="onboarding"
                  element={
                    <RouteErrorBoundary>
                      <Suspense fallback={<FullScreenLoader />}>
                        <LangRoute
                          id={<OnboardingPage />}
                          en={<OnboardingPage />}
                        />
                      </Suspense>
                    </RouteErrorBoundary>
                  }
                />

                {/* Legacy fallback route */}
                <Route
                  path="login-legacy"
                  element={<IdOnly><LoginPageV2 /></IdOnly>}
                />
                
                {/* PUBLIC ID ROUTES (ID-only) */}
                <Route
                  path="presale"
                  element={<LangRoute id={<PresaleInfoPage />} en={<PresaleInfoPage />} />}
                />
                <Route
                  path="buytpc"
                  element={<IdOnly><BuyTPCPage /></IdOnly>}
                />
                <Route
                  path="anti-scam"
                  element={<LangRoute id={<AntiScamPage />} en={<AntiScamPage />} />}
                />
                <Route
                  path="edukasi"
                  element={<LangRoute id={<EdukasiPage />} en={<EdukasiPage />} />}
                />
                <Route
                  path="faq"
                  element={<LangRoute id={<FAQPage />} en={<FAQPage />} />}
                />
                <Route
                  path="whitepaper"
                  element={<LangRoute id={<WhitepaperPage />} en={<WhitepaperPage />} />}
                />
                <Route
                  path="dao"
                  element={<LangRoute id={<DAOPage />} en={<DAOPage />} />}
                />
                <Route
                  path="transparansi"
                  element={<LangRoute id={<TransparansiPage />} en={<TransparansiPage />} />}
                />
                <Route
                  path="market"
                  element={<LangRoute id={<MarketPage />} en={<MarketPage />} />}
                />
                <Route
                  path="invoice/success"
                  element={<LangRoute id={<InvoiceSuccessPage />} en={<InvoiceSuccessPage />} />}
                />
                <Route
                  path="syarat-ketentuan"
                  element={<LangRoute id={<TermsConditionsPage />} en={<TermsConditionsPage />} />}
                />
                <Route
                  path="terms"
                  element={<LangRoute id={<TermsConditionsPage />} en={<TermsConditionsPage />} />}
                />
                <Route
                  path="kebijakan-privasi"
                  element={<LangRoute id={<PrivacyPolicyPage />} en={<PrivacyPolicyPage />} />}
                />
                <Route
                  path="privacy"
                  element={<LangRoute id={<PrivacyPolicyPage />} en={<PrivacyPolicyPage />} />}
                />
                <Route
                  path="verified-coordinators"
                  element={<LangRoute id={<VerifiedCoordinatorsPage />} en={<VerifiedCoordinatorsPage />} />}
                />
                <Route
                  path="chapters"
                  element={<LangRoute id={<ChaptersSopPage />} en={<ChaptersSopPage />} />}
                />
                <Route
                  path="chapters/sop"
                  element={<LangRoute id={<ChaptersSopPage />} en={<ChaptersSopPage />} />}
                />
                
                {/* SHARED PUBLIC ROUTES */}
                <Route
                  path="tutorial/phantom-wallet"
                  element={<TutorialPhantomWalletPage />}
                />
                
                {/* LEGACY AUTH REDIRECT */}
                <Route
                  path="auth"
                  element={<LegacyAuthRedirectPage />}
                />
                
                {/* LEGACY REDIRECTS FOR MEMBER/ADMIN */}
                <Route
                  path="member/*"
                  element={<RedirectLegacyRoute to="member" />}
                />
                <Route
                  path="admin/*"
                  element={<RedirectLegacyRoute to="admin" />}
                />
                
                {/* 404 - MUST BE LAST */}
                <Route path="*" element={<NotFound />} />
              </Route> {/* End of /:lang */}
              
              {/* TOP-LEVEL MEMBER AREA (EN ONLY) */}
              <Route 
                path="member" 
                element={
                  <RouteErrorBoundary>
                    <Suspense fallback={<FullScreenLoader />}>
                      <MemberLayout />
                    </Suspense>
                  </RouteErrorBoundary>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberDashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberDashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path="complete-profile"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <CompleteProfilePage />
                    </Suspense>
                  }
                />
                <Route
                  path="invoices"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberInvoicesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="invoices/:invoiceNo"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberInvoiceDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path="referrals"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberReferralPage />
                    </Suspense>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberProfilePage />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberSettingsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="wallet"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberWalletPage />
                    </Suspense>
                  }
                />
                <Route
                  path="withdraw"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberWithdrawalPage />
                    </Suspense>
                  }
                />
                <Route
                  path="buytpc"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <BuyTPCMemberPage />
                    </Suspense>
                  }
                />
              </Route>
              
              {/* TOP-LEVEL ADMIN AREA (EN ONLY) */}
              <Route 
                path="admin" 
                element={
                  <RouteErrorBoundary>
                    <Suspense fallback={<FullScreenLoader />}>
                      <RequireAdmin>
                        <AdminLayoutPremium />
                      </RequireAdmin>
                    </Suspense>
                  </RouteErrorBoundary>
                }
              >
                <Route index element={<Navigate replace to="invoices" />} />
                <Route 
                  path="dashboard" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminDashboardPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="invoices" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminInvoicesPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="invoices/:invoiceKey" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminInvoiceDetailPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="referrals" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminReferralsPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="analytics" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminAnalyticsPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="users" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminUsersPage />
                    </Suspense>
                  } 
                />
              </Route>
              
              {/* Global 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
