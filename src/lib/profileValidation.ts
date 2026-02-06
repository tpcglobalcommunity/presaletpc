/**
 * Profile validation utilities for onboarding gate
 */

export interface Profile {
  nama?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  wallet_address?: string | null;
}

/**
 * Check if user profile is complete for member area access
 */
export function isProfileComplete(profile: Profile | null | undefined): boolean {
  if (!profile) return false;

  const hasName = Boolean(profile.nama && profile.nama.trim().length > 0);
  const hasEmail = Boolean(profile.email && profile.email.trim().length > 0);
  const hasPhone = Boolean(profile.phone && profile.phone.trim().length > 0);
  const hasCity = Boolean(profile.city && profile.city.trim().length > 0);
  const hasValidWallet = Boolean(
    profile.wallet_address && 
    profile.wallet_address.trim().length >= 32 && 
    profile.wallet_address.trim().length <= 44
  );

  return hasName && hasEmail && hasPhone && hasCity && hasValidWallet;
}

/**
 * Get missing fields for onboarding
 */
export function getMissingFields(profile: Profile | null | undefined): string[] {
  if (!profile) return ['nama', 'email', 'phone', 'city', 'wallet_address'];

  const missing: string[] = [];
  
  if (!profile.nama || profile.nama.trim().length === 0) missing.push('nama');
  if (!profile.email || profile.email.trim().length === 0) missing.push('email');
  if (!profile.phone || profile.phone.trim().length === 0) missing.push('phone');
  if (!profile.city || profile.city.trim().length === 0) missing.push('city');
  if (!profile.wallet_address || profile.wallet_address.trim().length < 32 || profile.wallet_address.trim().length > 44) {
    missing.push('wallet_address');
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
