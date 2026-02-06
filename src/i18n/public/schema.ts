/**
 * Public Copy Schema - Type definition for all public page translations
 * This is the single source of truth for public i18n structure
 */

export interface PublicCopy {
  // Navigation
  nav: {
    presale: string;
  };

  // Buy TPC
  buytpc: {
    rateFixedTitle: string;
    rateFixedValue: string;
    lockTitle: string;
    lockDesc: string;
    lockCtaLogin: string;
    lockCtaMember: string;
  };

  // Home Page
  home: {
    trustQuote: string;
    trustDesc: string;
    viewTransparency: string;
    antiScamNotice: string;
    communityEducation: string;
    telegramCommunity: string;
    telegramDesc: string;
  };

  // Tutorial Pages
  tutorial: {
    phantomWallet: {
      title: string;
      subtitle: string;
      overview: string;
      features: {
        secure: string;
        easy: string;
        browser: string;
      };
      steps: {
        step1: string;
        step2: string;
        step3: string;
        step4: string;
      };
      security: {
        title: string;
        neverShare: string;
        officialOnly: string;
        research: string;
      };
      cta: {
        buy: string;
        antiScam: string;
      };
      disclaimer: {
        text: string;
      };
    };
  };

  // Anti-Scam
  antiScam: {
    title: string;
    subtitle: string;
    description: string;
    warning: string;
    tips: {
      title: string;
      verify: string;
      official: string;
      research: string;
    };
    cta: {
      back: string;
      report: string;
    };
  };

  // Chapters
  chapters: {
    meta: {
      title: string;
      description: string;
    };
    hero: {
      title: string;
      subtitle: string;
    };
    badges: {
      educationOnly: string;
      antiScam: string;
      transparent: string;
    };
    sections: {
      orgStructure: {
        title: string;
        items: {
          chapterLead: string;
          koordinator: string;
          moderator: string;
        };
      };
      roles: {
        title: string;
        items: {
          chapterLead: string;
          koordinator: string;
          moderator: string;
        };
      };
      rules: {
        title: string;
        items: {
          noPrivateTransfer: string;
          noSeedPhrase: string;
          officialOnly: string;
          noUnknown: string;
        };
      };
      inactive: {
        title: string;
        description: string;
      };
      chapterLead: {
        title: string;
        description: string;
        antiScam: string;
        transparency: string;
      };
    };
    cta: {
      primary: string;
      secondary: string;
    };
    status: {
      active: string;
      inactive: string;
      unknown: string;
    };
    roles: {
      chapterLead: string;
      koordinator: string;
      moderator: string;
      unknown: string;
    };
    filters: {
      allCountries: string;
      allRoles: string;
      allStatus: string;
      searchPlaceholder: string;
      sortBy: string;
      sortOptions: {
        newest: string;
        name: string;
        region: string;
      };
    };
    actions: {
      back: string;
      report: string;
      copyUsername: string;
      copied: string;
      joinLocalGroup: string;
      viewSocials: string;
      revokeReason: string;
    };
    footer: {
      title: string;
      description: string;
      joinTelegram: string;
    };
  };

  // Market
  market: {
    title: string;
    subtitle: string;
    description: string;
    products: {
      ebook: {
        title: string;
        description: string;
        status: string;
        cta: string;
      };
      training: {
        title: string;
        description: string;
        status: string;
        cta: string;
      };
      tools: {
        title: string;
        description: string;
        status: string;
        cta: string;
      };
      advertising: {
        title: string;
        description: string;
        status: string;
        cta: string;
      };
      website: {
        title: string;
        description: string;
        status: string;
        cta: string;
      };
      partnership: {
        title: string;
        description: string;
        status: string;
        cta: string;
      };
    };
    cta: {
      explore: string;
      getStarted: string;
    };
  };

  // Education
  education: {
    title: string;
    subtitle: string;
    description: string;
    modules: {
      basic: string;
      technical: string;
      fundamental: string;
      risk: string;
    };
    cta: {
      start: string;
      browse: string;
    };
  };

  // Transparency
  transparency: {
    title: string;
    subtitle: string;
    description: string;
    sections: {
      wallet: string;
      transactions: string;
      verification: string;
    };
    cta: {
      viewWallet: string;
      verifyTransaction: string;
    };
  };

  // Verified Coordinators
  verifiedCoordinators: {
    title: string;
    subtitle: string;
    description: string;
    search: {
      placeholder: string;
      noResults: string;
    };
    filters: {
      all: string;
      active: string;
      inactive: string;
      verified: string;
    };
    coordinator: {
      title: string;
      status: {
        active: string;
        inactive: string;
        unverified: string;
      };
      actions: {
        verify: string;
        report: string;
        copy: string;
      };
    };
  };

  // Whitepaper
  whitepaper: {
    title: string;
    subtitle: string;
    description: string;
    sections: {
      overview: string;
      technology: string;
      tokenomics: string;
      roadmap: string;
      team: string;
    };
    cta: {
      download: string;
      viewOnline: string;
    };
  };

  // DAO
  dao: {
    title: string;
    subtitle: string;
    description: string;
    sections: {
      governance: string;
      voting: string;
      proposals: string;
      treasury: string;
    };
    cta: {
      participate: string;
      viewProposals: string;
    };
  };

  // FAQ
  faq: {
    title: string;
    subtitle: string;
    description: string;
    categories: {
      general: string;
      technical: string;
      security: string;
      financial: string;
    };
    cta: {
      contact: string;
      browse: string;
    };
  };

  // Terms
  terms: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    sections: {
      introduction: string;
      services: string;
      responsibilities: string;
      limitations: string;
      intellectualProperty: string;
      privacy: string;
      disclaimer: string;
    };
  };

  // Privacy
  privacy: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    sections: {
      dataCollection: string;
      dataUsage: string;
      dataProtection: string;
      userRights: string;
      cookies: string;
      thirdParty: string;
      contact: string;
    };
  };

  // Login/Register
  auth: {
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      remember: string;
      forgot: string;
      submit: string;
      noAccount: string;
      signUp: string;
    };
    register: {
      title: string;
      subtitle: string;
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
      agree: string;
      terms: string;
      privacy: string;
      submit: string;
      hasAccount: string;
      signIn: string;
    };
  };

  // Common UI
  ui: {
    loading: string;
    error: string;
    retry: string;
    back: string;
    next: string;
    previous: string;
    save: string;
    cancel: string;
    confirm: string;
    close: string;
    search: string;
    filter: string;
    sort: string;
    select: string;
    copy: string;
    share: string;
    download: string;
    upload: string;
    view: string;
    edit: string;
    delete: string;
    report: string;
    help: string;
    contact: string;
    about: string;
    settings: string;
    profile: string;
    logout: string;
  };
}
