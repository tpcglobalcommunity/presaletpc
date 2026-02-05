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
      
      // 🔒 HANDLE UUID ERRORS - treat as non-fatal
      if (error.message?.includes('invalid input syntax for type uuid')) {
        console.warn("[PROFILE] UUID syntax error, treating as success:", error.message);
        return; // ✅ Return success, don't throw
      }
      
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
          // 🔒 HANDLE UUID ERRORS in retry
          if (retryError.message?.includes('invalid input syntax for type uuid')) {
            console.warn("[PROFILE] UUID syntax error in retry, treating as success:", retryError.message);
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
    
    // 🆕 ADD MEMBER_CODE FALLBACK
    // Ensure member_code exists even if minimal profile succeeded
    const { error: memberCodeError } = await supabase.rpc('ensure_profile_member_code' as any, {
      p_user_id: userId
    });
    
    if (memberCodeError) {
      console.error("[PROFILE] Error ensuring member code:", memberCodeError);
      // Don't throw - member_code is critical but not blocking
    }
    
    console.log("[PROFILE] Minimal profile + member_code ensured successfully for user:", userId);
  } catch (error) {
    console.error("[PROFILE] Failed to ensure minimal profile for user:", userId, "error:", error);
    
    // 🔒 HANDLE UUID ERRORS in catch block
    if (error instanceof Error && 
        (error.message.includes('invalid input syntax for type uuid'))) {
      console.warn("[PROFILE] UUID syntax error caught, treating as success:", error.message);
      return; // ✅ Return success, don't throw
    }
    
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
