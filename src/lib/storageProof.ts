/**
 * Canonical proof storage helper
 * Single source of truth for proof bucket/path operations
 */

import { supabase } from '@/integrations/supabase/client';

export const DEFAULT_PROOF_BUCKET = 'invoice-proofs';

/**
 * Build canonical proof storage path
 * Format: {user_id}/{invoice_id}/{timestamp-filename}
 */
export function buildProofPath(userId: string, invoiceId: string, fileName: string): string {
  const timestamp = Date.now();
  return `${userId}/${invoiceId}/${timestamp}-${fileName}`;
}

/**
 * Get public URL for proof from bucket and path
 */
export function getProofPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Parse legacy proof URL to extract bucket and path
 * Returns null if URL is invalid
 */
export function parseLegacyProofUrlToBucketPath(url: string): { bucket: string; path: string } | null {
  try {
    if (!url || typeof url !== 'string') return null;
    
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Extract path after /storage/v1/object/public/
    const publicPrefix = '/storage/v1/object/public/';
    if (!pathname.startsWith(publicPrefix)) return null;
    
    const remainingPath = pathname.slice(publicPrefix.length);
    
    // Extract bucket and path
    const firstSlash = remainingPath.indexOf('/');
    if (firstSlash === -1) return null;
    
    const bucket = remainingPath.slice(0, firstSlash);
    const path = remainingPath.slice(firstSlash + 1);
    
    // Decode URI components
    const decodedPath = decodeURIComponent(path);
    
    console.log('[STORAGE] Parsed legacy URL:', { bucket, path: decodedPath, original: url });
    
    return { bucket, path: decodedPath };
  } catch (error) {
    console.error('[STORAGE] Failed to parse legacy proof URL:', error, { url });
    return null;
  }
}

/**
 * Normalize proof URL to canonical bucket+path format
 * If URL is legacy, returns canonical URL
 * If URL is already canonical, returns as-is
 */
export function normalizeProofUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // If it's already a full URL, parse and normalize
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const parsed = parseLegacyProofUrlToBucketPath(url);
    if (parsed) {
      // Return canonical URL from parsed bucket+path
      return getProofPublicUrl(parsed.bucket, parsed.path);
    }
    return null;
  }
  
  // If it's a path, assume it's from default bucket
  return getProofPublicUrl(DEFAULT_PROOF_BUCKET, url);
}

/**
 * Upload proof file and return bucket+path info
 */
export async function uploadProofFile(
  userId: string, 
  invoiceId: string, 
  file: File
): Promise<{ bucket: string; path: string; publicUrl: string }> {
  const bucket = DEFAULT_PROOF_BUCKET;
  const path = buildProofPath(userId, invoiceId, file.name);
  
  console.log('[STORAGE] Uploading proof:', { bucket, path, fileName: file.name });
  
  // Upload file
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { 
      upsert: false, 
      contentType: file.type 
    });
  
  if (error) {
    console.error('[STORAGE] Upload failed:', error);
    throw error;
  }
  
  // Get public URL
  const publicUrl = getProofPublicUrl(bucket, path);
  
  console.log('[STORAGE] Upload successful:', { bucket, path, publicUrl });
  
  return { bucket, path, publicUrl };
}

/**
 * Update invoice with proof information
 */
export async function updateInvoiceProof(
  invoiceId: string,
  bucket: string,
  path: string,
  publicUrl: string
): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .update({
      proof_bucket: bucket,
      proof_path: path,
      proof_url: publicUrl, // Keep for compatibility
      proof_uploaded_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      status: 'PENDING_REVIEW'
    })
    .eq('id', invoiceId);
  
  if (error) {
    console.error('[STORAGE] Failed to update invoice:', error);
    throw error;
  }
  
  console.log('[STORAGE] Invoice updated with proof:', { invoiceId, bucket, path });
}
