// Presale Configuration - SINGLE SOURCE OF TRUTH
export const PRESALE = {
  timezone: 'Asia/Singapore',
  durationMonths: 6,
  startAtSgIso: '2026-02-07T10:30:00+08:00', // COMMITTED: Today at 10:30 AM Singapore time
  stage1: {
    priceUsd: 0.001,
    supply: 200_000_000
  },
  stage2: {
    priceUsd: 0.002,
    supply: 100_000_000
  },
  listingReferenceUsd: 0.005,
  totalPresaleSupply: 300_000_000
} as const;
