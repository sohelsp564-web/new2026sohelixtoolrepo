import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TipCalculatorTool = () => {
  const [bill, setBill] = useState("100");
  const [tipPct, setTipPct] = useState("15");
  const [people, setPeople] = useState("1");

  const b = parseFloat(bill) || 0, t = parseFloat(tipPct) || 0, p = parseInt(people) || 1;
  const tip = b * t / 100;
  const total = b + tip;
  const perPerson = total / p;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Bill Amount</label><Input type="number" value={bill} onChange={e => setBill(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Tip (%)</label><Input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Split Between</label><Input type="number" value={people} onChange={e => setPeople(e.target.value)} min={1} /></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[10, 15, 18, 20, 25].map(v => <Button key={v} variant={tipPct === String(v) ? "default" : "outline"} size="sm" onClick={() => setTipPct(String(v))}>{v}%</Button>)}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[["Tip", tip.toFixed(2)], ["Total", total.toFixed(2)], ["Per Person", perPerson.toFixed(2)]].map(([l, v]) => (
          <div key={l as string} className="rounded-lg bg-muted p-4 text-center">
            <div className="text-xl font-bold text-primary">${v}</div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipCalculatorTool;
