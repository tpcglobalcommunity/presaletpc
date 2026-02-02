// Pricing Configuration for TPC Gateway

// LOCKED PRICING CONSTANTS
export const BASE_TPC_PRICE_USD = 0.001; // 1 TPC = 0.001 USD (LOCKED)
export const FIXED_IDR_RATE = 17000; // 1 USD = 17.000 IDR (LOCKED)

export const PRICING_CONFIG = {
  // Presale Phase 1 (Baru Mulai)
  PRESALE_PHASE_1: {
    name: 'Presale Tahap 1',
    price_usd: BASE_TPC_PRICE_USD, // Using locked constant
    kurs_idr: FIXED_IDR_RATE,  // Using locked constant
    min_purchase_usd: 10, // Minimum $10
    max_purchase_usd: 1000, // Maximum $1000
    sponsor_bonus_percentage: 5, // 5% bonus untuk sponsor (dari pembelian user)
    start_date: '2026-02-01', // YYYY-MM-DD
    end_date: '2026-02-28',   // YYYY-MM-DD
    status: 'active', // active, inactive, ended
  },
  
  // Future phases (placeholder)
  PRESALE_PHASE_2: {
    name: 'Presale Tahap 2',
    price_usd: 0.002, // $0.002 per TPC
    kurs_idr: FIXED_IDR_RATE,
    min_purchase_usd: 10,
    max_purchase_usd: 5000,
    sponsor_bonus_percentage: 3, // 3% bonus untuk sponsor
    start_date: '2026-03-01',
    end_date: '2026-03-31',
    status: 'inactive',
  },
  
  PUBLIC_SALE: {
    name: 'Public Sale',
    price_usd: 0.003, // $0.003 per TPC
    kurs_idr: FIXED_IDR_RATE,
    min_purchase_usd: 10,
    max_purchase_usd: 10000,
    sponsor_bonus_percentage: 1, // 1% bonus untuk sponsor
    start_date: '2026-04-01',
    end_date: '2026-04-30',
    status: 'inactive',
  },
};

type PricingPhase = typeof PRICING_CONFIG.PRESALE_PHASE_1;

// Get current active pricing phase
export const getCurrentPricing = (): PricingPhase => {
  const now = new Date();
  
  // Check Presale Phase 1
  if (PRICING_CONFIG.PRESALE_PHASE_1.status === 'active') {
    const start = new Date(PRICING_CONFIG.PRESALE_PHASE_1.start_date);
    const end = new Date(PRICING_CONFIG.PRESALE_PHASE_1.end_date);
    if (now >= start && now <= end) {
      return PRICING_CONFIG.PRESALE_PHASE_1;
    }
  }
  
  // Check Presale Phase 2
  if (PRICING_CONFIG.PRESALE_PHASE_2.status === 'active') {
    const start = new Date(PRICING_CONFIG.PRESALE_PHASE_2.start_date);
    const end = new Date(PRICING_CONFIG.PRESALE_PHASE_2.end_date);
    if (now >= start && now <= end) {
      return PRICING_CONFIG.PRESALE_PHASE_2;
    }
  }
  
  // Check Public Sale
  if (PRICING_CONFIG.PUBLIC_SALE.status === 'active') {
    const start = new Date(PRICING_CONFIG.PUBLIC_SALE.start_date);
    const end = new Date(PRICING_CONFIG.PUBLIC_SALE.end_date);
    if (now >= start && now <= end) {
      return PRICING_CONFIG.PUBLIC_SALE;
    }
  }
  
  // Default to Presale Phase 1 if no active phase
  return PRICING_CONFIG.PRESALE_PHASE_1;
};

// Calculate TPC amount from USD (untuk pembeli)
export const calculateTPCFromUSD = (usdAmount: number, pricing = getCurrentPricing()) => {
  const tpcAmount = usdAmount / pricing.price_usd;
  return {
    base_amount: tpcAmount,
    total_amount: tpcAmount, // Pembeli tidak dapat bonus
  };
};

// LOCKED SPONSOR COMMISSION
export const LOCKED_SPONSOR_COMMISSION_PERCENTAGE = 5; // 5% (LOCKED)

// Calculate sponsor bonus dari pembelian user
export const calculateSponsorBonus = (userTPCPurchase: number) => {
  const bonusAmount = Math.floor(userTPCPurchase * (LOCKED_SPONSOR_COMMISSION_PERCENTAGE / 100));
  return {
    bonus_amount: bonusAmount,
    bonus_percentage: LOCKED_SPONSOR_COMMISSION_PERCENTAGE,
  };
};

// Calculate USD amount from TPC
export const calculateUSDFromTPC = (tpcAmount: number, pricing = getCurrentPricing()) => {
  return tpcAmount * pricing.price_usd;
};

// Convert USD to IDR
export const convertUSDToIDR = (usdAmount: number, kurs = FIXED_IDR_RATE) => {
  return usdAmount * kurs;
};

// Convert IDR to USD
export const convertIDRToUSD = (idrAmount: number, kurs = FIXED_IDR_RATE) => {
  return idrAmount / kurs;
};

// Fetch SOL price from CoinGecko API (real-time)
export const fetchSOLPrice = async (): Promise<number | null> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    if (!response.ok) {
      throw new Error('Failed to fetch SOL price');
    }
    const data = await response.json();
    return data.solana?.usd || null;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return null;
  }
};

// Convert SOL to USD
export const convertSOLToUSD = (solAmount: number, solPriceUSD: number) => {
  return solAmount * solPriceUSD;
};

// Format currency
export const formatCurrency = (amount: number, currency: 'USD' | 'IDR') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  }
  
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
};
