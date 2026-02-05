import { supabase } from '@/integrations/supabase/client';

export async function callEdgeFunction(name: string, body: any, accessToken: string) {
  try {
    const { data, error } = await supabase.functions.invoke(name, {
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (error) {
      console.error(`Edge function ${name} error:`, error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`Edge function ${name} failed:`, err);
    throw err;
  }
}
