/**
 * Normalize proof URL to use correct bucket name
 * Handles legacy URLs that use old bucket name
 */

export function normalizeProofUrl(url?: string | null): string | null {
  if (!url) return null;
  
  // Legacy URL: replace old bucket name with new one
  if (url.includes("/invoice-proofs/")) {
    const normalized = url.replace("/invoice-proofs/", "/proofs/");
    console.warn('[STORAGE] Normalized legacy proof URL:', normalized);
    return normalized;
  }
  
  return url;
}
