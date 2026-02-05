import { supabase } from "@/integrations/supabase/client";

export async function ensureProfile(userId: string): Promise<void> {
  try {
    console.log("[PROFILE] Ensuring profile exists for user:", userId);
    
    // Call the RPC function to upsert profile from auth data
    const { error } = await supabase.rpc('upsert_profile_from_auth' as any, {
      p_user_id: userId
    });
    
    if (error) {
      console.error("[PROFILE] Error upserting profile:", error);
      
      // 🔒 HARD FAIL: Auto sponsor errors should not be silent
      if (error.message?.includes('AUTO_SPONSOR_FAILED')) {
        console.error("[PROFILE] Auto sponsor assignment failed:", error.message);
        throw new Error(`Auto sponsor assignment failed: ${error.message}`);
      }
      
      // Retry once for transient network errors
      if (error.message?.includes('network') || error.message?.includes('timeout')) {
        console.log("[PROFILE] Retrying profile upsert...");
        const { error: retryError } = await supabase.rpc('upsert_profile_from_auth' as any, {
          p_user_id: userId
        });
        
        if (retryError) {
          if (retryError.message?.includes('AUTO_SPONSOR_FAILED')) {
            throw new Error(`Auto sponsor assignment failed: ${retryError.message}`);
          }
          throw retryError;
        }
      } else {
        throw error;
      }
    }
    
    console.log("[PROFILE] Profile upserted successfully for user:", userId);
  } catch (error) {
    console.error("[PROFILE] Failed to ensure profile for user:", userId, "error:", error);
    throw error; // 🔒 HARD FAIL: Don't swallow errors
  }
}
