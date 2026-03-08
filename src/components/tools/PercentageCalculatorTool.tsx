import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PercentageCalculatorTool = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const pOfV = a && b ? (parseFloat(a) / 100) * parseFloat(b) : null;
  const whatP = a && b ? (parseFloat(a) / parseFloat(b)) * 100 : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Value A</label><Input type="number" value={a} onChange={e => setA(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Value B</label><Input type="number" value={b} onChange={e => setB(e.target.value)} /></div>
      </div>
      {a && b && (
        <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
          <p><strong>{a}%</strong> of <strong>{b}</strong> = <span className="text-primary font-bold">{pOfV?.toFixed(2)}</span></p>
          <p><strong>{a}</strong> is <span className="text-primary font-bold">{whatP?.toFixed(2)}%</span> of <strong>{b}</strong></p>
        </div>
      )}
    </div>
  );
};

export default PercentageCalculatorTool;
