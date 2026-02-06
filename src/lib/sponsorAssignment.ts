/**
 * Sponsor assignment utilities for onboarding
 */
import { supabase } from '@/integrations/supabase/client';

export interface SponsorResult {
  assigned: boolean;
  sponsor_user_id: string;
  sponsor_code: string;
  reason: 'assigned_from_ref' | 'assigned_hrw' | 'already_assigned' | 'no_eligible_sponsor';
}

/**
 * Assign sponsor to user during onboarding
 */
export async function assignSponsorToUser(userId: string, refCode?: string | null): Promise<SponsorResult> {
  try {
    // Check if user already has sponsor assigned
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('sponsor_code, referred_by')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing profile:', fetchError);
      return {
        assigned: false,
        sponsor_user_id: '',
        sponsor_code: '',
        reason: 'no_eligible_sponsor'
      };
    }

    // If already has sponsor, don't reassign
    if (existingProfile && existingProfile.sponsor_code) {
      return {
        assigned: false,
        sponsor_user_id: existingProfile.referred_by || '',
        sponsor_code: existingProfile.sponsor_code,
        reason: 'already_assigned'
      };
    }

    // Default to TPC-GLOBAL
    let chosenCode = 'TPC-GLOBAL';
    let reason: SponsorResult['reason'] = 'assigned_hrw';

    // If ref code provided, validate it
    if (refCode && refCode.trim()) {
      const { data: sponsorData, error: sponsorError } = await supabase
        .from('profiles')
        .select('user_id, sponsor_code, is_active')
        .eq('sponsor_code', refCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (!sponsorError && sponsorData) {
        // Prevent self-referral
        if (sponsorData.user_id !== userId) {
          chosenCode = sponsorData.sponsor_code;
          reason = 'assigned_from_ref';
        }
      }
    }

    // Get TPC-GLOBAL user_id as fallback
    const { data: tpcGlobalData } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('sponsor_code', 'TPC-GLOBAL')
      .eq('is_active', true)
      .single();

    const sponsorUserId = reason === 'assigned_from_ref' 
      ? (await supabase
          .from('profiles')
          .select('user_id')
          .eq('sponsor_code', chosenCode)
          .single()
        ).data?.user_id || tpcGlobalData?.user_id || ''
      : tpcGlobalData?.user_id || '';

    // Update user profile with sponsor assignment
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        sponsor_code: chosenCode,
        referred_by: sponsorUserId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating sponsor assignment:', updateError);
      return {
        assigned: false,
        sponsor_user_id: '',
        sponsor_code: '',
        reason: 'no_eligible_sponsor'
      };
    }

    return {
      assigned: true,
      sponsor_user_id: sponsorUserId,
      sponsor_code: chosenCode,
      reason
    };

  } catch (error) {
    console.error('Sponsor assignment error:', error);
    return {
      assigned: false,
      sponsor_user_id: '',
      sponsor_code: '',
      reason: 'no_eligible_sponsor'
    };
  }
}

/**
 * Get ref code from URL
 */
export function getRefCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  return refCode ? refCode.trim().toUpperCase() : null;
}
