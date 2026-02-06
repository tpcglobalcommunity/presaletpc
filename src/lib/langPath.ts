import { useParams } from 'react-router-dom';

type Lang = 'en' | 'id';

/**
 * Build canonical language-aware paths
 * Input: rawPath like "/market" or "market" 
 * Output: "/{lang}/{path}" with EXACTLY ONE lang prefix
 */
export function buildLangPath(lang: Lang, rawPath: string): string {
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
 * Hook to get current language and build paths
 */
export function useLangPath() {
  const params = useParams();
  const lang = ((params.lang as Lang) || 'en') as Lang;
  
  return {
    lang,
    buildPath: (rawPath: string) => buildLangPath(lang, rawPath)
  };
}

/**
 * Dev-only regression guard for duplicate language prefixes
 */
export function setupRegressionGuard() {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return;
  }

  const checkRegression = () => {
    const currentPathname = window.location.pathname;
    
    // Check for duplicate prefixes like /en/en/* or /id/id/*
    if (/^\/(en|id)\/\1(\/|$)/.test(currentPathname)) {
      console.error('🚨 REGRESSION: duplicate language prefix detected', {
        pathname: currentPathname,
        pattern: '/en/en/* or /id/id/*'
      });
    }
    
    // Check for malformed paths like /enenm or /idid*
    if (/^\/(en|id){2,}/.test(currentPathname)) {
      console.error('🚨 REGRESSION: malformed language prefix detected', {
        pathname: currentPathname,
        pattern: '/enen* or /idid*'
      });
    }
    
    // Check for missing slash after language like /enmarket
    if (/^\/(en|id)[a-z]/.test(currentPathname)) {
      console.error('🚨 REGRESSION: missing slash after language prefix', {
        pathname: currentPathname,
        pattern: '/enmarket or /idmarket'
      });
    }
  };

  // Check immediately and on route changes
  window.addEventListener('popstate', checkRegression);
  const timeoutId = window.setTimeout(checkRegression, 50);
  
  return () => {
    window.removeEventListener('popstate', checkRegression);
    window.clearTimeout(timeoutId);
  };
}
