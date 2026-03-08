import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RandomNumberTool = () => {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [result, setResult] = useState<number | null>(null);

  const generate = () => {
    const lo = parseInt(min) || 0, hi = parseInt(max) || 100;
    const arr = new Uint32Array(1); crypto.getRandomValues(arr);
    setResult(lo + (arr[0] % (hi - lo + 1)));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Min</label><Input type="number" value={min} onChange={e => setMin(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Max</label><Input type="number" value={max} onChange={e => setMax(e.target.value)} /></div>
      </div>
      <Button onClick={generate} className="w-full">Generate</Button>
      {result !== null && <div className="text-center rounded-lg bg-muted p-6"><span className="text-4xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk' }}>{result}</span></div>}
    </div>
  );
};

export default RandomNumberTool;
