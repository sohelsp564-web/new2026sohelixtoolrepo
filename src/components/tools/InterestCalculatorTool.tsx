import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

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
  const [years, setYears] = useState("3");
  const [freq, setFreq] = useState(12);

  const p = parseFloat(principal) || 0, r = parseFloat(rate) || 0, t = parseFloat(years) || 0;
  const simple = p * r * t / 100;
  const compound = p * Math.pow(1 + r / (100 * freq), freq * t) - p;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Principal</label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Rate (%/yr)</label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Time (years)</label><Input type="number" value={years} onChange={e => setYears(e.target.value)} /></div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Compounding Frequency</label>
        <div className="flex flex-wrap gap-2">
          {frequencies.map(f => (
            <button
              key={f.value}
              onClick={() => setFreq(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${freq === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Simple Interest</div>
          <div className="text-xl font-bold text-primary">${simple.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Total: ${(p + simple).toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-muted p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Compound Interest</div>
          <div className="text-xl font-bold text-primary">${compound.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Total: ${(p + compound).toFixed(2)}</div>
        </div>
      </div>

      {/* Example Calculation */}
      <div className="rounded-lg border border-dashed border-border p-4">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">📌 Example Calculation</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Principal:</span> $10,000</p>
          <p><span className="font-medium text-foreground">Rate:</span> 5% per year</p>
          <p><span className="font-medium text-foreground">Time:</span> 3 years (compounded monthly)</p>
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            <p><span className="font-medium text-foreground">Simple Interest:</span> $1,500.00</p>
            <p><span className="font-medium text-foreground">Compound Interest:</span> $1,614.72</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculatorTool;
