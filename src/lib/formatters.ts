/**
 * Currency-specific formatters and parsers for BuyTPC page
 */

// Helper to clamp decimal places
export function clampDecimals(str: string, maxDecimals: number): string {
  const parts = str.split('.');
  if (parts.length <= 1) return str;
  
  const integer = parts[0];
  const decimal = parts[1].slice(0, maxDecimals);
  
  return decimal ? `${integer}.${decimal}` : integer;
}

// IDR: Indonesian Rupiah
export function parseIdr(input: string): number {
  // Remove all non-digit characters
  const clean = input.replace(/[^\d]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

export function formatIdr(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// USDC: USD Coin (stablecoin)
export function parseUsdc(input: string): number {
  // Remove commas, allow digits and dot
  const clean = input.replace(/,/g, '');
  const clamped = clampDecimals(clean, 2);
  return clamped ? parseFloat(clamped) : 0;
}

export function formatUsdc(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// SOL: Solana
export function parseSol(input: string): number {
  // Remove commas, allow digits and dot
  const clean = input.replace(/,/g, '');
  const clamped = clampDecimals(clean, 4);
  return clamped ? parseFloat(clamped) : 0;
}

export function formatSol(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

// TPC: Token TPC Global
export function formatTpc(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
