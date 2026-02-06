// Translation getter with dev guards for chapters
import { chaptersId } from './id/chapters';
import { chaptersEn } from './en/chapters';

type Language = 'en' | 'id';
type ChaptersTranslations = typeof chaptersId;

export function getChaptersTranslations(lang: Language): ChaptersTranslations {
  // Dev-only key parity check
  if (process.env.NODE_ENV === 'development') {
    const idKeys = Object.keys(chaptersId).sort();
    const enKeys = Object.keys(chaptersEn).sort();
    
    // Check for missing keys in EN
    const missingInEn = idKeys.filter(key => !(key in chaptersEn));
    if (missingInEn.length > 0) {
      console.error('🚨 MISSING EN KEYS (chapters):', missingInEn);
    }
    
    // Check for extra keys in EN
    const extraInEn = enKeys.filter(key => !(key in chaptersId));
    if (extraInEn.length > 0) {
      console.error('🚨 EXTRA EN KEYS (chapters):', extraInEn);
    }
    
    // Check for missing keys in ID
    const missingInId = enKeys.filter(key => !(key in chaptersId));
    if (missingInId.length > 0) {
      console.error('🚨 MISSING ID KEYS (chapters):', missingInId);
    }
    
    // Fail loudly in dev if critical keys mismatch
    const criticalKeys = ['meta', 'hero', 'status', 'roles', 'filters'];
    const criticalMissing = criticalKeys.filter(key => !(key in (lang === 'en' ? chaptersEn : chaptersId)));
    if (criticalMissing.length > 0) {
      throw new Error(`🚨 CRITICAL: Missing keys in ${lang.toUpperCase()} chapters: ${criticalMissing.join(', ')}`);
    }
  }
  
  // Return appropriate dictionary
  if (lang === 'en') {
    return chaptersEn as ChaptersTranslations;
  }
  
  return chaptersId;
}

// Safe translation getter with fallback
export function tChapters(lang: Language, key: string, fallback?: string): string {
  const translations = getChaptersTranslations(lang);
  const value = getNestedValue(translations, key);
  
  if (value !== undefined) {
    return value;
  }
  
  // Dev-only: show missing key marker
  if (process.env.NODE_ENV === 'development') {
    return `[MISSING:${key}]`;
  }
  
  // Production: return safe fallback or empty string
  return fallback || '';
}

// Helper to get nested object values by key path
function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((current, keyPart) => {
    return current && current[keyPart] !== undefined ? current[keyPart] : undefined;
  }, obj);
}
