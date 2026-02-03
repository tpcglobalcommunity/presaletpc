// Referral system types

export interface Referral {
  id: string;
  user_id: string;
  parent_user_id: string | null;
  level: number;
  created_at: string;
}

export interface ReferralStats {
  level: number;
  count: number;
  created_at: string;
}

export interface ReferralTreeStats {
  levels: {
    level1: number;
    level2: number;
    level3: number;
  };
  summary: {
    total_downline: number;
    active_downline: number;
    total_invoices: number;
  };
}

export interface AdminReferral {
  referral_id: string;
  user_email: string;
  user_referral_code: string;
  parent_email: string | null;
  parent_referral_code: string | null;
  level: number;
  created_at: string;
}
