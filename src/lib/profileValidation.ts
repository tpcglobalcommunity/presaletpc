/**
 * Profile validation utilities for onboarding gate
 */

export interface Profile {
  nama_lengkap?: string | null;
  email?: string | null;
  no_wa?: string | null;
  kota?: string | null;
  tpc_wallet_address?: string | null;
  wallet_address?: string | null;
  sponsor_code?: string | null;
  referred_by?: string | null;
  is_active?: boolean | null;
}

/**
 * Get canonical wallet field name
 */
export function getWalletFieldName(): 'tpc_wallet_address' | 'wallet_address' {
  // Prioritize tpc_wallet_address if it exists in schema
  return 'tpc_wallet_address';
}

/**
 * Check if user profile is complete for member area access
 */
export function isProfileComplete(profile: Profile | null | undefined): boolean {
  if (!profile) return false;

  const hasName = Boolean(profile.nama_lengkap && profile.nama_lengkap.trim().length > 0);
  const hasEmail = Boolean(profile.email && profile.email.trim().length > 0);
  const hasPhone = Boolean(profile.no_wa && profile.no_wa.trim().length > 0);
  const hasCity = Boolean(profile.kota && profile.kota.trim().length > 0);
  
  const walletField = getWalletFieldName();
  const wallet = profile[walletField];
  const hasValidWallet = Boolean(
    wallet && 
    wallet.trim().length >= 32 && 
    wallet.trim().length <= 44
  );

  return hasName && hasEmail && hasPhone && hasCity && hasValidWallet;
}

/**
 * Get missing fields for onboarding
 */
export function getMissingFields(profile: Profile | null | undefined): string[] {
  if (!profile) return ['nama_lengkap', 'email', 'no_wa', 'kota', 'tpc_wallet_address'];

  const missing: string[] = [];
  
  if (!profile.nama_lengkap || profile.nama_lengkap.trim().length === 0) missing.push('nama_lengkap');
  if (!profile.email || profile.email.trim().length === 0) missing.push('email');
  if (!profile.no_wa || profile.no_wa.trim().length === 0) missing.push('no_wa');
  if (!profile.kota || profile.kota.trim().length === 0) missing.push('kota');
  
  const walletField = getWalletFieldName();
  const wallet = profile[walletField];
  if (!wallet || wallet.trim().length < 32 || wallet.trim().length > 44) {
    missing.push(walletField);
  }

  return missing;
}

/**
 * Validate wallet address format (basic length check for soft launch)
 */
export function isValidWalletAddress(address: string | null | undefined): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return trimmed.length >= 32 && trimmed.length <= 44;
}

/**
 * Validate WhatsApp number (numeric with optional +, min 8 chars)
 */
export function isValidWhatsAppNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();
  if (trimmed.length < 8) return false;
  
  // Allow optional + at start, then only numbers
  const phoneRegex = /^\+?\d+$/;
  return phoneRegex.test(trimmed);
}
