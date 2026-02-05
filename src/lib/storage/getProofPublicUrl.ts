import { supabase } from '@/integrations/supabase/client';
import { PROOF_BUCKET, isHttpUrl } from '@/config/storage';
import { normalizeProofUrl } from '@/lib/normalizeProofUrl';

/**
 * Get the public URL for an invoice proof
 * Handles both legacy full URLs and new path-only storage
 * 
 * @param proofUrl - Either a full URL (legacy) or file path (new)
 * @returns Public URL string or null if invalid
 */
export function getProofPublicUrl(proofUrl: string | null | undefined): string | null {
  if (!proofUrl) return null;
  
  // Legacy: if it's already a full URL, normalize it
  if (isHttpUrl(proofUrl)) {
    const normalizedUrl = normalizeProofUrl(proofUrl);
    
    // Backend safety: ensure URL is from proofs bucket
    if (normalizedUrl?.includes('/storage/v1/object/public/proofs/')) {
      return normalizedUrl;
    }
    
    console.error('[STORAGE] Invalid proof URL - not from proofs bucket:', proofUrl);
    return null;
  }
  
  // New: generate public URL from bucket path (no normalization needed)
  try {
    const { data } = supabase.storage
      .from(PROOF_BUCKET)
      .getPublicUrl(proofUrl);
    
    const publicUrl = data.publicUrl;
    
    // Backend safety: validate generated URL
    if (!publicUrl || !publicUrl.includes('/storage/v1/object/public/proofs/')) {
      console.error('[STORAGE] Generated invalid proof URL:', publicUrl);
      return null;
    }
    
    return publicUrl;
  } catch (error) {
    console.error('[STORAGE] Error generating proof URL:', error);
    
    // Check if error is related to bucket configuration
    if (error.message?.includes('Bucket not found') || 
        error.message?.includes('The bucket does not exist') ||
        error.status === 400 || error.status === 404) {
      console.error('[STORAGE] Bucket configuration error - proofs must be PUBLIC or project mismatch');
    }
    
    return null;
  }
}

/**
 * Check if a proof URL is valid and accessible
 * 
 * @param proofUrl - Either a full URL (legacy) or file path (new)
 * @returns Promise<boolean> - true if URL is accessible
 */
export async function isProofUrlAccessible(proofUrl: string | null | undefined): Promise<boolean> {
  const url = getProofPublicUrl(proofUrl);
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
 * Structure: proofs/{user_id}/{invoice_id}/{timestamp}-{filename}
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
