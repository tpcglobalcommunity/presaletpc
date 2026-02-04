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
import { lazy, Suspense, useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import PageLoader from "@/components/PageLoader";

// WWW to non-www redirect guard
if (typeof window !== "undefined" && window.location.hostname === "www.tpcglobal.io") {
  const target = `https://tpcglobal.io${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(target);
}

// Layouts
import { MobileLayout } from "@/layouts/MobileLayout";
import { MemberLayout } from "@/layouts/MemberLayout";
import { AdminLayoutPremium } from "@/components/AdminLayoutPremium";

// Auth Callback (Canonical)
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";

// Guards
import { RequireAdmin } from "@/components/guards/RequireAdmin";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import FullScreenLoader from "@/components/FullScreenLoader";

// Public Pages (Static Imports - NO LAZY)
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

// English Public Pages (Static Imports - NO LAZY)
// Note: English pages reuse Indonesian components, so no separate imports needed
import PublicInvoiceDetailPage from "@/pages/public/PublicInvoiceDetailPage";

// Public V2 Pages (Safe Migration Testing)
import HomePageV2 from "@/pages/public/HomePage";
import LoginPageV2 from "@/pages/public/LoginPage";
import AntiScamPageV2 from "@/pages/public/AntiScamPage";

// Member Pages (New Member Area)
const MemberDashboardPage = lazy(() => import("@/pages/member/MemberDashboardPage"));
const MemberInvoicesPage = lazy(() => import("@/pages/member/MemberInvoicesPage"));
const MemberInvoiceDetailPage = lazy(() => import("@/pages/member/MemberInvoiceDetailPage"));
const MemberReferralPage = lazy(() => import("@/pages/member/MemberReferralPage"));
const ProfilePage = lazy(() => import("@/pages/id/member/ProfilePage"));
const EnProfilePage = lazy(() => import("@/pages/en/member/ProfilePage"));

// Admin Pages (Lazy Loaded)
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminInvoicesPage = lazy(() => import("@/pages/admin/AdminInvoicesPage"));
const AdminInvoiceDetailPage = lazy(() => import("@/pages/admin/AdminInvoiceDetailPage"));
const AdminReferralsPage = lazy(() => import("@/pages/admin/AdminReferralsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));
const AdminAuditPage = lazy(() => import("@/pages/admin/AdminAuditPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminNotificationsPage = lazy(() => import("@/pages/admin/AdminNotificationsPage"));
const MessageTemplatesPage = lazy(() => import("@/pages/admin/MessageTemplatesPageNew"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function LangCallbackPageRedirect() {
  const params = useParams();
  const lang = params.lang === "en" ? "en" : "id";
  return <Navigate to={`/${lang}/auth/callback`} replace />;
}

function LangIndexPage() {
  const params = useParams();
  const lang = params.lang === "en" ? "en" : "id";
  // Index /id atau /en render home sesuai bahasa
  if (lang === "en") {
    return <HomePage />; // EN tetap behavior sekarang
  }
  return <HomePageV2 />; // ID cutover ke v2
}

function LangRoute({
  id,
  en,
}: {
  id: React.ReactNode;
  en: React.ReactNode;
}) {
  const params = useParams();
  const lang = params.lang === "en" ? "en" : "id";
  return <>{lang === "en" ? en : id}</>;
}

const App = () => {
  const { user, isAdmin } = useAuth();
  
  // Router sanity check
  useEffect(() => {
    console.log("[AUTH] Profile ensured");
    console.log("[AUTH] Admin access:", isAdmin);
    if (isAdmin) {
      console.log("[AUTH] Admin routes available");
    }
  }, [isAdmin]);

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
              
              {/* Language shell */}
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
                
                {/* Public V2 Routes (Safe Migration Testing) */}
                <Route path="home-v2" element={<HomePageV2 />} />
                <Route path="login-v2" element={<LoginPageV2 />} />
                <Route path="anti-scam-v2" element={<AntiScamPageV2 />} />
                
                {/* Legacy fallback routes */}
                <Route path="home-legacy" element={<HomePage />} />
                <Route path="anti-scam-legacy" element={<AntiScamPage />} />
                
                {/* Legacy alias routes (STATIC ONLY, NO WILDCARD PARSING) */}
                <Route 
                  path="dashboard" 
                  element={<Navigate replace to="member" />} 
                />
                <Route 
                  path="dashboard/*" 
                  element={<Navigate replace to="member" />} 
                />
                <Route 
                  path="member/dashboard" 
                  element={<Navigate replace to="member" />} 
                />
                
                {/* Member area */}
                <Route path="member" element={
                  <RouteErrorBoundary>
                    <Suspense fallback={<FullScreenLoader />}>
                      <MemberLayout />
                    </Suspense>
                  </RouteErrorBoundary>
                }>
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <MemberDashboardPage />
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
                    path="invoices/:id"
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
                      <LangRoute
                        id={<ProfilePage />}
                        en={<EnProfilePage />}
                      />
                    }
                  />
                </Route>
                
                {/* Buy TPC */}
                <Route
                  path="buytpc"
                  element={
                    <LangRoute
                      id={<BuyTPCPage />}
                      en={<BuyTPCPage />}
                    />
                  }
                />
                <Route
                  path="buytpc/success"
                  element={
                    <LangRoute
                      id={<InvoiceSuccessPage />}
                      en={<InvoiceSuccessPage />}
                    />
                  }
                />
                
                {/* Public invoice */}
                <Route
                  path="invoice/:invoiceNo"
                  element={<PublicInvoiceDetailPage />}
                />
                
                {/* Other public pages */}
                <Route
                  path="transparansi"
                  element={
                    <LangRoute
                      id={<TransparansiPage />}
                      en={<TransparansiPage />}
                    />
                  }
                />
                <Route
                  path="anti-scam"
                  element={
                    <LangRoute
                      id={<AntiScamPageV2 />}
                      en={<Navigate to="/en/member" replace />}
                    />
                  }
                />
                <Route
                  path="edukasi"
                  element={
                    <LangRoute
                      id={<EdukasiPage />}
                      en={<EdukasiPage />}
                    />
                  }
                />
                <Route
                  path="whitepaper"
                  element={
                    <LangRoute
                      id={<WhitepaperPage />}
                      en={<WhitepaperPage />}
                    />
                  }
                />
                <Route
                  path="dao"
                  element={
                    <LangRoute
                      id={<DAOPage />}
                      en={<DAOPage />}
                    />
                  }
                />
                <Route
                  path="faq"
                  element={
                    <LangRoute
                      id={<FAQPage />}
                      en={<FAQPage />}
                    />
                  }
                />
                <Route
                  path="kebijakan-privasi"
                  element={
                    <LangRoute
                      id={<PrivacyPolicyPage />}
                      en={<PrivacyPolicyPage />}
                    />
                  }
                />
                
                {/* Admin area */}
                <Route 
                  path="admin/*" 
                  element={
                    <RequireAdmin>
                      <AdminLayoutPremium />
                    </RequireAdmin>
                  }
                >
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminDashboardPage />
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
                  <Route
                    path="invoices"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminInvoicesPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="invoices/:id"
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
                    path="settings"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminSettingsPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="audit"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminAuditPage />
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
                    path="notifications"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminNotificationsPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="message-templates"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <MessageTemplatesPage />
                      </Suspense>
                    }
                  />
                </Route>
                
                {/* 404 - MUST BE LAST */}
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
