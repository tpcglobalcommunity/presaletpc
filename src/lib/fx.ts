interface FxRateResult {
  rate: number;
  source: 'realtime' | 'fallback';
}

interface FxCache {
  rate: number;
  source: 'realtime' | 'fallback';
  timestamp: number;
}

const CACHE_KEY = 'fx_usd_idr_rate';
const CACHE_TIMESTAMP_KEY = 'fx_usd_idr_ts';
const MEMORY_CACHE_TTL = 60 * 1000; // 60 seconds
const STORAGE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const FALLBACK_RATE = 17000;
const REQUEST_TIMEOUT = 6000; // 6 seconds

let memoryCache: FxCache | null = null;

// API endpoints for USD to IDR conversion
const API_ENDPOINTS = [
  {
    name: 'exchangerate.host',
    url: 'https://api.exchangerate.host/latest?base=USD&symbols=IDR',
    parser: (data: any) => data.rates?.IDR
  },
  {
    name: 'er-api',
    url: 'https://open.er-api.com/v6/latest/USD',
    parser: (data: any) => data.rates?.IDR
  }
];

function isValidRate(rate: any): rate is number {
  return typeof rate === 'number' && 
         !isNaN(rate) && 
         isFinite(rate) && 
         rate >= 1000 && 
         rate <= 100000;
}

function getFromCache(): FxRateResult | null {
  const now = Date.now();
  
  // Check memory cache first
  if (memoryCache && (now - memoryCache.timestamp) < MEMORY_CACHE_TTL) {
    if (import.meta.env.DEV) {
      console.debug('[FX] Using memory cache:', memoryCache);
    }
    return {
      rate: memoryCache.rate,
      source: memoryCache.source
    };
  }
  
  // Check localStorage cache
  try {
    const cachedRate = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cachedRate && cachedTimestamp) {
      const rate = parseFloat(cachedRate);
      const timestamp = parseInt(cachedTimestamp);
      
      if (isValidRate(rate) && (now - timestamp) < STORAGE_CACHE_TTL) {
        const source = timestamp > 0 ? 'realtime' : 'fallback';
        
        // Update memory cache
        memoryCache = { rate, source, timestamp };
        
        if (import.meta.env.DEV) {
          console.debug('[FX] Using localStorage cache:', { rate, source, timestamp });
        }
        
        return { rate, source };
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[FX] localStorage cache read failed:', error);
    }
  }
  
  return null;
}

function setCache(rate: number, source: 'realtime' | 'fallback'): void {
  const now = Date.now();
  
  // Update memory cache
  memoryCache = { rate, source, timestamp: now };
  
  // Update localStorage cache
  try {
    localStorage.setItem(CACHE_KEY, rate.toString());
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[FX] localStorage cache write failed:', error);
    }
  }
}

async function fetchFromAPI(): Promise<{ rate: number; source: 'realtime' }> {
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
      const rate = endpoint.parser(data);
      
      if (isValidRate(rate)) {
        if (import.meta.env.DEV) {
          console.debug(`[FX] Success from ${endpoint.name}:`, rate);
        }
        
        return { rate, source: 'realtime' };
      } else {
        throw new Error(`Invalid rate from ${endpoint.name}: ${rate}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.debug(`[FX] Failed ${endpoint.name}:`, error);
      }
      // Continue to next endpoint
    }
  }
  
  throw new Error('All API endpoints failed');
}

export async function getUsdToIdrRate(): Promise<FxRateResult> {
  // Check cache first
  const cached = getFromCache();
  if (cached) {
    return cached;
  }
  
  try {
    // Try to fetch from API
    const result = await fetchFromAPI();
    setCache(result.rate, result.source);
    return result;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[FX] All APIs failed, using fallback:', error);
    }
    
    // Use fallback rate
    setCache(FALLBACK_RATE, 'fallback');
    return {
      rate: FALLBACK_RATE,
      source: 'fallback'
    };
  }
}
