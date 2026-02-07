export type Lang = 'en' | 'id';

/**
 * Canonical public path builder for TPC Global public pages
 * 
 * @param lang - Current language ('en' | 'id')
 * @param rawPath - Raw path like "/market" or "market"
 * @returns Canonical path with exactly one language prefix
 * 
 * Examples:
 * publicPath('en', '/market') -> '/en/market'
 * publicPath('id', 'market') -> '/id/market'
 * publicPath('en', '/en/market') -> '/en/market' (deduped)
 * publicPath('id', '/') -> '/id/'
 */
export function publicPath(lang: Lang, rawPath: string): string {
  // Normalize input
  let path = (rawPath || '').trim();
  
  // Ensure path starts with "/"
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  
  // Remove existing language prefix if present
  path = path.replace(/^\/(en|id)(?=\/|$)/, '');
  
  // Handle root case
  if (path === '') {
    path = '/';
  }
  
  // Build final path with exactly one language prefix
  return `/${lang}${path}`;
}

/**
 * Normalize public pathname to prevent duplicate language prefixes
 * 
 * @param pathname - Current pathname from location
 * @returns Normalized pathname
 * 
 * Examples:
 * normalizePublicPath('/') -> '/en'
 * normalizePublicPath('/en/en/market') -> '/en/market'
 * normalizePublicPath('/id/id/market') -> '/id/market'
 * normalizePublicPath('/terms') -> '/en/terms'
 * normalizePublicPath('/member/dashboard') -> '/member/dashboard' (unchanged)
 */
export function normalizePublicPath(pathname: string): string {
  // Root path -> default to EN
  if (pathname === '/') {
    return '/en';
  }

  // Deduplicate language prefixes
  if (pathname.startsWith('/en/')) {
    const rest = pathname.slice(4); // Remove '/en/'
    if (rest.startsWith('en/')) {
      return `/en/${rest.slice(3)}`; // Remove duplicate 'en/'
    }
    return pathname;
  }

  if (pathname.startsWith('/id/')) {
    const rest = pathname.slice(4); // Remove '/id/'
    if (rest.startsWith('id/')) {
      return `/id/${rest.slice(3)}`; // Remove duplicate 'id/'
    }
    return pathname;
  }

  // Keep member/admin routes unchanged
  if (pathname.startsWith('/member') || pathname.startsWith('/admin')) {
    return pathname;
  }

  // Unknown segment -> treat as public and redirect to EN
  if (pathname.startsWith('/')) {
    return `/en${pathname}`;
  }

  return `/en${pathname}`;
}

/**
 * Hook for components to get current language and build public paths
 */
export function usePublicPath() {
  // For public components, we'll get lang from URL params
  // This hook should be used within the /:lang route context
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const langMatch = pathname.match(/^\/(en|id)(?:\/|$)/);
    const lang = (langMatch?.[1] || 'en') as Lang;
    
    return {
      lang,
      buildPath: (rawPath: string) => publicPath(lang, rawPath)
    };
  }
  
  // Fallback for SSR
  return {
    lang: 'en' as Lang,
    buildPath: (rawPath: string) => publicPath('en', rawPath)
  };
}
