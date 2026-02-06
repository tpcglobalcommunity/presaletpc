type Lang = 'en' | 'id';

/**
 * Strict allowlist of all allowed public raw paths
 * These are the ONLY public paths that should be accessible
 */
export const PUBLIC_RAW_PATHS = new Set([
  '/',
  '/presale',
  '/buytpc',
  '/transparency',
  '/anti-scam',
  '/verified-coordinators',
  '/chapters',
  '/education',
  '/whitepaper',
  '/dao',
  '/faq',
  '/terms',
  '/privacy',
  '/tutorial/phantom-wallet',
  '/login',
  '/register',
  '/reset-password',
  '/404'
]);

/**
 * Normalize malformed public pathnames and extract language info
 * 
 * @param pathname - Current window pathname
 * @returns Normalized result with lang, rawPath, and canonical URL
 */
export function normalizePublicPathname(pathname: string): {
  lang: Lang;
  rawPath: string;
  canonical: string;
} {
  // Extract language from pathname
  const langMatch = pathname.match(/^\/(en|id)(?:\/|$)/);
  const lang = (langMatch?.[1] || 'en') as Lang;
  
  // Remove language prefix to get raw path
  let rawPath = pathname.replace(/^\/(en|id)(?=\/|$)/, '');
  if (rawPath === '') rawPath = '/';
  
  // Fix malformed paths
  // /enmarket -> /en/market
  // /enpresale -> /en/presale
  // /idmarket -> /id/market
  const malformedMatch = rawPath.match(/^\/?(en|id)([a-z])/);
  if (malformedMatch) {
    const [, detectedLang, rest] = malformedMatch;
    if (detectedLang === lang) {
      rawPath = `/${rest}`;
    }
  }
  
  // Remove duplicate language prefixes
  // /en/en/market -> /en/market
  // /id/id/market -> /id/market
  rawPath = rawPath.replace(new RegExp(`^/${lang}/${lang}`), `/${lang}`);
  
  // Ensure rawPath starts with "/"
  if (!rawPath.startsWith('/')) {
    rawPath = `/${rawPath}`;
  }
  
  // Build canonical URL
  const canonical = `/${lang}${rawPath}`;
  
  return { lang, rawPath, canonical };
}

/**
 * Check if a raw path is in the public allowlist
 * 
 * @param rawPath - Raw path without language prefix
 * @returns True if path is allowed for public access
 */
export function isAllowedPublicRawPath(rawPath: string): boolean {
  // Ensure rawPath starts with "/"
  const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return PUBLIC_RAW_PATHS.has(normalizedPath);
}

/**
 * Get the canonical public path for a given raw path
 * 
 * @param lang - Current language
 * @param rawPath - Raw path
 * @returns Canonical public path
 */
export function getCanonicalPublicPath(lang: Lang, rawPath: string): string {
  const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return `/${lang}${normalizedPath}`;
}

/**
 * Dev-only regression safety checks
 */
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const checkRegression = () => {
    const pathname = window.location.pathname;
    
    // Check for duplicate language prefixes
    if (/^\/(en|id)\/\1(\/|$)/.test(pathname)) {
      console.error('🚨 REGRESSION: duplicate language prefix detected', {
        pathname,
        pattern: '/en/en/* or /id/id/*'
      });
    }
    
    // Check for malformed paths like /enenm or /idid*
    if (/^\/(en|id){2,}/.test(pathname)) {
      console.error('🚨 REGRESSION: malformed language prefix detected', {
        pathname,
        pattern: '/enen* or /idid*'
      });
    }
    
    // Check for missing slash after language
    if (/^\/(en|id)[a-z]/.test(pathname)) {
      console.error('🚨 REGRESSION: missing slash after language prefix', {
        pathname,
        pattern: '/enmarket or /idmarket'
      });
    }
  };
  
  // Check immediately and on route changes
  window.addEventListener('popstate', checkRegression);
  setTimeout(checkRegression, 50);
}
