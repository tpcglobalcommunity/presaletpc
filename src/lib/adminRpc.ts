import { supabase } from '@/integrations/supabase/client';

/**
 * RPC call with fallback for function name compatibility
 * Handles cases where DB might have tpc_ prefixed function names
 */
export async function rpcWithFallback<T = any>(
  primaryFunction: string, 
  fallbackFunction?: string
) {
  // Try primary function first
  const result = await supabase.rpc<T>(primaryFunction);
  
  // If primary succeeds, return it
  if (!result.error) {
    return result;
  }
  
  // If primary fails and we have a fallback, try fallback
  if (fallbackFunction) {
    console.log(`[RPC] Primary function ${primaryFunction} failed, trying fallback ${fallbackFunction}`);
    const fallbackResult = await supabase.rpc<T>(fallbackFunction);
    return fallbackResult;
  }
  
  // If no fallback, return primary error
  return result;
}

/**
 * Specific RPC calls for admin dashboard with fallbacks
 */
export const adminRpc = {
  /**
   * Get dashboard stats with fallback to tpc_ prefixed version
   */
  async getDashboardStats() {
    return rpcWithFallback(
      'get_dashboard_stats_admin',
      'tpc_get_dashboard_stats_admin'
    );
  },

  /**
   * Get paid totals with fallback to tpc_ prefixed version
   */
  async getPaidTotals() {
    return rpcWithFallback(
      'admin_get_paid_totals',
      'tpc_admin_get_paid_totals'
    );
  }
};
