import { supabase } from '@/integrations/supabase/client';
import { PROOF_BUCKET, isHttpUrl } from '@/config/storage';

/**
 * Normalize proof path by removing storage URL prefixes
 */
export function normalizeProofPath(raw: string): string {
  // If raw accidentally contains "/storage/v1/object/public/proofs/" prefix, strip it
  const proofsPrefix = '/storage/v1/object/public/proofs/';
  const proofsIndex = raw.indexOf(proofsPrefix);
  
  if (proofsIndex !== -1) {
    return raw.slice(proofsIndex + proofsPrefix.length);
  }
  
  // If raw contains "object/public/proofs/" with base removed, extract path after "proofs/"
  const objectProofsPrefix = 'object/public/proofs/';
  const objectProofsIndex = raw.indexOf(objectProofsPrefix);
  
  if (objectProofsIndex !== -1) {
    return raw.slice(objectProofsIndex + objectProofsPrefix.length);
  }
  
  // If raw contains "/storage/v1/object/public/invoice-proofs/" strip similarly
  const invoiceProofsPrefix = '/storage/v1/object/public/invoice-proofs/';
  const invoiceProofsIndex = raw.indexOf(invoiceProofsPrefix);
  
  if (invoiceProofsIndex !== -1) {
    return raw.slice(invoiceProofsIndex + invoiceProofsPrefix.length);
  }
  
  // If raw contains "object/public/invoice-proofs/" strip similarly
  const objectInvoiceProofsPrefix = 'object/public/invoice-proofs/';
  const objectInvoiceProofsIndex = raw.indexOf(objectInvoiceProofsPrefix);
  
  if (objectInvoiceProofsIndex !== -1) {
    return raw.slice(objectInvoiceProofsIndex + objectInvoiceProofsPrefix.length);
  }
  
  // Return raw if no prefixes found
  return raw;
}

/**
 * Get the public URL for a payment proof
 * Handles both legacy full URLs and new path-only storage
 * 
 * @param proofUrl - Either a full URL (legacy) or file path (new)
 * @returns Public URL string or null if invalid
 */
export function getProofPublicUrl(proofUrl: string | null | undefined): string | null {
  if (!proofUrl) return null;
  
  // Legacy: if it's already a full URL, return as-is
  if (isHttpUrl(proofUrl)) {
    return proofUrl;
  }
  
  // New: normalize path first, then generate public URL from bucket path
  try {
    const normalizedPath = normalizeProofPath(proofUrl);
    const { data } = supabase.storage
      .from(PROOF_BUCKET)
      .getPublicUrl(normalizedPath);
    
    return data?.publicUrl ?? null;
  } catch (error) {
    console.error('Error generating proof URL:', error);
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
 * 
 * @param invoiceId - Invoice ID
 * @param userId - User ID
 * @param file - File object
 * @returns File path string
 */
export function generateProofFilePath(invoiceId: string, userId: string, file: File): string {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `invoices/${invoiceId}/${userId}-${timestamp}.${extension}`;
}
