// Referral system types

export interface SimpleReferralStats {
  total_downline: number;
}

export interface Referral {
  user_id: string;
  display_name: string;
  email: string;
  joined_at: string;
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
