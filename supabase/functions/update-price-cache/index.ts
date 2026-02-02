import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Fetch SOL price from CoinGecko API
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch SOL price");
    }
    
    const data = await response.json();
    const solPrice = data.solana?.usd;
    
    if (!solPrice) {
      throw new Error("SOL price not found in response");
    }
    
    // Update price cache in Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/price_cache`,
      {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          key: "SOL_USD",
          value: solPrice,
        }),
      }
    );
    
    if (!updateResponse.ok) {
      throw new Error("Failed to update price cache");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        solPrice: solPrice,
        message: "SOL price updated successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
    
  } catch (error: any) {
    console.error("Error updating SOL price:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
