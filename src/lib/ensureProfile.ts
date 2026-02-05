import { supabase } from "@/integrations/supabase/client";

export async function ensureProfile(userId: string): Promise<void> {
  try {
    console.log("[PROFILE] Ensuring profile exists for user:", userId);
    
    // Call the RPC function to upsert profile from auth data
    const { error } = await supabase.rpc('upsert_profile_from_auth' as any);
    
    if (error) {
      console.error("[PROFILE] Error upserting profile:", error);
      
      // 🔒 DO NOT THROW for auto sponsor errors - treat as success
      if (error.message?.includes('AUTO_SPONSOR_FAILED') || 
          error.message?.includes('No eligible sponsors')) {
        console.warn("[PROFILE] Auto sponsor assignment failed, but profile created successfully:", error.message);
        return; // ✅ Return success, don't throw
      }
      
      // 🔒 THROW only for true auth errors or unknown fatal errors
      if (error.message?.includes('AUTH_REQUIRED') || 
          error.message?.includes('USER_NOT_FOUND')) {
        throw new Error(`Authentication required: ${error.message}`);
      }
      
      // Retry once for transient network errors
      if (error.message?.includes('network') || error.message?.includes('timeout')) {
        console.log("[PROFILE] Retrying profile upsert...");
        const { error: retryError } = await supabase.rpc('upsert_profile_from_auth' as any);
        
        if (retryError) {
          if (retryError.message?.includes('AUTO_SPONSOR_FAILED') || 
              retryError.message?.includes('No eligible sponsors')) {
            console.warn("[PROFILE] Auto sponsor assignment failed on retry, but profile created successfully:", retryError.message);
            return; // ✅ Return success, don't throw
          }
          
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
    
    console.log("[PROFILE] Profile upserted successfully for user:", userId);
  } catch (error) {
    console.error("[PROFILE] Failed to ensure profile for user:", userId, "error:", error);
    
    // 🔒 THROW only for non-auto-sponsor errors
    if (error instanceof Error && 
        (error.message.includes('AUTO_SPONSOR_FAILED') || 
         error.message.includes('No eligible sponsors'))) {
      console.warn("[PROFILE] Auto sponsor error caught, treating as success:", error.message);
      return; // ✅ Return success, don't throw
    }
    
    throw error; // 🔒 Throw only for real errors
  }
}
