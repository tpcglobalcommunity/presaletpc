export type Currency = 'IDR' | 'USDC' | 'SOL';

export function parseCurrencyInput(input: string, currency: Currency): number {
  if (!input || typeof input !== 'string') return 0;
  
  // Remove all characters except digits, comma, and dot
  const cleaned = input.replace(/[^\d.,]/g, '');
  
  if (!cleaned) return 0;
  
  switch (currency) {
    case 'IDR':
      // IDR: only digits, no decimals
      const idrDigits = cleaned.replace(/[^\d]/g, '');
      return parseInt(idrDigits, 10) || 0;
      
    case 'USDC':
      // USDC: handle both comma and dot as decimal separators
      return parseDecimalInput(cleaned, 2);
      
    case 'SOL':
      // SOL: handle both comma and dot as decimal separators, max 4 decimals
      return parseDecimalInput(cleaned, 4);
      
    default:
      return 0;
  }
}

function parseDecimalInput(input: string, maxDecimals: number): number {
  // Handle different decimal separator formats
  let processed = input;
  
  // If both comma and dot exist, determine which is decimal
  const hasComma = input.includes(',');
  const hasDot = input.includes('.');
  
  if (hasComma && hasDot) {
    // If both exist, assume the last one is decimal separator
    const lastComma = input.lastIndexOf(',');
    const lastDot = input.lastIndexOf(',');
    
    if (lastComma > lastDot) {
      // Comma is decimal, remove dots (thousands)
      processed = input.replace(/\./g, '').replace(',', '.');
    } else {
      // Dot is decimal, remove commas (thousands)
      processed = input.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Only comma exists, treat as decimal
    processed = input.replace(',', '.');
  }
  // If only dot exists, keep as is
  
  const num = parseFloat(processed);
  if (isNaN(num)) return 0;
  
  return clampDecimals(num, maxDecimals);
}

export function formatCurrencyInput(value: number, currency: Currency): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  
  switch (currency) {
    case 'IDR':
      // IDR: thousands separator with dot, no decimals
      return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
        useGrouping: true
      }).format(value);
      
    case 'USDC':
      // USDC: comma thousands separator, 2 decimal places
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
      }).format(value);
      
    case 'SOL':
      // SOL: comma thousands separator, 4 decimal places
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
        useGrouping: true
      }).format(value);
      
    default:
      return value.toString();
  }
}

export function clampDecimals(value: number, decimals: number): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function normalizeForSubmit(currency: Currency, value: number): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  
  switch (currency) {
    case 'IDR':
      return Math.trunc(value); // Integer only
    case 'USDC':
      return Number(value.toFixed(2)); // 2 decimal places
    case 'SOL':
      return Number(value.toFixed(4)); // 4 decimal places
    default:
      return value;
  }
}

export function getCurrencyPlaceholder(currency: Currency): string {
  switch (currency) {
    case 'IDR':
      return '10.000.000';
    case 'USDC':
      return '1,000.00';
    case 'SOL':
      return '0.0010';
    default:
      return '0';
  }
}

export function getCurrencyHint(currency: Currency): string {
  switch (currency) {
    case 'IDR':
      return 'Gunakan titik untuk ribuan (contoh 10.000.000)';
    case 'USDC':
      return 'Gunakan format 1,000.00';
    case 'SOL':
      return 'Minimal 4 desimal (contoh 0.0010)';
    default:
      return '';
  }
}
