/**
 * Format number with Indonesian locale (dot separator)
 * e.g., 1000000 → "1.000.000"
 */
export function formatNumberID(value: number): string {
  return value.toLocaleString('id-ID');
}

/**
 * Format number as Indonesian Rupiah
 * e.g., 1000000 → "Rp 1.000.000"
 */
export function formatRupiah(value: number): string {
  return `Rp ${formatNumberID(value)}`;
}

/**
 * Parse Indonesian formatted number string to number
 * e.g., "1.000.000" → 1000000
 */
export function parseNumberID(value: string): number {
  // Remove all dots (thousand separators)
  const cleaned = value.replace(/\./g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format input as Indonesian number while typing
 * e.g., "1000000" → "1.000.000"
 */
export function formatInputNumber(value: string): string {
  // Remove non-digit characters
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  
  // Parse and format
  const num = parseInt(digits, 10);
  return formatNumberID(num);
}

/**
 * Format TPC amount (2 decimal places)
 */
export function formatTPC(value: number): string {
  return formatNumberID(Math.floor(value * 100) / 100);
}

/**
 * Calculate TPC from USD amount
 * Rate: 1 USD = 100 TPC (example rate)
 */
export function calculateTPC(amountUSD: number): number {
  const TPC_RATE = 100; // 1 USD = 100 TPC
  return Math.floor(amountUSD * TPC_RATE);
}

/**
 * Convert currency to USD
 */
export function convertToUSD(amount: number, currency: 'IDR' | 'USDC' | 'SOL'): number {
  const rates: Record<string, number> = {
    IDR: 0.000063, // 1 IDR = 0.000063 USD
    USDC: 1, // 1 USDC = 1 USD
    SOL: 150, // 1 SOL = 150 USD (example)
  };
  return amount * (rates[currency] || 0);
}
