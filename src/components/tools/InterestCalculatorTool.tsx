import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURRENCIES, formatCurrency, getCurrencySymbol } from "@/lib/currencyUtils";
import { exportCSV, exportPDF, copyToClipboard } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Copy, RotateCcw, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type DurUnit = "years" | "months" | "days";

const frequencies = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

const InterestCalculatorTool = () => {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [duration, setDuration] = useState("3");
  const [durUnit, setDurUnit] = useState<DurUnit>("years");
  const [freq, setFreq] = useState(12);
  const [currency, setCurrency] = useState("USD");
  const [calculated, setCalculated] = useState(false);

  const getYears = () => {
    const d = parseFloat(duration) || 0;
    if (durUnit === "months") return d / 12;
    if (durUnit === "days") return d / 365;
    return d;
  };

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const t = getYears();
  const simple = p * r * t / 100;
  const compound = p * Math.pow(1 + r / (100 * freq), freq * t) - p;

  const chartData = calculated && t > 0 ? Array.from({ length: Math.ceil(t) + 1 }, (_, i) => {
    const yr = Math.min(i, t);
    return {
      year: i,
      simple: Math.round(p + p * r * yr / 100),
      compound: Math.round(p * Math.pow(1 + r / (100 * freq), freq * yr)),
    };
  }) : [];

  const sym = getCurrencySymbol(currency);

  const calculate = () => {
    if (p <= 0 || r <= 0 || t <= 0) return;
    setCalculated(true);
  };

  const reset = () => {
    setPrincipal("10000"); setRate("5"); setDuration("3"); setDurUnit("years"); setFreq(12); setCalculated(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Principal</label><Input type="number" min="1" value={principal} onChange={e => { setPrincipal(e.target.value); setCalculated(false); }} /></div>
        <div>
          <label className="text-sm font-medium mb-1 block">Currency</label>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={currency} onChange={e => setCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>)}
          </select>
        </div>
      </div>
      <div><label className="text-sm font-medium mb-1 block">Rate (%/yr)</label><Input type="number" min="0.1" step="0.1" value={rate} onChange={e => { setRate(e.target.value); setCalculated(false); }} /></div>
      <div>
        <label className="text-sm font-medium mb-1 block">Duration</label>
        <div className="flex gap-2">
          <Input type="number" min="1" value={duration} onChange={e => { setDuration(e.target.value); setCalculated(false); }} className="flex-1" />
          <div className="flex gap-1">
            {(["years", "months", "days"] as DurUnit[]).map(u => (
              <button key={u} onClick={() => { setDurUnit(u); setCalculated(false); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize ${durUnit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{u}</button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Compounding Frequency</label>
        <div className="flex flex-wrap gap-2">
          {frequencies.map(f => (
            <button key={f.value} onClick={() => { setFreq(f.value); setCalculated(false); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${freq === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >{f.label}</button>
          ))}
        </div>
      </div>
      <Button className="w-full" onClick={calculate}>Calculate Interest</Button>

      {calculated && (
        <div id="interest-result" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">Simple Interest</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(simple, currency)}</div>
              <div className="text-xs text-muted-foreground">Total: {formatCurrency(p + simple, currency)}</div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">Compound Interest</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(compound, currency)}</div>
              <div className="text-xs text-muted-foreground">Total: {formatCurrency(p + compound, currency)}</div>
            </div>
          </div>

          {chartData.length > 1 && (
            <div className="rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold mb-3">Investment Growth</h4>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} className="text-xs" />
                  <YAxis tickFormatter={v => `${sym}${(v / 1000).toFixed(0)}K`} className="text-xs" />
                  <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                  <Legend />
                  <Line type="monotone" dataKey="simple" name="Simple" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="compound" name="Compound" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(`Simple: ${formatCurrency(simple, currency)}\nCompound: ${formatCurrency(compound, currency)}`); toast.success("Copied!"); }}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Reset</Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("Interest Calculator Results", [
              { label: "Principal", value: formatCurrency(p, currency) },
              { label: "Rate", value: `${rate}% p.a.` },
              { label: "Duration", value: `${duration} ${durUnit}` },
              { label: "Simple Interest", value: formatCurrency(simple, currency) },
              { label: "Compound Interest", value: formatCurrency(compound, currency) },
            ], "interest-calculation")}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(
              ["Type", "Interest", "Total"],
              [["Simple", simple.toFixed(2), (p + simple).toFixed(2)], ["Compound", compound.toFixed(2), (p + compound).toFixed(2)]],
              "interest-calculation"
            )}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestCalculatorTool;
