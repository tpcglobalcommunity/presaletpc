/**
 * Lightweight validators for TPC Global
 */

// Solana / Base58 address validator (lightweight)
export function isValidSolanaAddress(addr: string): boolean {
  const a = addr.trim();
  if (a.length < 32 || a.length > 44) return false;

  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(a);
}
