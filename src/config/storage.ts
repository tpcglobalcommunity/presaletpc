// Storage bucket configuration for TPC Global payment proofs
export const PROOF_BUCKET = "invoice-proofs" as const;

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
 * 1. Bucket: "invoice-proofs" (PUBLIC - created for payment proofs)
 * 2. File path structure:
 *    - invoice-proofs/{user_id}/{invoice_id}/{timestamp}-{filename}
 *    - Example: invoice-proofs/550e8400-e29b-41d4-a716-446655440000/inv-12345/1701234567890-payment.jpg
 * 3. Database storage:
 *    - Column: proof_url (stores PATH only, not full URL)
 *    - Example: "550e8400-e29b-41d4-a716-446655440000/inv-12345/1701234567890-payment.jpg"
 */
