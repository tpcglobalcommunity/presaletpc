import { supabase } from "@/integrations/supabase/client";

// CURRENT BEHAVIOR vs TARGET BEHAVIOR:
// CURRENT: Calls upsert_profile_from_auth with complex sponsor logic, can fail on AUTO_SPONSOR_FAILED
// TARGET: Calls ensure_profile_minimal with no sponsor logic, never fails except for auth

export async function ensureProfile(userId: string): Promise<void> {
  try {
    console.log("[PROFILE] Ensuring minimal profile exists for user:", userId);
    
    // Call minimal profile function (no sponsor logic, never fails)
    const { error } = await supabase.rpc('ensure_profile_minimal' as any);
    
    if (error) {
      console.error("[PROFILE] Error ensuring minimal profile:", error);
      
      // 🔒 THROW only for true auth errors
      if (error.message?.includes('AUTH_REQUIRED') || 
          error.message?.includes('USER_NOT_FOUND')) {
        throw new Error(`Authentication required: ${error.message}`);
      }
      
      // Retry once for transient network errors
      if (error.message?.includes('network') || error.message?.includes('timeout')) {
        console.log("[PROFILE] Retrying minimal profile ensure...");
        const { error: retryError } = await supabase.rpc('ensure_profile_minimal' as any);
        
        if (retryError) {
          if (retryError.message?.includes('AUTH_REQUIRED') || 
              retryError.message?.includes('USER_NOT_FOUND')) {
            throw new Error(`Authentication required: ${retryError.message}`);
          }
          throw retryError;
        }
      } else {
        throw error;
      }
    }
    
    console.log("[PROFILE] Minimal profile ensured successfully for user:", userId);
  } catch (error) {
    console.error("[PROFILE] Failed to ensure minimal profile for user:", userId, "error:", error);
    
    // 🔒 THROW only for auth errors, not for any other issues
    if (error instanceof Error && 
        (error.message.includes('AUTH_REQUIRED') || 
         error.message.includes('USER_NOT_FOUND'))) {
      throw error;
    }
    
    // For any other errors, log but don't throw to prevent blocking
    console.warn("[PROFILE] Non-auth error in ensureProfile, treating as success:", error);
  }
}
