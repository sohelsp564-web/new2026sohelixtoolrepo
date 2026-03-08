import { useState } from "react";
import { Input } from "@/components/ui/input";

const ProfitMarginTool = () => {
  const [cost, setCost] = useState("50");
  const [revenue, setRevenue] = useState("100");

  const c = parseFloat(cost) || 0, r = parseFloat(revenue) || 0;
  const profit = r - c;
  const margin = r ? (profit / r) * 100 : 0;
  const markup = c ? (profit / c) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Cost</label><Input type="number" value={cost} onChange={e => setCost(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Revenue</label><Input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[["Profit", profit.toFixed(2)], ["Margin", `${margin.toFixed(1)}%`], ["Markup", `${markup.toFixed(1)}%`]].map(([l, v]) => (
          <div key={l as string} className="rounded-lg bg-muted p-4 text-center">
            <div className="text-xl font-bold text-primary">{v}</div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfitMarginTool;
