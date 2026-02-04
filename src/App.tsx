import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
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
import TutorialPhantomWalletPage from "@/pages/public/TutorialPhantomWalletPage";
import PublicInvoiceDetailPage from "@/pages/public/PublicInvoiceDetailPage";

// English Public Pages (Static Imports - NO LAZY)
// Note: English pages reuse Indonesian components, so no separate imports needed

// Member Pages (New Member Area)
const MemberDashboardPage = lazy(() => import("@/pages/member/MemberDashboardPage"));
const MemberInvoicesPage = lazy(() => import("@/pages/member/MemberInvoicesPage"));
const MemberInvoiceDetailPage = lazy(() => import("@/pages/member/MemberInvoiceDetailPage"));
const InvoiceLegacyRedirectPage = lazy(() => import("@/pages/id/member/InvoiceLegacyRedirectPage"));
const MemberReferralPage = lazy(() => import("@/pages/member/MemberReferralPage"));
const ProfilePage = lazy(() => import("@/pages/id/member/ProfilePage"));
const EnProfilePage = lazy(() => import("@/pages/en/member/ProfilePage"));

// Admin Pages (New)
const AdminDashboardPageNew = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminInvoicesPageNew = lazy(() => import("@/pages/admin/AdminInvoicesPage"));
const AdminInvoiceDetailPageNew = lazy(() => import("@/pages/admin/AdminInvoiceDetailPage"));
const AdminUsersPageNew = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminReferralsPage = lazy(() => import("@/pages/admin/AdminReferralsPage"));
const AdminSettingsPageNew = lazy(() => import("@/pages/admin/AdminSettingsPage"));
const AdminAuditPageNew = lazy(() => import("@/pages/admin/AdminAuditPage"));
const AdminAnalyticsPageNew = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminNotificationsPageNew = lazy(() => import("@/pages/admin/AdminNotificationsPage"));
const MessageTemplatesPage = lazy(() => import("@/pages/admin/MessageTemplatesPageNew"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function useSafeLang() {
  const { lang } = useParams();
  return lang === "en" ? "en" : "id";
}

function LangCallbackPageRedirect() {
  const safe = useSafeLang();
  return <Navigate to={`/${safe}/auth/callback`} replace />;
}

function LegacyDashboardAlias() {
  // Alias lama: /:lang/dashboard -> /:lang/member/dashboard
  const safe = useSafeLang();
  return <Navigate to={`/${safe}/member/dashboard`} replace />;
}

function LegacyDashboardDeepAlias() {
  // Alias lama: /:lang/dashboard/... -> /:lang/member/dashboard (biar gak “nyasar”)
  const safe = useSafeLang();
  return <Navigate to={`/${safe}/member/dashboard`} replace />;
}

function LangIndexPage() {
  const safe = useSafeLang();
  // Index /id atau /en tetap render home sesuai bahasa
  if (safe === "en") {
    return <HomePage />;
  }
  return <HomePage />;
}

function LangRoute({
  id,
  en,
}: {
  id: React.ReactNode;
  en: React.ReactNode;
}) {
  const safe = useSafeLang();
  return <>{safe === "en" ? en : id}</>;
}

const App = () => {
  const { user, isAdmin } = useAuth();
  
  // Router sanity check
  useEffect(() => {
    console.log("[AUTH] Profile ensured");
    console.log("[AUTH] Admin access:", isAdmin);
    if (isAdmin) {
      console.log("[AUTH] Admin access granted");
    }
  }, [isAdmin]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Legacy / non-lang callback redirects */}
          <Route path="/auth/callback" element={<Navigate to="/id/auth/callback" replace />} />
          <Route path="/auth/callback-page" element={<Navigate to="/id/auth/callback" replace />} />

          {/* Root -> /id */}
              <Route path="/" element={<Navigate to="/id" replace />} />

              {/* ✅ SINGLE SOURCE OF TRUTH: Language Shell */}
              <Route path="/:lang" element={
                <RouteErrorBoundary>
                  <MobileLayout />
                </RouteErrorBoundary>
              }>
                {/* Index: Home */}
                <Route index element={<LangIndexPage />} />

                {/* Auth callback (canonical) */}
                <Route
                  path="auth/callback"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AuthCallbackPage />
                    </Suspense>
                  }
                />
                {/* Fix: callback-page MUST resolve :lang properly */}
                <Route path="auth/callback-page" element={<LangCallbackPageRedirect />} />

                {/* Public pages */}
                <Route
                  path="market"
                  element={
                    <LangRoute
                      id={<MarketPage />}
                      en={<MarketPage />}
                    />
                  }
                />
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
                <Route
                  path="invoice/:invoiceNo"
                  element={<PublicInvoiceDetailPage />}
                />
                
                {/* ✅ LEGACY DASHBOARD REDIRECT */}
                <Route 
                  path="dashboard" 
                  element={<Navigate to="member" replace />} 
                />
                <Route 
                  path="dashboard/*" 
                  element={<Navigate to="member" replace />} 
                />
                
                {/* ✅ LEGACY EXTERNAL REDIRECTS */}
                <Route 
                  path="invoices/:invoiceNo" 
                  element={<Navigate to="../member/invoices-no/:invoiceNo" replace />} 
                />
                <Route 
                  path="member/invoice/:invoiceNo" 
                  element={<Navigate to="../invoices-no/:invoiceNo" replace />} 
                />
                <Route
                  path="login"
                  element={
                    <LangRoute
                      id={<LoginPage />}
                      en={<LoginPage />}
                    />
                  }
                />
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
                      id={<AntiScamPage />}
                      en={<AntiScamPage />}
                    />
                  }
                />
                <Route
                  path="tutorial/phantom-wallet"
                  element={<TutorialPhantomWalletPage />}
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
                  path="verified-coordinators"
                  element={<VerifiedCoordinatorsPage />}
                />
                <Route
                  path="chapters"
                  element={<ChaptersSopPage />}
                />
                <Route
                  path="syarat-ketentuan"
                  element={
                    <LangRoute
                      id={<TermsConditionsPage />}
                      en={<TermsConditionsPage />}
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

                {/* ✅ FINAL MEMBER AREA (SINGLE NAMESPACE) */}
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
                    path="dashboard"
                    element={<Navigate to="." replace />}
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
                  
                  {/* ✅ LEGACY COMPAT */}
                  <Route
                    path="invoices-no/:invoiceNo"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <InvoiceLegacyRedirectPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <LangRoute
                        id={
                          <Suspense fallback={<PageLoader />}>
                            <ProfilePage />
                          </Suspense>
                        }
                        en={
                          <Suspense fallback={<PageLoader />}>
                            <EnProfilePage />
                          </Suspense>
                        }
                      />
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
                </Route>

                {/* ✅ ALIAS LAMA: /:lang/dashboard -> /:lang/member/dashboard */}
                <Route path="dashboard" element={<LegacyDashboardAlias />} />
                <Route path="dashboard/*" element={<LegacyDashboardDeepAlias />} />
                
                {/* ✅ LEGACY INVOICES REDIRECT */}
                <Route path="invoices" element={<Navigate to="member/invoices" replace />} />

                {/* ✅ ADMIN */}
                <Route
                  path="admin"
                  element={
                    <RequireAdmin>
                      <RouteErrorBoundary>
                        <Suspense fallback={<FullScreenLoader />}>
                          <AdminLayoutPremium />
                        </Suspense>
                      </RouteErrorBoundary>
                    </RequireAdmin>
                  }
                >
                  {/* /id/admin */}
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminDashboardPageNew />
                      </Suspense>
                    }
                  />

                  {/* /id/admin/dashboard */}
                  <Route
                    path="dashboard"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminDashboardPageNew />
                      </Suspense>
                    }
                  />
                  <Route
                    path="invoices"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminInvoicesPageNew />
                      </Suspense>
                    }
                  />
                  <Route
                    path="invoices/:invoiceNo"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminInvoiceDetailPageNew />
                      </Suspense>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminUsersPageNew />
                      </Suspense>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminAnalyticsPageNew />
                      </Suspense>
                    }
                  />
                  <Route
                    path="notifications"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminNotificationsPageNew />
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
                        <AdminSettingsPageNew />
                      </Suspense>
                    }
                  />
                  <Route
                    path="audit"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminAuditPageNew />
                      </Suspense>
                    }
                  />
                  <Route
                    path="marketing"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <MessageTemplatesPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="marketing/templates"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <MessageTemplatesPage />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Shell catch-all */}
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  }
                />
              </Route>

              {/* Global catch-all */}
              <Route
                path="*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
