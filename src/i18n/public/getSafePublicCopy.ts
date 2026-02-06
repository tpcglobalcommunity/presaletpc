/**
 * Simple safe copy getter to prevent undefined crashes
 * Focus on antiScam and other critical keys
 */

// Basic safe copy with guaranteed antiScam key
const safeCopy = {
  en: {
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
  },
  id: {
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
  }
};

/**
 * Get safe copy with guaranteed antiScam key
 */
export function getSafePublicCopy(lang: 'en' | 'id') {
  return safeCopy[lang] || safeCopy.en;
}
