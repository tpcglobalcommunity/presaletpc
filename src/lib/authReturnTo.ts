/**
 * AUTH RETURN TO HELPER
 * 
 * Implements strict rules for returnTo handling:
 * 1) PUBLIC_NAV_LOGIN: Use current path as returnTo
 * 2) GATED_ACTION_LOGIN: Use explicit target override
 * 3) SAFE FALLBACK: Dashboard by language
 */

/**
 * Sanitize and validate returnTo path
 * - Must be internal path starting with /id/ or /en/
 * - Block external URLs and malformed paths
 */
export function sanitizeReturnTo(raw: string | null): string | null {
  if (!raw || typeof raw !== 'string') return null;

  // Remove leading/trailing whitespace
  const clean = raw.trim();
  
  // Must start with /id/ or /en/
  if (!clean.startsWith('/id/') && !clean.startsWith('/en/')) {
    return null;
  }

  // Must be reasonable length (prevent abuse)
  if (clean.length > 500) {
    return null;
  }

  // Basic path validation (no double slashes, no null bytes)
  if (clean.includes('//') || clean.includes('\0')) {
    return null;
  }

  return clean;
}

/**
 * Get current path for PUBLIC_NAV_LOGIN
 * Returns full current location (pathname + search + hash)
 */
export function getCurrentPathReturnTo(): string {
  if (typeof window === 'undefined') return '/id/dashboard/member';
  
  const { pathname, search, hash } = window.location;
  return pathname + search + hash;
}

/**
 * Build login URL with returnTo parameter
 */
export function buildLoginUrl(lang: string, returnTo?: string): string {
  const safeLang = lang === 'en' ? 'en' : 'id';
  
  if (returnTo) {
    const sanitized = sanitizeReturnTo(returnTo);
    if (sanitized) {
      return `/${safeLang}/login?returnTo=${encodeURIComponent(sanitized)}`;
    }
  }
  
  // Fallback without returnTo
  return `/${safeLang}/login`;
}

/**
 * Navigate to login with returnTo
 */
export function navigateToLogin(
  navigate: (path: string, options?: any) => void,
  lang: string,
  returnTo?: string
): void {
  const loginUrl = buildLoginUrl(lang, returnTo);
  navigate(loginUrl);
}

/**
 * Get safe fallback returnTo based on language
 */
export function getFallbackReturnTo(lang: string): string {
  const safeLang = lang === 'en' ? 'en' : 'id';
  return `/${safeLang}/member/dashboard`;
}

/**
 * Determine if current path is a public page (valid for returnTo)
 */
export function isPublicPage(path: string): boolean {
  const publicPaths = [
    '/id/syarat-ketentuan',
    '/id/privacy', 
    '/id/anti-scam',
    '/id/transparansi',
    '/id/verified',
    '/id/dao',
    '/id/edukasi',
    '/id/faq',
    '/id/whitepaper',
    '/id/market',
    '/id/presale',
    '/en/verified-coordinators',
    '/en/chapters',
    '/en/privacy',
    '/en/anti-scam',
    '/en/transparency',
    '/en/verified',
    '/en/dao',
    '/en/education',
    '/en/faq',
    '/en/whitepaper',
    '/en/market',
    '/en/presale'
  ];
  
  return publicPaths.some(publicPath => path.startsWith(publicPath));
}

/**
 * PUBLIC_NAV_LOGIN: Use current path for generic login navigation
 */
export function handlePublicNavLogin(
  navigate: (path: string, options?: any) => void,
  lang: string
): void {
  const currentPath = getCurrentPathReturnTo();
  navigateToLogin(navigate, lang, currentPath);
}

/**
 * GATED_ACTION_LOGIN: Use explicit target for protected actions
 */
export function handleGatedActionLogin(
  navigate: (path: string, options?: any) => void,
  lang: string,
  targetPath: string
): void {
  navigateToLogin(navigate, lang, targetPath);
}
