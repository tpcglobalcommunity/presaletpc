/**
 * Currency-specific formatters and parsers for BuyTPC page
 */

// Helper to clamp decimal places
export function clampDecimals(str: string, maxDecimals: number): string {
  // Allow only digits and one dot
  const cleaned = str.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length <= 1) return cleaned;
  
  const integer = parts[0];
  const decimal = parts[1].slice(0, maxDecimals);
  
  return decimal ? `${integer}.${decimal}` : integer;
}

// IDR: Indonesian Rupiah
export function parseIdr(raw: string): number {
  const digits = (raw || "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function formatIdr(n: number): string {
  return new Intl.NumberFormat("id-ID", { 
    maximumFractionDigits: 0 
  }).format(Math.max(0, Math.floor(n || 0)));
}

// USDC: USD Coin (stablecoin)
export function parseUsdc(raw: string): number {
  const cleaned = raw.replace(/,/g, '');
  const clamped = clampDecimals(cleaned, 2);
  return clamped ? Number(clamped) : 0;
}

export function formatUsdc(n: number): string {
  return new Intl.NumberFormat("en-US", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(Number(n || 0));
}

// SOL: Solana
export function parseSol(raw: string): number {
  const cleaned = raw.replace(/,/g, '');
  const clamped = clampDecimals(cleaned, 4);
  return clamped ? Number(clamped) : 0;
}

export function formatSol(n: number): string {
  return new Intl.NumberFormat("en-US", { 
    minimumFractionDigits: 4, 
    maximumFractionDigits: 4 
  }).format(Number(n || 0));
}

// TPC: Token TPC Global
export function formatTpc(n: number): string {
  return new Intl.NumberFormat("id-ID", { 
    maximumFractionDigits: 2 
  }).format(Number(n || 0));
}
