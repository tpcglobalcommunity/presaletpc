/**
 * Fixed Exchange Rate Configuration
 * Single source of truth for USDC-IDR conversion
 */

export const USDC_IDR_RATE = 17000;

/**
 * Convert IDR to USDC using fixed rate
 * @param idr Amount in Indonesian Rupiah
 * @returns Amount in USDC (2-6 decimals)
 */
export function idrToUsdc(idr: number): number {
  return idr / USDC_IDR_RATE;
}

/**
 * Convert USDC to IDR using fixed rate
 * @param usdc Amount in USDC
 * @returns Amount in Indonesian Rupiah (integer)
 */
export function usdcToIdr(usdc: number): number {
  return Math.round(usdc * USDC_IDR_RATE);
}

/**
 * Round USDC to appropriate decimal places (2-6)
 * @param usdc Amount in USDC
 * @param decimals Number of decimal places (default: 2)
 * @returns Rounded USDC amount
 */
export function roundUsdc(usdc: number, decimals: number = 2): number {
  return Math.round(usdc * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Format IDR amount with proper formatting
 * @param idr Amount in Indonesian Rupiah
 * @returns Formatted IDR string
 */
export function formatIdr(idr: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(idr);
}

/**
 * Format USDC amount with proper formatting
 * @param usdc Amount in USDC
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted USDC string
 */
export function formatUsdc(usdc: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(usdc);
}
