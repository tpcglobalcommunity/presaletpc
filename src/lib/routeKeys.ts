export const ROUTE_KEYS = {
  // Public routes
  PUBLIC_HOME: 'home',
  PUBLIC_PRESALE: 'presale',
  PUBLIC_MARKET: 'market',
  PUBLIC_ACADEMY: 'academy',
  PUBLIC_TERMS: 'terms',
  PUBLIC_PRIVACY: 'privacy',
  PUBLIC_RISK: 'risk',
  PUBLIC_ANTI_SCAM: 'anti-scam',
  PUBLIC_LOGIN: 'login',
  
  // Member routes (keep existing)
  MEMBER_DASHBOARD: 'dashboard',
  MEMBER_INVOICES: 'invoices',
  MEMBER_WALLET: 'wallet',
  MEMBER_WITHDRAWAL: 'withdrawal',
  MEMBER_REFERRAL: 'referral',
  MEMBER_PROFILE: 'profile',
  
  // Admin routes (keep existing)
  ADMIN_DASHBOARD: 'admin-dashboard',
  ADMIN_INVOICES: 'admin-invoices',
  ADMIN_WITHDRAWALS: 'admin-withdrawals',
  ADMIN_USERS: 'admin-users',
} as const;
