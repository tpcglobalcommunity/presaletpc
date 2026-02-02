import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useReferralNetwork = (memberCode: string) => {
  return useQuery({
    queryKey: ['referral-network', memberCode],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_referral_network', {
        target_member_code: memberCode,
        max_depth: 10
      });

      if (error) throw error;
      return data;
    },
    enabled: !!memberCode,
  });
};
