/**
 * Real-time SOL/USD price service with caching
 */

const KEY = "tpc_sol_usd_price";
const TS = "tpc_sol_usd_price_ts";
const TTL_MS = 60_000;

export async function getSolUsdPrice(): Promise<number | null> {
  try {
    // Check cache
    const cached = localStorage.getItem(KEY);
    const cachedTs = localStorage.getItem(TS);
    
    if (cached && cachedTs) {
      const ts = Number(cachedTs);
      if (Date.now() - ts < TTL_MS) {
        return Number(cached);
      }
    }

    // Fetch fresh price
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const price = data.solana?.usd;
    
    if (typeof price === "number" && Number.isFinite(price)) {
      // Store to cache
      localStorage.setItem(KEY, String(price));
      localStorage.setItem(TS, String(Date.now()));
      return price;
    }
    
    return null;
  } catch (error) {
    console.warn("Failed to fetch SOL price:", error);
    
    // Return cached if available even if expired
    const cached = localStorage.getItem(KEY);
    return cached ? Number(cached) : null;
  }
}
