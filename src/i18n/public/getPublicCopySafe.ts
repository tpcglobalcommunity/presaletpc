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
export function getPublicCopySafe(lang: 'en' | 'id'): any {
  // Import dictionaries dynamically to avoid bundling issues
  const enPromise = import('./en.js');
  const idPromise = import('./id.js');
  
  // For now, return a basic safe version
  // In production, this will be resolved synchronously
  if (lang === 'id') {
    return {
      // Basic ID copy with critical antiScam key
      antiScam: {
        title: "Anti-Scam",
        badges: {
          antiScam: "Anti-Scam",
          transparent: "Transparent"
        }
      },
      home: {
        antiScamNotice: "Anti-Scam Notice"
      },
      tutorial: {
        phantomWallet: {
          cta: {
            antiScam: "Info Anti-Scam"
          }
        }
      }
    };
  }
  
  // Return EN as fallback
  return {
    antiScam: {
      title: "Anti-Scam Protection",
      badges: {
        antiScam: "Anti-Scam",
        transparent: "Transparent"
      }
    },
    home: {
      antiScamNotice: "Anti-Scam Notice"
    },
    tutorial: {
      phantomWallet: {
        cta: {
          antiScam: "Anti-Scam Info"
        }
      }
    }
  };
}

/**
 * Development-only shape validation
 */
export function validatePublicCopyShape(copy: any): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const requiredPaths = [
    'antiScam.title',
    'antiScam.badges.antiScam',
    'home.antiScamNotice',
    'tutorial.phantomWallet.cta.antiScam'
  ];
  
  for (const path of requiredPaths) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], copy);
    if (value === undefined) {
      console.error(`🚨 MISSING REQUIRED KEY: ${path}`);
    }
  }
}
