import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RandomPickerTool = () => {
  const [input, setInput] = useState("");
  const [count, setCount] = useState("1");
  const [results, setResults] = useState<string[]>([]);

  const pick = () => {
    const items = input.split("\n").map(l => l.trim()).filter(Boolean);
    if (items.length === 0) return;
    const n = Math.max(1, Math.min(items.length, parseInt(count) || 1));
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const j = arr[0] % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setResults(shuffled.slice(0, n));
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter items, one per line..." value={input} onChange={e => setInput(e.target.value)} rows={6} />
      <div><label className="text-sm font-medium mb-1 block">Pick how many?</label><Input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" /></div>
      <Button onClick={pick} className="w-full h-11 rounded-xl">Pick Random</Button>
      {results.length > 0 && (
        <div className="text-center space-y-3">
          {results.map((r, i) => (
            <div key={i} className="rounded-2xl bg-primary/10 border border-primary/20 p-4">
              <span className="text-xl font-bold text-primary" style={{ fontFamily: "Space Grotesk" }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RandomPickerTool;
