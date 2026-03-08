import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dices } from "lucide-react";

const DiceRollerTool = () => {
  const [sides, setSides] = useState("6");
  const [count, setCount] = useState("1");
  const [results, setResults] = useState<number[]>([]);

  const roll = () => {
    const s = parseInt(sides) || 6;
    const c = Math.max(1, Math.min(20, parseInt(count) || 1));
    const arr = new Uint32Array(c);
    crypto.getRandomValues(arr);
    setResults(Array.from(arr).map(v => (v % s) + 1));
  };

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Sides</label><Input type="number" value={sides} onChange={e => setSides(e.target.value)} min="2" max="100" /></div>
        <div><label className="text-sm font-medium mb-1 block">Number of Dice</label><Input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="20" /></div>
      </div>
      <Button onClick={roll} className="w-full h-12 rounded-xl gap-2 text-lg"><Dices className="h-5 w-5" /> Roll</Button>
      {results.length > 0 && (
        <div className="text-center space-y-3">
          <div className="flex flex-wrap justify-center gap-3">
            {results.map((r, i) => (
              <div key={i} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-md" style={{ fontFamily: "Space Grotesk" }}>{r}</div>
            ))}
          </div>
          {results.length > 1 && (
            <div className="rounded-lg bg-muted p-3">
              <span className="text-muted-foreground text-sm">Total: </span>
              <span className="text-2xl font-bold text-primary" style={{ fontFamily: "Space Grotesk" }}>{total}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiceRollerTool;
