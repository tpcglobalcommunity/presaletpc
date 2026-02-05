import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to Indonesian locale
export function formatDateID(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  });
}

// Format number with Indonesian locale
export function formatNumberID(num: number): string {
  return num.toLocaleString('id-ID');
}

// Copy to clipboard utility
export async function copyToClipboard(text: string, successMessage: string = 'Disalin!'): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    // Return success for toast handling
    return;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return;
    } catch (err) {
      throw new Error('Gagal menyalin teks');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

// Truncate wallet address for display
export function truncateWalletAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Format TPC amount with proper decimal places
export function formatTPC(amount: number): string {
  return `${formatNumberID(amount)} TPC`;
}
