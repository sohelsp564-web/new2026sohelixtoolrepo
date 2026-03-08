import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const InterestCalculatorTool = () => {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("3");

  const p = parseFloat(principal) || 0, r = parseFloat(rate) || 0, t = parseFloat(years) || 0;
  const simple = p * r * t / 100;
  const compound = p * Math.pow(1 + r / 100, t) - p;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Principal</label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Rate (%/yr)</label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Time (years)</label><Input type="number" value={years} onChange={e => setYears(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Simple Interest</div>
          <div className="text-xl font-bold text-primary">{simple.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Total: {(p + simple).toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-muted p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Compound Interest</div>
          <div className="text-xl font-bold text-primary">{compound.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Total: {(p + compound).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculatorTool;
