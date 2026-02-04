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

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import("@/pages/id/HomePage"));
const MarketPage = lazy(() => import("@/pages/id/MarketPage"));
const BuyTPCPage = lazy(() => import("@/pages/id/BuyTPCPage"));
const InvoiceSuccessPage = lazy(() => import("@/pages/id/InvoiceSuccessPage"));
const LoginPage = lazy(() => import("@/pages/id/LoginPage"));
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
const TutorialPhantomWalletPage = lazy(() => import("@/pages/public/TutorialPhantomWalletPage"));
const PublicInvoiceDetailPage = lazy(() => import("@/pages/public/PublicInvoiceDetailPage"));

// English Public Pages (Lazy Loaded) — tetap mengikuti struktur kamu sekarang
const EnHomePage = lazy(() => import("@/pages/id/HomePage"));
const EnMarketPage = lazy(() => import("@/pages/id/MarketPage"));
const EnBuyTPCPage = lazy(() => import("@/pages/id/BuyTPCPage"));
const EnInvoiceSuccessPage = lazy(() => import("@/pages/id/InvoiceSuccessPage"));
const EnLoginPage = lazy(() => import("@/pages/id/LoginPage"));
const EnTransparansiPage = lazy(() => import("@/pages/id/TransparansiPage"));
const EnAntiScamPage = lazy(() => import("@/pages/id/AntiScamPage"));
const EnEdukasiPage = lazy(() => import("@/pages/id/EdukasiPage"));
const EnWhitepaperPage = lazy(() => import("@/pages/id/WhitepaperPage"));
const EnDAOPage = lazy(() => import("@/pages/id/DAOPage"));
const EnFAQPage = lazy(() => import("@/pages/id/FAQPage"));
const EnTermsConditionsPage = lazy(() => import("@/pages/legal/TermsConditionsPage"));
const EnPrivacyPolicyPage = lazy(() => import("@/pages/legal/PrivacyPolicyPage"));

// Member Pages (New Member Area)
const MemberDashboardPage = lazy(() => import("@/pages/member/MemberDashboardPage"));
const MemberInvoicesPage = lazy(() => import("@/pages/member/MemberInvoicesPage"));
const MemberInvoiceDetailPage = lazy(() => import("@/pages/member/MemberInvoiceDetailPage"));
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

// Preload functions for key routes
export const preloadBuyTPC = () => import("@/pages/id/BuyTPCPage");
export const preloadMarket = () => import("@/pages/id/MarketPage");

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

function LangIndex() {
  const safe = useSafeLang();
  // Index /id atau /en tetap render home sesuai bahasa
  if (safe === "en") {
    return (
      <Suspense fallback={<PageLoader />}>
        <EnHomePage />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  );
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
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <Routes>
              {/* Legacy / non-lang callback redirects */}
              <Route path="/auth/callback" element={<Navigate to="/id/auth/callback" replace />} />
              <Route path="/auth/callback-page" element={<Navigate to="/id/auth/callback" replace />} />

              {/* Root -> /id */}
              <Route path="/" element={<Navigate to="/id" replace />} />

              {/* ✅ SINGLE SOURCE OF TRUTH: Language Shell */}
              <Route path="/:lang" element={<MobileLayout />}>
                {/* Index: Home */}
                <Route index element={<LangIndex />} />

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
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <MarketPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnMarketPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="buytpc"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <BuyTPCPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnBuyTPCPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="buytpc/success"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <InvoiceSuccessPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnInvoiceSuccessPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="invoice/:invoiceNo"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PublicInvoiceDetailPage />
                    </Suspense>
                  }
                />
                <Route
                  path="login"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <LoginPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnLoginPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="transparansi"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <TransparansiPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnTransparansiPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="anti-scam"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <AntiScamPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnAntiScamPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="tutorial/phantom-wallet"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <TutorialPhantomWalletPage />
                    </Suspense>
                  }
                />
                <Route
                  path="edukasi"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <EdukasiPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnEdukasiPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="whitepaper"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <WhitepaperPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnWhitepaperPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="dao"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <DAOPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnDAOPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="faq"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <FAQPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnFAQPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="verified-coordinators"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <VerifiedCoordinatorsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="chapters"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ChaptersSopPage />
                    </Suspense>
                  }
                />
                <Route
                  path="syarat-ketentuan"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <TermsConditionsPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnTermsConditionsPage />
                        </Suspense>
                      }
                    />
                  }
                />
                <Route
                  path="kebijakan-privasi"
                  element={
                    <LangRoute
                      id={
                        <Suspense fallback={<PageLoader />}>
                          <PrivacyPolicyPage />
                        </Suspense>
                      }
                      en={
                        <Suspense fallback={<PageLoader />}>
                          <EnPrivacyPolicyPage />
                        </Suspense>
                      }
                    />
                  }
                />

                {/* ✅ FINAL MEMBER AREA (SINGLE NAMESPACE) */}
                <Route path="member" element={<MemberLayout />}>
                  <Route
                    index
                    element={<Navigate to="dashboard" replace />}
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
                    path="invoices/:id"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <MemberInvoiceDetailPage />
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

                {/* ✅ ADMIN */}
                <Route
                  path="admin"
                  element={
                    <RequireAdmin>
                      <AdminLayoutPremium />
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
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
