import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const RandomTextTool = () => {
  const [length, setLength] = useState("32");
  const [result, setResult] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const generate = () => {
    const n = Math.max(1, Math.min(10000, parseInt(length) || 32));
    const arr = new Uint32Array(n);
    crypto.getRandomValues(arr);
    setResult(Array.from(arr, v => chars[v % chars.length]).join(""));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1"><label className="text-sm font-medium mb-1 block">Length</label><Input type="number" value={length} onChange={e => setLength(e.target.value)} /></div>
        <Button onClick={generate}>Generate</Button>
      </div>
      {result && (
        <>
          <Textarea value={result} readOnly rows={4} className="font-mono text-xs" />
          <Button onClick={() => navigator.clipboard.writeText(result)} variant="outline" className="w-full">Copy</Button>
        </>
      )}
    </div>
  );
};

export default RandomTextTool;
