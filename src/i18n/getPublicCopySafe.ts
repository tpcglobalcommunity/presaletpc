// Safe public copy getter with deep fallback
import { chaptersId } from './id/chapters';
import { chaptersEn } from './en/chapters';

type Language = 'en' | 'id';
type ChaptersTranslations = typeof chaptersId;

/**
 * Deep merge fallback - fills missing keys from fallback into primary
 */
function deepMergeFallback(primary: any, fallback: any): any {
  if (!primary || typeof primary !== 'object') return fallback || {};
  if (!fallback || typeof fallback !== 'object') return primary || {};
  
  const result = { ...primary };
  
  for (const key in fallback) {
    if (!(key in primary)) {
      result[key] = fallback[key];
    } else if (typeof fallback[key] === 'object' && typeof primary[key] === 'object') {
      result[key] = deepMergeFallback(primary[key], fallback[key]);
    }
  }
  
  return result;
}

/**
 * Get safe public copy with guaranteed shape
 * - Always returns complete object
 * - Falls back to EN for missing ID keys
 * - Never returns undefined
 */
export function getPublicCopySafe(lang: Language): ChaptersTranslations {
  // Ensure both dictionaries have the same structure
  const mergedId = deepMergeFallback(chaptersId, chaptersEn);
  const mergedEn = chaptersEn; // EN is source of truth
  
  return lang === 'id' ? mergedId : mergedEn;
}

/**
 * Development-only shape validation
 */
export function validatePublicCopyShape(copy: any): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const requiredPaths = [
    'sections.orgStructure.chapterLead.antiScam',
    'sections.orgStructure.chapterLead.transparency',
    'badges.antiScam',
    'badges.transparent',
    'meta.title',
    'hero.title'
  ];
  
  for (const path of requiredPaths) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], copy);
    if (value === undefined) {
      console.error(`🚨 MISSING REQUIRED KEY: ${path}`);
    }
  }
}
