// Storage bucket configuration for TPC Global payment proofs
export const PROOF_BUCKET = "proofs" as const;

/**
 * Check if a string is a valid HTTP/HTTPS URL
 */
export function isHttpUrl(v?: string | null): boolean {
  if (!v) return false;
  return /^https?:\/\//i.test(v);
}

/*
 * Storage Setup Notes:
 * 
 * 1. Bucket: "proofs" (PUBLIC - already exists)
 * 2. File path structure:
 *    - invoices/{invoiceId}/{userId}-{timestamp}.{ext}
 *    - Example: invoices/inv-12345/550e8400-e29b-41d4-a716-446655440000-1701234567890.jpg
 * 3. Database storage:
 *    - Column: proof_url (stores PATH only, not full URL)
 *    - Example: "invoices/inv-12345/550e8400-e29b-41d4-a716-446655440000-1701234567890.jpg"
 */
