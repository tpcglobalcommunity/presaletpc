import { supabase } from '@/integrations/supabase/client';
import { PROOF_BUCKET } from '@/config/storage';

/**
 * Get public URL for an invoice proof
 * Validates URL is from correct bucket before returning
 * 
 * @param proofValue - Either a full URL (legacy) or file path (new)
 * @returns Public URL string or null if invalid
 */
export function getInvoiceProofUrl(proofValue: string | null | undefined): string | null {
  if (!proofValue) return null;
  
  // Legacy: if it's already a full URL, validate it's from correct bucket
  if (proofValue.startsWith('http://') || proofValue.startsWith('https://')) {
    // Backend safety: ensure URL is from invoice-proofs bucket
    if (proofValue.includes('/storage/v1/object/public/invoice-proofs/')) {
      return proofValue;
    }
    console.error('[STORAGE] Invalid proof URL - not from invoice-proofs bucket:', proofValue);
    return null;
  }
  
  // New: generate public URL from bucket path
  try {
    const { data } = supabase.storage
      .from(PROOF_BUCKET)
      .getPublicUrl(proofValue);
    
    const publicUrl = data.publicUrl;
    
    // Backend safety: validate generated URL
    if (!publicUrl || !publicUrl.includes('/storage/v1/object/public/invoice-proofs/')) {
      console.error('[STORAGE] Generated invalid proof URL:', publicUrl);
      return null;
    }
    
    return publicUrl;
  } catch (error) {
    console.error('[STORAGE] Error generating proof URL:', error);
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
 * Structure: invoice-proofs/{user_id}/{invoice_id}/{timestamp}-{filename}
 * 
 * @param userId - User ID
 * @param invoiceId - Invoice ID
 * @param file - File object
 * @returns File path string
 */
export function generateProofFilePath(userId: string, invoiceId: string, file: File): string {
  const timestamp = Date.now();
  return `${userId}/${invoiceId}/${timestamp}-${file.name}`;
}
