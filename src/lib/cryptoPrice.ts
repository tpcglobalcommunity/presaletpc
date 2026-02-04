interface SolPriceResult {
  price: number;
  source: 'realtime' | 'fallback';
}

interface SolPriceCache {
  price: number;
  source: 'realtime' | 'fallback';
  timestamp: number;
}

const CACHE_KEY = 'sol_usd_price';
const CACHE_TIMESTAMP_KEY = 'sol_usd_ts';
const MEMORY_CACHE_TTL = 60 * 1000; // 60 seconds
const STORAGE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const FALLBACK_PRICE = 100; // $100 SOL fallback
const REQUEST_TIMEOUT = 6000; // 6 seconds

let memoryCache: SolPriceCache | null = null;

// API endpoints for SOL to USD conversion
const API_ENDPOINTS = [
  {
    name: 'coingecko',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
    parser: (data: any) => data.solana?.usd
  }
];

function isValidPrice(price: any): price is number {
  return typeof price === 'number' && 
         !isNaN(price) && 
         isFinite(price) && 
         price > 0 && 
         price <= 100000; // Reasonable range for SOL
}

function getFromCache(): SolPriceResult | null {
  const now = Date.now();
  
  // Check memory cache first
  if (memoryCache && (now - memoryCache.timestamp) < MEMORY_CACHE_TTL) {
    if (import.meta.env.DEV) {
      console.debug('[SOL] Using memory cache:', memoryCache);
    }
    return {
      price: memoryCache.price,
      source: memoryCache.source
    };
  }
  
  // Check localStorage cache
  try {
    const cachedPrice = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cachedPrice && cachedTimestamp) {
      const price = parseFloat(cachedPrice);
      const timestamp = parseInt(cachedTimestamp);
      
      if (isValidPrice(price) && (now - timestamp) < STORAGE_CACHE_TTL) {
        const source = timestamp > 0 ? 'realtime' : 'fallback';
        
        // Update memory cache
        memoryCache = { price, source, timestamp };
        
        if (import.meta.env.DEV) {
          console.debug('[SOL] Using localStorage cache:', { price, source, timestamp });
        }
        
        return { price, source };
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[SOL] localStorage cache read failed:', error);
    }
  }
  
  return null;
}

function setCache(price: number, source: 'realtime' | 'fallback'): void {
  const now = Date.now();
  
  // Update memory cache
  memoryCache = { price, source, timestamp: now };
  
  // Update localStorage cache
  try {
    localStorage.setItem(CACHE_KEY, price.toString());
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[SOL] localStorage cache write failed:', error);
    }
  }
}

async function fetchFromAPI(): Promise<{ price: number; source: 'realtime' }> {
  for (const endpoint of API_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      const response = await fetch(endpoint.url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const price = endpoint.parser(data);
      
      if (isValidPrice(price)) {
        if (import.meta.env.DEV) {
          console.debug(`[SOL] Success from ${endpoint.name}:`, price);
        }
        
        return { price, source: 'realtime' };
      } else {
        throw new Error(`Invalid price from ${endpoint.name}: ${price}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.debug(`[SOL] Failed ${endpoint.name}:`, error);
      }
      // Continue to next endpoint
    }
  }
  
  throw new Error('All API endpoints failed');
}

export async function getSolToUsdPrice(): Promise<SolPriceResult> {
  // Check cache first
  const cached = getFromCache();
  if (cached) {
    return cached;
  }
  
  try {
    // Try to fetch from API
    const result = await fetchFromAPI();
    setCache(result.price, result.source);
    return result;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[SOL] All APIs failed, using fallback:', error);
    }
    
    // Use fallback price
    setCache(FALLBACK_PRICE, 'fallback');
    return {
      price: FALLBACK_PRICE,
      source: 'fallback'
    };
  }
}
