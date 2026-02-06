/**
 * ROUTE ACCESS CONTROL - HARD LOCK
 * 
 * EXPLICIT PROTECTION: Only /member and /admin areas are protected.
 * Everything else is public by default.
 */

// Public route prefixes (both /id and /en will be checked)
export const PUBLIC_ROUTE_PREFIXES = [
  '/',                    // Root (redirects to /id)
  '/login',              // Login pages
  '/auth',               // Auth callbacks
  '/onboarding',         // Onboarding flow
  '/market',             // Market page
  '/transparansi',       // Transparency page (ID)
  '/transparency',       // Transparency page (EN)
  '/anti-scam',          // Anti-scam guide
  '/tutorial',           // Tutorial pages
  '/edukasi',            // Education page (ID)
  '/education',          // Education page (EN)
  '/faq',                // FAQ
  '/whitepaper',         // Whitepaper
  '/dao',                // DAO page
  '/dao-lite',           // DAO lite (if exists)
  '/presale',            // Presale info
  '/buytpc',             // Buy TPC marketing page
  '/invoice/success',    // Invoice success page
  '/syarat-ketentuan',   // Terms (ID)
  '/terms',              // Terms (EN)
  '/kebijakan-privasi',  // Privacy policy (ID)
  '/privacy',            // Privacy policy (EN)
  '/verified-coordinators', // Verified coordinators
  '/chapters',           // Chapters
  '/chapters/sop',       // Chapters SOP
];

/**
 * Normalize path for consistent matching
 */
function normalizePath(pathname: string): string {
  if (!pathname) return '';
  
  return pathname
    .replace(/\/+/g, '/')           // Replace multiple slashes with single
    .replace(/[#?].*$/, '')         // Remove hash and query params
    .replace(/\/$/, '') || '/';     // Remove trailing slash, but keep root as '/'
}

/**
 * Check if a path is public (accessible without auth)
 * @param pathname - The URL pathname to check
 * @returns true if path is public, false if auth required
 */
export function isPublicPath(pathname: string): boolean {
  const normalizedPath = normalizePath(pathname);
  
  // Check exact matches first
  if (PUBLIC_ROUTE_PREFIXES.includes(normalizedPath)) {
    return true;
  }
  
  // Check prefix matches
  for (const prefix of PUBLIC_ROUTE_PREFIXES) {
    if (normalizedPath === prefix) {
      return true;
    }
    if (normalizedPath.startsWith(prefix + '/')) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if a path requires member authentication
 * EXPLICIT: Only /member and /dashboard areas are protected
 * @param pathname - The URL pathname to check
 * @returns true if path requires member auth
 */
export function isMemberProtectedPath(pathname: string): boolean {
  const normalizedPath = normalizePath(pathname);
  
  // EXPLICIT member protected prefixes (from actual router structure)
  const memberPrefixes = [
    '/member/',
    '/dashboard/',
  ];
  
  return memberPrefixes.some(prefix => normalizedPath.startsWith(prefix));
}

/**
 * Check if a path requires admin authentication
 * EXPLICIT: Only /admin area is protected
 * @param pathname - The URL pathname to check
 * @returns true if path requires admin auth
 */
export function isAdminProtectedPath(pathname: string): boolean {
  const normalizedPath = normalizePath(pathname);
  
  // EXPLICIT admin protected prefixes (from actual router structure)
  const adminPrefixes = [
    '/admin/',
  ];
  
  return adminPrefixes.some(prefix => normalizedPath.startsWith(prefix));
}

/**
 * Check if any authentication is required for a path
 * EXPLICIT: Only member/admin areas are protected, everything else is public
 * @param pathname - The URL pathname to check
 * @returns true if path requires any auth
 */
export function isProtectedPath(pathname: string): boolean {
  return isMemberProtectedPath(pathname) || isAdminProtectedPath(pathname);
}

// Dev-only regression check (minimal and safe)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  let lastPathname = window.location.pathname;
  
  const checkRegression = () => {
    const currentPathname = window.location.pathname;
    
    // If we're on a public page but got redirected through login
    if (isPublicPath(lastPathname) && currentPathname.includes('/login?returnTo=')) {
      console.error('🚨 REGRESSION: Public page redirected to login!', {
        publicPath: lastPathname,
        currentPath: currentPathname
      });
    }
    
    lastPathname = currentPathname;
  };
  
  // Check on route changes
  window.addEventListener('popstate', checkRegression);
  
  // Also check immediately
  setTimeout(checkRegression, 100);
}
