/**
 * BuyTPC Draft Management
 * Handles saving and resuming purchase drafts across login flow
 */

export interface BuyDraft {
  wallet_address?: string;
  ref_code?: string;
  amount_input?: string;
  currency?: 'IDR' | 'USDC';
  lang: string;
  timestamp: number;
}

const DRAFT_KEY = 'TPC_BUY_DRAFT';
const DRAFT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Save purchase draft to sessionStorage
 */
export function saveBuyDraft(draft: Omit<BuyDraft, 'timestamp'>): void {
  const fullDraft: BuyDraft = {
    ...draft,
    timestamp: Date.now()
  };
  
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(fullDraft));
  } catch (error) {
    console.warn('[BUY_DRAFT] Failed to save draft:', error);
  }
}

/**
 * Load and validate purchase draft
 * Returns null if no draft, expired, or invalid
 */
export function loadBuyDraft(): BuyDraft | null {
  try {
    const stored = sessionStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    
    const draft = JSON.parse(stored) as BuyDraft;
    
    // Check expiry
    if (Date.now() - draft.timestamp > DRAFT_EXPIRY_MS) {
      clearBuyDraft();
      return null;
    }
    
    return draft;
  } catch (error) {
    console.warn('[BUY_DRAFT] Failed to load draft:', error);
    clearBuyDraft();
    return null;
  }
}

/**
 * Clear purchase draft
 */
export function clearBuyDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.warn('[BUY_DRAFT] Failed to clear draft:', error);
  }
}

/**
 * Check if draft exists and is valid
 */
export function hasValidDraft(): boolean {
  return loadBuyDraft() !== null;
}
