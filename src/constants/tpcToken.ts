/**
 * Official TPC Token Information - Single Source of Truth
 * Canonical data for all TPC token references across the application
 */

export const TPC_TOKEN = {
  name: 'TPC',
  network: 'Solana Mainnet',
  mint: '2YJi7b95778Wv5DNWMZD86TN3fkUHDFwcDesrFoGdEka',
  explorer: 'https://solscan.io/token/2YJi7b95778Wv5DNWMZD86TN3fkUHDFwcDesrFoGdEka',
} as const;

// Helper functions for token operations
export const truncateMintAddress = (mint: string, startLength = 8, endLength = 8): string => {
  if (mint.length <= startLength + endLength) return mint;
  return `${mint.slice(0, startLength)}...${mint.slice(-endLength)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (fallbackError) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};
