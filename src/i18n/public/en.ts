/**
 * EN Public Copy - BASE (most complete)
 * This is the source of truth for all public translations
 * Legal-safe, educational content
 */

import { PublicCopy } from './schema';

export const publicEn: PublicCopy = {
  // Navigation
  nav: {
    presale: "Presale"
  },

  // Buy TPC
  buytpc: {
    rateFixedTitle: "Internal rate (fixed)",
    rateFixedValue: "1 USDC = Rp17,000",
    lockTitle: "TPC Purchases in Member Area",
    lockDesc: "For security and transparency, purchases are processed in Member Area. After login, you can create an invoice, upload proof, and track status.",
    lockCtaLogin: "Sign in / Register to Buy",
    lockCtaMember: "Open Member Area"
  },

  // Home Page
  home: {
    trustQuote: '"TPC does not promise any profits."',
    trustDesc: 'We are committed to full transparency. All transactions can be verified and our wallet addresses are public.',
    viewTransparency: 'View Transparency',
    antiScamNotice: 'Anti-Scam Notice',
    communityEducation: 'Community & Education',
    telegramCommunity: 'Telegram Community',
    telegramDesc: 'Join trader community'
  },

  // Tutorial Pages
  tutorial: {
    phantomWallet: {
      title: "Phantom Wallet Tutorial",
      subtitle: "Learn how to set up and use Phantom wallet",
      overview: "Complete guide to Phantom wallet for TPC transactions",
      features: {
        secure: "Secure & Non-custodial",
        easy: "Easy to Use",
        browser: "Browser Extension"
      },
      steps: {
        step1: "Install Phantom Wallet",
        step2: "Create or Import Wallet",
        step3: "Get SOL for Gas Fees",
        step4: "Add TPC to Wallet"
      },
      security: {
        title: "Security Best Practices",
        neverShare: "Never share your private key or seed phrase",
        officialOnly: "Only use official phantom.app",
        research: "Always verify URLs and double-check transactions"
      },
      cta: {
        buy: "Buy TPC Now",
        antiScam: "Anti-Scam Info"
      },
      disclaimer: {
        text: "This tutorial is for educational purposes only, not financial advice. Cryptocurrency investment carries high risk. Do your own research before investing."
      }
    }
  },

  // Anti-Scam
  antiScam: {
    title: "Anti-Scam Protection",
    subtitle: "Learn how to protect yourself from scams",
    description: "TPC will never ask for certain things. Learn to identify legitimate communications.",
    warning: "Always verify through official channels before taking any action.",
    tips: {
      title: "Safety Tips",
      verify: "Verify coordinator identity through official website",
      official: "Only trust coordinators listed on verified page",
      research: "Do your own research before investing"
    },
    cta: {
      back: "Back to Safety",
      report: "Report Suspicious Activity"
    }
  },

  // Chapters
  chapters: {
    meta: {
      title: "TPC Official Coordinators (Verified)",
      description: "List of officially verified TPC coordinators"
    },
    hero: {
      title: "TPC Official Coordinators (Verified)",
      subtitle: "Check here before trusting"
    },
    badges: {
      educationOnly: "Education-only, no profit/ROI",
      antiScam: "Anti-Scam",
      transparent: "Transparent"
    },
    sections: {
      orgStructure: {
        title: "Organization Structure",
        items: {
          chapterLead: "Chapter Lead",
          koordinator: "Coordinator", 
          moderator: "Moderator"
        }
      },
      roles: {
        title: "Coordinator Roles",
        items: {
          chapterLead: "Chapter Lead - Leads regional chapter",
          koordinator: "Coordinator - Regional coordinator",
          moderator: "Moderator - Community moderator"
        }
      },
      rules: {
        title: "Verification Rules",
        items: {
          noPrivateTransfer: "TPC never requests transfers to personal wallets",
          noSeedPhrase: "TPC never requests seed phrases/OTP/private keys",
          officialOnly: "Only coordinators listed on this page are official",
          noUnknown: "If name is not listed here → consider unofficial"
        }
      },
      inactive: {
        title: "Inactive Coordinators",
        description: "List of inactive coordinators"
      },
      chapterLead: {
        title: "Chapter Lead",
        description: "Leads regional chapter",
        antiScam: "Anti-Scam",
        transparency: "Transparent"
      }
    },
    cta: {
      primary: "View Wallet Transparency",
      secondary: "Read Anti-Scam Notice"
    },
    status: {
      active: "Active",
      inactive: "Inactive",
      unknown: "Unknown"
    },
    roles: {
      chapterLead: "Chapter Lead",
      koordinator: "Coordinator",
      moderator: "Moderator",
      unknown: "Unknown"
    },
    filters: {
      allCountries: "All Countries",
      allRoles: "All Roles", 
      allStatus: "All Status",
      searchPlaceholder: "Search name/username/city/country...",
      sortBy: "Sort by",
      sortOptions: {
        newest: "Newest Verified",
        name: "Name A-Z",
        region: "Region A-Z"
      }
    },
    actions: {
      back: "Back",
      report: "Report",
      copyUsername: "Copy username",
      copied: "Copied",
      joinLocalGroup: "Local Group",
      viewSocials: "View Social Media",
      revokeReason: "Inactive Reason"
    },
    footer: {
      title: "Stay Safe and Informed",
      description: "Always verify coordinator identity before trusting. TPC is an education platform, not an investment.",
      joinTelegram: "Join Official Telegram"
    }
  },

  // Market
  market: {
    title: "TPC Market",
    subtitle: "Educational resources and tools",
    description: "Access premium educational content and trading tools",
    products: {
      ebook: {
        title: "Ebook & Educational Materials",
        description: "Structured learning materials from basic to advanced",
        status: "Available",
        cta: "Learn More"
      },
      training: {
        title: "Trader Training",
        description: "Focus on skills, mindset, and consistent process",
        status: "Coming Soon",
        cta: "View Program"
      },
      tools: {
        title: "Supporting Software & Tools",
        description: "Analysis and utility tools for better trading",
        status: "Coming Soon",
        cta: "View Details"
      },
      advertising: {
        title: "Digital Advertising Services",
        description: "TikTok / YouTube / Instagram Ads for businesses",
        status: "Available",
        cta: "Info Services"
      },
      website: {
        title: "Professional Website Services",
        description: "Business & educational website development",
        status: "Available",
        cta: "View Details"
      },
      partnership: {
        title: "Business Partnerships",
        description: "Collaboration with real sector & conventional vendors",
        status: "Coming Soon",
        cta: "Learn More"
      }
    },
    cta: {
      explore: "Explore Products",
      getStarted: "Get Started"
    }
  },

  // Education
  education: {
    title: "TPC Education",
    subtitle: "Learn from basics to advanced",
    description: "Comprehensive educational materials for all skill levels",
    modules: {
      basic: "Basic Concepts",
      technical: "Technical Analysis",
      fundamental: "Fundamental Analysis",
      risk: "Risk Management"
    },
    cta: {
      start: "Start Learning",
      browse: "Browse Courses"
    }
  },

  // Transparency
  transparency: {
    title: "TPC Transparency",
    subtitle: "Full transparency in all operations",
    description: "All transactions and wallet addresses are publicly verifiable",
    sections: {
      wallet: "Wallet Addresses",
      transactions: "Transaction History",
      verification: "Verification Process"
    },
    cta: {
      viewWallet: "View Wallet",
      verifyTransaction: "Verify Transaction"
    }
  },

  // Verified Coordinators
  verifiedCoordinators: {
    title: "Verified Coordinators",
    subtitle: "Official TPC coordinators",
    description: "All coordinators are verified through official channels",
    search: {
      placeholder: "Search by name, username, city, or country...",
      noResults: "No coordinators found"
    },
    filters: {
      all: "All",
      active: "Active",
      inactive: "Inactive",
      verified: "Verified"
    },
    coordinator: {
      title: "Coordinator Information",
      status: {
        active: "Active",
        inactive: "Inactive",
        unverified: "Unverified"
      },
      actions: {
        verify: "Verify",
        report: "Report",
        copy: "Copy"
      }
    }
  },

  // Whitepaper
  whitepaper: {
    title: "TPC Whitepaper",
    subtitle: "Technical documentation and specifications",
    description: "Comprehensive technical details about TPC technology and vision",
    sections: {
      overview: "Overview",
      technology: "Technology",
      tokenomics: "Tokenomics",
      roadmap: "Roadmap",
      team: "Team"
    },
    cta: {
      download: "Download PDF",
      viewOnline: "Read Online"
    }
  },

  // DAO
  dao: {
    title: "TPC DAO",
    subtitle: "Decentralized governance",
    description: "Participate in community governance and decision-making",
    sections: {
      governance: "Governance",
      voting: "Voting System",
      proposals: "Proposals",
      treasury: "Treasury"
    },
    cta: {
      participate: "Participate",
      viewProposals: "View Proposals"
    }
  },

  // FAQ
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions",
    description: "Comprehensive FAQ covering all aspects of TPC",
    categories: {
      general: "General",
      technical: "Technical",
      security: "Security",
      financial: "Financial"
    },
    cta: {
      contact: "Contact Support",
      browse: "Browse All"
    }
  },

  // Terms
  terms: {
    title: "Terms & Conditions",
    subtitle: "Terms of service for TPC platform",
    lastUpdated: "Last updated: January 2024",
    sections: {
      introduction: "Introduction",
      services: "Services",
      responsibilities: "User Responsibilities",
      limitations: "Limitations",
      intellectualProperty: "Intellectual Property",
      privacy: "Privacy Policy",
      disclaimer: "Disclaimer"
    }
  },

  // Privacy
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we protect your data",
    lastUpdated: "Last updated: January 2024",
    sections: {
      dataCollection: "Data Collection",
      dataUsage: "Data Usage",
      dataProtection: "Data Protection",
      userRights: "User Rights",
      cookies: "Cookies",
      thirdParty: "Third-Party Services",
      contact: "Contact Information"
    }
  },

  // Login/Register
  auth: {
    login: {
      title: "Sign In",
      subtitle: "Welcome back to TPC",
      email: "Email",
      password: "Password",
      remember: "Remember me",
      forgot: "Forgot password?",
      submit: "Sign In",
      noAccount: "Don't have an account?",
      signUp: "Sign up"
    },
    register: {
      title: "Create Account",
      subtitle: "Join TPC community",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      agree: "I agree to the",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      submit: "Create Account",
      hasAccount: "Already have an account?",
      signIn: "Sign in"
    }
  },

  // Common UI
  ui: {
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    back: "Back",
    next: "Next",
    previous: "Previous",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    select: "Select",
    copy: "Copy",
    share: "Share",
    download: "Download",
    upload: "Upload",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    report: "Report",
    help: "Help",
    contact: "Contact",
    about: "About",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout"
  }
};
