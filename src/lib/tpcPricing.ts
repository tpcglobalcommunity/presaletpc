/**
 * TPC Pricing Engine - Single source of truth for pricing calculations
 */

export const TPC_PRICING = {
  stage1_usdc: 0.001,
  stage2_usdc: 0.002,
  listing_target_usdc: 0.005,
} as const;

export type TPCPricingStage = keyof typeof TPC_PRICING;

export function getTPCPriceInIDR(usdToIdrRate: number, stage: TPCPricingStage): number {
  const usdcPrice = TPC_PRICING[stage];
  return Math.round(usdcPrice * usdToIdrRate);
}

// Legacy compatibility - keep existing exports
export const USD_IDR = Number(import.meta.env.VITE_USD_IDR ?? 17000);
export const TPC_PRICE_USDC = TPC_PRICING.stage1_usdc; // Default to stage 1

export function idrToUsdc(idr: number): number {
  return (idr || 0) / USD_IDR;
}

export function usdcToTpc(usdc: number): number {
  return (usdc || 0) / TPC_PRICE_USDC;
}

export function solToUsdc(sol: number, solUsd: number): number {
  return (sol || 0) * (solUsd || 0);
}

export function calcTpc(
  currency: "IDR" | "USDC" | "SOL", 
  amount: number, 
  solUsd: number | null
): number {
  if (currency === "IDR") {
    return usdcToTpc(idrToUsdc(amount));
  }
  if (currency === "USDC") {
    return usdcToTpc(amount);
  }
  if (currency === "SOL") {
    if (!solUsd || !Number.isFinite(solUsd)) return 0;
    return usdcToTpc(solToUsdc(amount, solUsd));
  }
  return 0;
}
