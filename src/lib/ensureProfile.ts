import { supabase } from "@/integrations/supabase/client";

export async function ensureProfile(userId: string): Promise<void> {
  try {
    console.log("[PROFILE] Ensuring profile exists for user:", userId);
    
    // Call the RPC function to upsert profile from auth data
    const { error } = await supabase.rpc('upsert_profile_from_auth', {
      p_user_id: userId
    });
    
    if (error) {
      console.error("[PROFILE] Error upserting profile:", error);
      throw error;
    }
    
    console.log("[PROFILE] Profile upserted successfully");
  } catch (error) {
    console.error("[PROFILE] Failed to ensure profile:", error);
    throw error;
  }
}
