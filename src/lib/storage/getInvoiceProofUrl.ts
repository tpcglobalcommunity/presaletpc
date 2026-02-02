import { supabase } from '@/integrations/supabase/client';
import { INVOICE_PROOF_BUCKET } from '@/config/storage';

/**
 * Get the public URL for an invoice proof
 * Handles both legacy full URLs and new path-only storage
 * 
 * @param proofValue - Either a full URL (legacy) or file path (new)
 * @returns Public URL string or null if invalid
 */
export function getInvoiceProofUrl(proofValue: string | null | undefined): string | null {
  if (!proofValue) return null;
  
  // Legacy: if it's already a full URL, return as-is
  if (proofValue.startsWith('http://') || proofValue.startsWith('https://')) {
    return proofValue;
  }
  
  // New: generate public URL from bucket path
  try {
    const { data } = supabase.storage
      .from(INVOICE_PROOF_BUCKET)
      .getPublicUrl(proofValue);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error generating proof URL:', error);
    return null;
  }
}

/**
 * Check if a proof URL is valid and accessible
 * 
 * @param proofValue - Either a full URL (legacy) or file path (new)
 * @returns Promise<boolean> - true if URL is accessible
 */
export async function isProofUrlAccessible(proofValue: string | null | undefined): Promise<boolean> {
  const url = getInvoiceProofUrl(proofValue);
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking proof URL accessibility:', error);
    return false;
  }
}

/**
 * Generate a unique file path for invoice proof upload
 * 
 * @param userId - User ID
 * @param invoiceId - Invoice ID
 * @param file - File object
 * @returns File path string
 */
export function generateProofFilePath(userId: string, invoiceId: string, file: File): string {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  return `proofs/${userId}/${invoiceId}-${timestamp}.${extension}`;
}
