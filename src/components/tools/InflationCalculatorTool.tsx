import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURRENCIES, formatCurrency, getCurrencySymbol } from "@/lib/currencyUtils";
import { exportCSV, exportPDF, copyToClipboard } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Copy, RotateCcw, Download } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { usePerformance } from "@/hooks/usePerformance";

type DurUnit = "years" | "months" | "days";

const InflationCalculatorTool = () => {
  const [amount, setAmount] = useState("100000");
  const [inflationRate, setInflationRate] = useState("6");
  const [duration, setDuration] = useState("10");
  const [durUnit, setDurUnit] = useState<DurUnit>("years");
  const [currency, setCurrency] = useState("INR");
  const [result, setResult] = useState<{ futureValue: number; purchasingPower: number; lostValue: number; yearly: { year: number; present: number; future: number }[] } | null>(null);
  const [error, setError] = useState("");
  const { measure } = usePerformance("Inflation Calculator");

  const getYears = () => {
    const d = parseFloat(duration) || 0;
    if (durUnit === "months") return d / 12;
    if (durUnit === "days") return d / 365;
    return d;
  };

  const calculate = async () => {
    const a = parseFloat(amount);
    const r = parseFloat(inflationRate);
    const years = getYears();
    if (!a || a <= 0) { setError("Enter a valid positive amount"); setResult(null); return; }
    if (!r || r <= 0 || r >= 100) { setError("Enter a valid inflation rate (0-100)"); setResult(null); return; }
    if (!years || years <= 0) { setError("Enter a valid duration"); setResult(null); return; }
    setError("");

    await measure(() => {
      const futureValue = a * Math.pow(1 + r / 100, years);
      const purchasingPower = a / Math.pow(1 + r / 100, years);
      const lostValue = a - purchasingPower;

      const totalYears = Math.ceil(years);
      const yearly: { year: number; present: number; future: number }[] = [];
      for (let y = 0; y <= totalYears; y++) {
        yearly.push({
          year: y,
          present: Math.round(a / Math.pow(1 + r / 100, y)),
          future: Math.round(a * Math.pow(1 + r / 100, y)),
        });
      }

      setResult({ futureValue, purchasingPower, lostValue, yearly });
    });
  };

  const reset = () => { setAmount("100000"); setInflationRate("6"); setDuration("10"); setDurUnit("years"); setResult(null); setError(""); };
  const sym = getCurrencySymbol(currency);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Current Amount</label>
          <Input type="number" min="1" value={amount} onChange={e => { setAmount(e.target.value); setResult(null); }} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Currency</label>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={currency} onChange={e => setCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Inflation Rate (% per year)</label>
        <Input type="number" min="0.1" step="0.1" value={inflationRate} onChange={e => { setInflationRate(e.target.value); setResult(null); }} />
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

      <Button className="w-full" onClick={calculate}>Calculate Inflation Impact</Button>

      {result && (
        <div id="inflation-result" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Future Cost</div>
              <div className="text-lg font-bold text-destructive">{formatCurrency(result.futureValue, currency)}</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Purchasing Power</div>
              <div className="text-lg font-bold text-primary">{formatCurrency(result.purchasingPower, currency)}</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Value Lost</div>
              <div className="text-lg font-bold text-destructive">{formatCurrency(result.lostValue, currency)}</div>
            </div>
          </div>

          {/* Bar Chart: Present vs Future */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold mb-3">Present Value vs Future Cost</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={result.yearly}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} className="text-xs" />
                <YAxis tickFormatter={v => `${sym}${(v / 1000).toFixed(0)}K`} className="text-xs" />
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                <Legend />
                <Bar dataKey="present" name="Purchasing Power" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="future" name="Future Cost" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold mb-3">Inflation Impact Over Time</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={result.yearly}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" className="text-xs" />
                <YAxis tickFormatter={v => `${sym}${(v / 1000).toFixed(0)}K`} className="text-xs" />
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                <Legend />
                <Line type="monotone" dataKey="present" name="Purchasing Power" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="future" name="Future Cost" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted"><th className="text-left px-3 py-2">Year</th><th className="text-right px-3 py-2">Purchasing Power</th><th className="text-right px-3 py-2">Future Cost</th></tr></thead>
              <tbody>
                {result.yearly.map(y => (
                  <tr key={y.year} className="border-t border-border">
                    <td className="px-3 py-2">{y.year}</td>
                    <td className="px-3 py-2 text-right">{formatCurrency(y.present, currency)}</td>
                    <td className="px-3 py-2 text-right font-medium text-destructive">{formatCurrency(y.future, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(`Current: ${formatCurrency(parseFloat(amount), currency)}\nFuture Cost: ${formatCurrency(result.futureValue, currency)}\nPurchasing Power: ${formatCurrency(result.purchasingPower, currency)}`); toast.success("Copied!"); }}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Reset</Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("Inflation Calculator Results", [
              { label: "Current Amount", value: formatCurrency(parseFloat(amount), currency) },
              { label: "Inflation Rate", value: `${inflationRate}% p.a.` },
              { label: "Duration", value: `${duration} ${durUnit}` },
              { label: "Future Cost", value: formatCurrency(result.futureValue, currency) },
              { label: "Purchasing Power", value: formatCurrency(result.purchasingPower, currency) },
              { label: "Value Lost", value: formatCurrency(result.lostValue, currency) },
            ], "inflation-calculation")}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(
              ["Year", "Purchasing Power", "Future Cost"],
              result.yearly.map(y => [y.year, y.present.toFixed(2), y.future.toFixed(2)]),
              "inflation-calculation"
            )}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InflationCalculatorTool;
