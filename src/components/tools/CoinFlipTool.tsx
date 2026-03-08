import { useState } from "react";
import { Button } from "@/components/ui/button";

const CoinFlipTool = () => {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [history, setHistory] = useState<("H" | "T")[]>([]);

  const flip = () => {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const r = arr[0] % 2 === 0 ? "heads" : "tails";
    setResult(r);
    setHistory(prev => [...prev, r === "heads" ? "H" : "T"]);
  };

  const heads = history.filter(h => h === "H").length;
  const tails = history.filter(h => h === "T").length;

  return (
    <div className="space-y-4">
      <Button onClick={flip} className="w-full h-14 rounded-xl text-lg">Flip Coin</Button>
      {result && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-primary-foreground" style={{ fontFamily: "Space Grotesk" }}>
                {result === "heads" ? "H" : "T"}
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold capitalize" style={{ fontFamily: "Space Grotesk" }}>{result}</p>
        </div>
      )}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold text-primary">{heads}</div>
              <div className="text-xs text-muted-foreground">Heads ({history.length > 0 ? Math.round((heads / history.length) * 100) : 0}%)</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold text-primary">{tails}</div>
              <div className="text-xs text-muted-foreground">Tails ({history.length > 0 ? Math.round((tails / history.length) * 100) : 0}%)</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {history.map((h, i) => (
              <span key={i} className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${h === "H" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{h}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinFlipTool;
