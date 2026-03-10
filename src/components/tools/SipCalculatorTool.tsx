import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURRENCIES, formatCurrency, getCurrencySymbol } from "@/lib/currencyUtils";
import { exportCSV, exportPDF, copyToClipboard } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Copy, RotateCcw, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { usePerformance } from "@/hooks/usePerformance";

type DurUnit = "years" | "months" | "days";

const SipCalculatorTool = () => {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [duration, setDuration] = useState("10");
  const [durUnit, setDurUnit] = useState<DurUnit>("years");
  const [currency, setCurrency] = useState("INR");
  const [result, setResult] = useState<{ invested: number; returns: number; total: number; yearly: { year: number; invested: number; value: number }[] } | null>(null);
  const [error, setError] = useState("");
  const { measure } = usePerformance("SIP Calculator");

  const getMonths = () => {
    const d = parseFloat(duration) || 0;
    if (durUnit === "years") return Math.round(d * 12);
    if (durUnit === "days") return Math.round(d / 30);
    return Math.round(d);
  };

  const calculate = async () => {
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const months = getMonths();
    if (!m || m <= 0) { setError("Enter a valid monthly investment"); setResult(null); return; }
    if (!r || r <= 0) { setError("Enter a valid rate"); setResult(null); return; }
    if (!months || months <= 0) { setError("Enter a valid duration"); setResult(null); return; }
    setError("");

    await measure(() => {
      const monthlyRate = r / 12 / 100;
      const total = m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const invested = m * months;
      const returns = total - invested;

      const yearly: { year: number; invested: number; value: number }[] = [];
      const totalYears = Math.ceil(months / 12);
      for (let y = 1; y <= totalYears; y++) {
        const n = Math.min(y * 12, months);
        const val = m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
        yearly.push({ year: y, invested: m * n, value: Math.round(val) });
      }

      setResult({ invested, returns, total, yearly });
    });
  };

  const reset = () => { setMonthly("5000"); setRate("12"); setDuration("10"); setDurUnit("years"); setResult(null); setError(""); };
  const sym = getCurrencySymbol(currency);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Monthly Investment</label>
          <Input type="number" min="1" value={monthly} onChange={e => { setMonthly(e.target.value); setResult(null); }} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Currency</label>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={currency} onChange={e => setCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Expected Return Rate (% p.a.)</label>
        <Input type="number" min="0.1" step="0.1" value={rate} onChange={e => { setRate(e.target.value); setResult(null); }} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Duration</label>
        <div className="flex gap-2">
          <Input type="number" min="1" value={duration} onChange={e => { setDuration(e.target.value); setResult(null); }} className="flex-1" />
          <div className="flex gap-1">
            {(["years", "months", "days"] as DurUnit[]).map(u => (
              <button key={u} onClick={() => { setDurUnit(u); setResult(null); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize ${durUnit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{u}</button>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>

      <Button className="w-full" onClick={calculate}>Calculate SIP Returns</Button>

      {result && (
        <div id="sip-result" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Invested</div>
              <div className="text-lg font-bold text-foreground">{formatCurrency(result.invested, currency)}</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Returns</div>
              <div className="text-lg font-bold text-primary">{formatCurrency(result.returns, currency)}</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Value</div>
              <div className="text-lg font-bold text-primary">{formatCurrency(result.total, currency)}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold mb-3">Investment vs Returns</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={result.yearly}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} className="text-xs" />
                <YAxis tickFormatter={v => `${sym}${(v / 1000).toFixed(0)}K`} className="text-xs" />
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                <Legend />
                <Bar dataKey="invested" name="Invested" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value" name="Total Value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted"><th className="text-left px-3 py-2">Year</th><th className="text-right px-3 py-2">Invested</th><th className="text-right px-3 py-2">Value</th><th className="text-right px-3 py-2">Returns</th></tr></thead>
              <tbody>
                {result.yearly.map(y => (
                  <tr key={y.year} className="border-t border-border">
                    <td className="px-3 py-2">{y.year}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(y.invested, currency)}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(y.value, currency)}</td>
                    <td className="px-3 py-2 text-right text-primary">{formatCurrency(y.value - y.invested, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(`Invested: ${formatCurrency(result.invested, currency)}\nReturns: ${formatCurrency(result.returns, currency)}\nTotal: ${formatCurrency(result.total, currency)}`); toast.success("Copied!"); }}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Reset</Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("SIP Calculator Results", [
              { label: "Monthly Investment", value: formatCurrency(parseFloat(monthly), currency) },
              { label: "Rate", value: `${rate}% p.a.` },
              { label: "Duration", value: `${duration} ${durUnit}` },
              { label: "Total Invested", value: formatCurrency(result.invested, currency) },
              { label: "Returns", value: formatCurrency(result.returns, currency) },
              { label: "Total Value", value: formatCurrency(result.total, currency) },
            ], "sip-calculation")}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(
              ["Year", "Invested", "Value", "Returns"],
              result.yearly.map(y => [y.year, y.invested.toFixed(2), y.value.toFixed(2), (y.value - y.invested).toFixed(2)]),
              "sip-calculation"
            )}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SipCalculatorTool;
