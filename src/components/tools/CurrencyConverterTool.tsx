import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURRENCIES, EXCHANGE_RATES, convertCurrency, formatCurrency } from "@/lib/currencyUtils";
import { exportCSV, exportPDF, copyToClipboard } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Copy, RotateCcw, Download, ArrowRightLeft } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

const CurrencyConverterTool = () => {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { measure } = usePerformance("Currency Converter");

  const calculate = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError("Enter a valid positive amount"); setResult(null); return; }
    setError("");
    await measure(() => {
      setResult(convertCurrency(val, from, to));
    });
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); };
  const reset = () => { setAmount("1000"); setFrom("USD"); setTo("INR"); setResult(null); setError(""); };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Amount</label>
        <Input type="number" min="0" value={amount} onChange={e => { setAmount(e.target.value); setResult(null); }} placeholder="Enter amount" />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
        <div>
          <label className="text-sm font-medium mb-1 block">From</label>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={from} onChange={e => { setFrom(e.target.value); setResult(null); }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <Button variant="ghost" size="icon" onClick={swap} className="mb-0.5"><ArrowRightLeft className="h-4 w-4" /></Button>
        <div>
          <label className="text-sm font-medium mb-1 block">To</label>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={to} onChange={e => { setTo(e.target.value); setResult(null); }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
          </select>
        </div>
      </div>

      <Button className="w-full" onClick={calculate}>Convert</Button>

      {result !== null && (
        <div id="currency-result" className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">Converted Amount</div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(result, to)}</div>
            <div className="text-xs text-muted-foreground mt-1">{formatCurrency(parseFloat(amount), from)} = {formatCurrency(result, to)}</div>
          </div>

          {/* All rates table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted"><th className="text-left px-3 py-2">Currency</th><th className="text-right px-3 py-2">Value</th></tr></thead>
              <tbody>
                {CURRENCIES.filter(c => c.code !== from).map(c => (
                  <tr key={c.code} className="border-t border-border">
                    <td className="px-3 py-2">{c.code} — {c.name}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(convertCurrency(parseFloat(amount), from, c.code), c.code)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground text-center">⚠️ Rates are approximate and for reference only.</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(formatCurrency(result, to)); toast.success("Copied!"); }}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Reset</Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("Currency Conversion", [
              { label: "Amount", value: formatCurrency(parseFloat(amount), from) },
              { label: "Converted", value: formatCurrency(result, to) },
              { label: "Rate", value: `1 ${from} = ${(EXCHANGE_RATES[to] / EXCHANGE_RATES[from]).toFixed(4)} ${to}` },
            ], "currency-conversion")}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(
              ["From", "To", "Amount", "Result"],
              [[from, to, amount, result.toFixed(2)]],
              "currency-conversion"
            )}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverterTool;
