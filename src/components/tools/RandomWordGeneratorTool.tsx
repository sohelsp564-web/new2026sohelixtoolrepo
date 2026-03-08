import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const wordList = [
  "apple","river","cloud","storm","light","dream","stone","flame","ocean","forest",
  "shadow","crystal","thunder","breeze","meadow","canyon","glacier","horizon","whisper","ember",
  "velvet","aurora","cascade","prism","nebula","zenith","echo","mirage","pulse","orbit",
  "galaxy","comet","lunar","solar","cosmic","stellar","astral","quantum","photon","vortex",
  "enigma","paradox","cipher","mosaic","spectrum","harmony","melody","rhythm","tempo","chord",
  "voyage","anchor","harbor","compass","beacon","summit","ridge","valley","plateau","delta",
];

const RandomWordGeneratorTool = () => {
  const [count, setCount] = useState("10");
  const [words, setWords] = useState<string[]>([]);

  const generate = () => {
    const n = Math.max(1, Math.min(100, parseInt(count) || 10));
    const result: string[] = [];
    for (let i = 0; i < n; i++) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      result.push(wordList[arr[0] % wordList.length]);
    }
    setWords(result);
  };

  const copy = () => { navigator.clipboard.writeText(words.join(" ")); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Number of Words</label><Input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="100" /></div>
      <Button onClick={generate} className="w-full">Generate Words</Button>
      {words.length > 0 && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated Words</p>
            <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={copy}><Copy className="h-3 w-3" /> Copy</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {words.map((w, i) => <span key={i} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">{w}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomWordGeneratorTool;
