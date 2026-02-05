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

// Contexts & Error Boundaries
import { AuthProvider } from "@/contexts/AuthContext";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import FullScreenLoader from "@/components/FullScreenLoader";
import PageLoader from "@/components/PageLoader";
import AppErrorBoundary from "@/components/system/AppErrorBoundary";
import LangRoute from "@/components/system/LangRoute";
import IdOnly from "@/components/system/IdOnly";

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
import LoginPage from "@/pages/id/LoginPage"; // Legacy
import BuyTPCPage from "@/pages/id/BuyTPCPage";
import AntiScamPage from "@/pages/id/AntiScamPage";
import EdukasiPage from "@/pages/id/EdukasiPage";
import FAQPage from "@/pages/id/FAQPage";
import WhitepaperPage from "@/pages/id/WhitepaperPage";
import DAOPage from "@/pages/id/DAOPage";
import TransparansiPage from "@/pages/id/TransparansiPage";
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminInvoicesPage from './pages/admin/AdminInvoicesPageWorking';
import AdminInvoiceDetailPage from './pages/admin/AdminInvoiceDetailPageSimple';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReferralsPage from './pages/admin/AdminReferralsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import MarketPage from "@/pages/id/MarketPage";
import InvoiceSuccessPage from "@/pages/id/InvoiceSuccessPage";

// Shared Public Pages
import TutorialPhantomWalletPage from "@/pages/public/TutorialPhantomWalletPage";
import PublicInvoiceDetailPage from "@/pages/public/PublicInvoiceDetailPage";
import LoginPageV2 from "@/pages/public/LoginPage"; // V2

// Member Pages (Lazy Loaded)
const MemberDashboardPage = lazy(() => import("@/pages/member/MemberDashboardPage"));
const MemberInvoicesPage = lazy(() => import("@/pages/member/MemberInvoicesPage"));
const MemberInvoiceDetailPage = lazy(() => import("@/pages/member/MemberInvoiceDetailPage"));
const MemberReferralPage = lazy(() => import("@/pages/member/MemberReferralPage"));
const MemberProfilePage = lazy(() => import("@/pages/member/MemberProfilePage"));
const MemberSettingsPage = lazy(() => import("@/pages/member/MemberSettingsPage"));
const MemberWalletPage = lazy(() => import("@/pages/member/MemberWalletPage"));
const MemberWithdrawalPage = lazy(() => import("@/pages/member/MemberWithdrawalPage"));

// Admin Pages (Lazy Loaded)
const AdminInvoicesPage = lazy(() => import("@/pages/admin/AdminInvoicesPage"));
const AdminInvoiceDetailPage = lazy(() => import("@/pages/admin/AdminInvoiceDetailPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminReferralsPage = lazy(() => import("@/pages/admin/AdminReferralsPage"));

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
                      id={<LoginPageV2 />}
                      en={<LoginPage />}
                    />
                  }
                />
                
                {/* Legacy fallback route */}
                <Route
                  path="login-legacy"
                  element={<IdOnly><LoginPage /></IdOnly>}
                />
                
                {/* PUBLIC ID ROUTES (ID-only) */}
                <Route
                  path="buytpc"
                  element={<IdOnly><BuyTPCPage /></IdOnly>}
                />
                <Route
                  path="anti-scam"
                  element={<IdOnly><AntiScamPage /></IdOnly>}
                />
                <Route
                  path="edukasi"
                  element={<IdOnly><EdukasiPage /></IdOnly>}
                />
                <Route
                  path="faq"
                  element={<IdOnly><FAQPage /></IdOnly>}
                />
                <Route
                  path="whitepaper"
                  element={<IdOnly><WhitepaperPage /></IdOnly>}
                />
                <Route
                  path="dao"
                  element={<IdOnly><DAOPage /></IdOnly>}
                />
                <Route
                  path="transparansi"
                  element={<IdOnly><TransparansiPage /></IdOnly>}
                />
                <Route
                  path="market"
                  element={<IdOnly><MarketPage /></IdOnly>}
                />
                <Route
                  path="invoice/success"
                  element={<IdOnly><InvoiceSuccessPage /></IdOnly>}
                />
                
                {/* SHARED PUBLIC ROUTES */}
                <Route
                  path="tutorial/phantom-wallet"
                  element={<TutorialPhantomWalletPage />}
                />
                <Route
                  path="public/invoice/:invoiceNo"
                  element={<PublicInvoiceDetailPage />}
                />
                
                {/* CANONICAL DASHBOARD ROUTE */}
                <Route
                  path="dashboard"
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
                        <Navigate replace to="member" />
                      </Suspense>
                    }
                  />
                  <Route
                    path="member"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <MemberDashboardPage />
                      </Suspense>
                    }
                  />
                </Route>

                {/* CANONICAL MEMBER AREA */}
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
                </Route>
                
                {/* ADMIN ROUTES (ID-only) */}
                <Route
                  path="admin"
                  element={<IdOnly><AdminLayoutPremium /></IdOnly>}
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
                
                {/* 404 - MUST BE LAST */}
                <Route path="*" element={<NotFound />} />
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
