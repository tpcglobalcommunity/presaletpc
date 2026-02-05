/**
 * Normalize proof URL to use correct bucket name
 * Handles legacy URLs that use old bucket name
 */

export function normalizeProofUrl(url?: string | null): string | null {
  if (!url) return null;
  
  // Legacy URL: replace proofs bucket with invoice-proofs
  if (url.includes("/proofs/")) {
    const normalized = url.replace("/proofs/", "/invoice-proofs/");
    console.warn('[STORAGE] Normalized legacy proof URL:', normalized);
    return normalized;
  }
  
  // Legacy URL: ensure invoice-proofs bucket is used
  if (url.includes("/invoice-proofs/")) {
    return url; // Already correct
  }
  
  // If URL doesn't contain expected bucket, log error
  console.error('[STORAGE] Invalid proof URL - no valid bucket found:', url);
  return null;
}
