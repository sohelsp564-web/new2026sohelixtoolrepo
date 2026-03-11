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
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", locale: "en-CA" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", locale: "en-AU" },
];

// Approximate static rates (base: USD). For a real app, use an API.
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
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

// Denomination notes/coins per currency
export const DENOMINATIONS: Record<string, number[]> = {
  USD: [100, 50, 20, 10, 5, 2, 1],
  INR: [500, 200, 100, 50, 20, 10, 5, 2, 1],
  EUR: [500, 200, 100, 50, 20, 10, 5, 2, 1],
  GBP: [50, 20, 10, 5, 2, 1],
  JPY: [10000, 5000, 1000, 500, 100, 50, 10, 5, 1],
  CAD: [100, 50, 20, 10, 5, 2, 1],
  AUD: [100, 50, 20, 10, 5, 2, 1],
};

// Number to words (supports up to trillions)
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const SCALES = ["", "Thousand", "Million", "Billion", "Trillion"];

function chunkToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  return ONES[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + chunkToWords(n % 100) : "");
}

const CURRENCY_WORD: Record<string, [string, string]> = {
  USD: ["Dollar", "Dollars"],
  INR: ["Rupee", "Rupees"],
  EUR: ["Euro", "Euros"],
  GBP: ["Pound", "Pounds"],
  JPY: ["Yen", "Yen"],
  CAD: ["Dollar", "Dollars"],
  AUD: ["Dollar", "Dollars"],
};

export function amountToWords(amount: number, currencyCode: string): string {
  const val = Math.floor(Math.abs(amount));
  if (val === 0) return "Zero " + (CURRENCY_WORD[currencyCode]?.[1] || "");
  const chunks: number[] = [];
  let n = val;
  while (n > 0) { chunks.push(n % 1000); n = Math.floor(n / 1000); }
  const parts = chunks.map((c, i) => c ? chunkToWords(c) + (SCALES[i] ? " " + SCALES[i] : "") : "").filter(Boolean).reverse();
  const word = parts.join(" ");
  const cw = CURRENCY_WORD[currencyCode] || ["", ""];
  return word + " " + (val === 1 ? cw[0] : cw[1]);
}
