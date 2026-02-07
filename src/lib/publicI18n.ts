import { useState, useEffect } from 'react';
import { Lang } from '@/lib/publicPath';

// Public i18n loader for TPC Global
export class PublicI18n {
  private static cache: Record<string, Record<string, any>> = {};

  static async loadTranslations(lang: Lang): Promise<Record<string, any>> {
    if (this.cache[lang]) {
      return this.cache[lang];
    }

    try {
      // Dynamic import based on language
      const translations = await import(`@/i18n/public/${lang}/common.json`);
      this.cache[lang] = translations.default;
      return translations.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${lang}, falling back to en`);
      
      // Fallback to English
      try {
        const fallback = await import(`@/i18n/public/en/common.json`);
        this.cache[lang] = fallback.default;
        return fallback.default;
      } catch (fallbackError) {
        console.error('Failed to load fallback translations');
        return {};
      }
    }
  }

  static getTranslation(translations: Record<string, any>, key: string): string {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  // Development-time key checker
  static async checkKeyConsistency(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    try {
      const [enTranslations, idTranslations] = await Promise.all([
        this.loadTranslations('en'),
        this.loadTranslations('id')
      ]);

      const enKeys = this.extractKeys(enTranslations);
      const idKeys = this.extractKeys(idTranslations);

      const missingInId = enKeys.filter(key => !idKeys.includes(key));
      const missingInEn = idKeys.filter(key => !enKeys.includes(key));

      if (missingInId.length > 0) {
        console.warn('Missing keys in ID translations:', missingInId);
      }

      if (missingInEn.length > 0) {
        console.warn('Missing keys in EN translations:', missingInEn);
      }

      if (missingInId.length === 0 && missingInEn.length === 0) {
        console.log('✅ Translation keys are consistent between EN and ID');
      }
    } catch (error) {
      console.error('Failed to check translation consistency:', error);
    }
  }

  private static extractKeys(obj: any, prefix = ''): string[] {
    const keys: string[] = [];
    
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(...this.extractKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }
}

// Hook for components to use public i18n
export function usePublicI18n(lang: Lang) {
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PublicI18n.loadTranslations(lang)
      .then(setTranslations)
      .finally(() => setLoading(false));

    // Check consistency in development
    if (process.env.NODE_ENV === 'development') {
      PublicI18n.checkKeyConsistency();
    }
  }, [lang]);

  const t = (key: string) => {
    return PublicI18n.getTranslation(translations, key);
  };

  return { t, loading };
}
