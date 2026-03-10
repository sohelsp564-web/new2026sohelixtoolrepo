export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", locale: "en-IN" },
  { code: "EUR", name: "Euro", symbol: "€", locale: "de-DE" },
  { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
];

// Approximate static rates (base: USD). For a real app, use an API.
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
};

export function convertCurrency(amount: number, from: string, to: string): number {
  const inUsd = amount / EXCHANGE_RATES[from];
  return inUsd * EXCHANGE_RATES[to];
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const c = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
    minimumFractionDigits: c.code === "JPY" ? 0 : 2,
    maximumFractionDigits: c.code === "JPY" ? 0 : 2,
  }).format(amount);
}

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find(c => c.code === code)?.symbol || "$";
}
