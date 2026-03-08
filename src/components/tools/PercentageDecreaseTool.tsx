import { useState } from "react";
import { Input } from "@/components/ui/input";

const PercentageDecreaseTool = () => {
  const [original, setOriginal] = useState("");
  const [percent, setPercent] = useState("");

  const origN = parseFloat(original);
  const pctN = parseFloat(percent);
  const valid = !isNaN(origN) && !isNaN(pctN);
  const decrease = valid ? origN * (pctN / 100) : 0;
  const result = valid ? origN - decrease : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Original Value</label><Input type="number" value={original} onChange={e => setOriginal(e.target.value)} placeholder="200" /></div>
        <div><label className="text-sm font-medium mb-1 block">Decrease %</label><Input type="number" value={percent} onChange={e => setPercent(e.target.value)} placeholder="25" /></div>
      </div>
      {valid && (
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Original", origN.toFixed(2)],
            ["Decrease", decrease.toFixed(2)],
            ["Result", result.toFixed(2)],
          ].map(([label, val]) => (
            <div key={label} className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xl font-bold text-primary">{val}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PercentageDecreaseTool;
