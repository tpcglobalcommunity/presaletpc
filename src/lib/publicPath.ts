// Public path builder - prevents duplicate language prefixes
export function publicPath(lang: 'id' | 'en', path: string): string {
  // Normalize path - remove leading slash and any existing language prefix
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove any existing language prefix to prevent duplication
  const withoutLangPrefix = cleanPath.replace(/^(id|en)\//, '');
  
  return `/${lang}/${withoutLangPrefix}`;
}

// Helper to check if a path already has language prefix
export function hasLanguagePrefix(path: string): boolean {
  return /^(id|en)\//.test(path);
}
