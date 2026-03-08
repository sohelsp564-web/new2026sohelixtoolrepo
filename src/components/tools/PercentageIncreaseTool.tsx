import { useState } from "react";
import { Input } from "@/components/ui/input";

const PercentageIncreaseTool = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fromN = parseFloat(from);
  const toN = parseFloat(to);
  const valid = !isNaN(fromN) && !isNaN(toN) && fromN !== 0;
  const increase = valid ? ((toN - fromN) / Math.abs(fromN)) * 100 : 0;
  const diff = valid ? toN - fromN : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">From Value</label><Input type="number" value={from} onChange={e => setFrom(e.target.value)} placeholder="100" /></div>
        <div><label className="text-sm font-medium mb-1 block">To Value</label><Input type="number" value={to} onChange={e => setTo(e.target.value)} placeholder="150" /></div>
      </div>
      {valid && (
        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${increase >= 0 ? "text-green-600" : "text-destructive"}`} style={{ fontFamily: "Space Grotesk" }}>
              {increase >= 0 ? "+" : ""}{increase.toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {increase >= 0 ? "Increase" : "Decrease"} of <strong>{Math.abs(diff).toFixed(2)}</strong> from <strong>{fromN}</strong> to <strong>{toN}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PercentageIncreaseTool;
