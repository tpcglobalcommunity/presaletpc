export const ORDER_RULES = {
  MIN_TPC_ORDER: 1_000,
  MIN_USD_ORDER: 10,
} as const;

export type OrderRuleKey = keyof typeof ORDER_RULES;

export function formatOrderMessage(rule: OrderRuleKey, value: number): string {
  switch (rule) {
    case 'MIN_TPC_ORDER':
      return `Minimal pembelian ${value.toLocaleString('id-ID')} TPC.`;
    case 'MIN_USD_ORDER':
      return `Minimal pembelian setara ${value} USDC.`;
    default:
      return '';
  }
}
