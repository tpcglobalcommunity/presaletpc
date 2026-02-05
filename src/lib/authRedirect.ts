/**
 * Auth redirect utilities
 * Standardizes login URLs across the application
 */

/**
 * Build login URL with returnTo parameter
 * @param lang - Language code ('id' | 'en')
 * @param returnTo - Path to return to after login
 * @returns Complete login URL
 */
export function buildLoginUrl(lang: string, returnTo: string): string {
  const safeLang = lang === 'en' ? 'en' : 'id';
  const encodedReturnTo = encodeURIComponent(returnTo);
  return `/${safeLang}/login?returnTo=${encodedReturnTo}`;
}

/**
 * Navigate to login with returnTo
 * @param navigate - React Router navigate function
 * @param lang - Current language
 * @param returnTo - Path to return to after login
 */
export function navigateToLogin(
  navigate: (path: string, options?: any) => void,
  lang: string,
  returnTo: string
): void {
  const loginUrl = buildLoginUrl(lang, returnTo);
  navigate(loginUrl);
}
