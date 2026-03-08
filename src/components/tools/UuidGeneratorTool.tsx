import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UuidGeneratorTool = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState("5");

  const generate = () => {
    const n = Math.max(1, Math.min(100, parseInt(count) || 1));
    setUuids(Array.from({ length: n }, () => crypto.randomUUID()));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1"><label className="text-sm font-medium mb-1 block">Count</label><Input type="number" value={count} onChange={e => setCount(e.target.value)} min={1} max={100} /></div>
        <Button onClick={generate}>Generate</Button>
      </div>
      {uuids.length > 0 && (
        <div className="space-y-1">
          {uuids.map((u, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-muted p-2">
              <code className="flex-1 text-xs font-mono">{u}</code>
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(u)}>Copy</Button>
            </div>
          ))}
          <Button onClick={() => navigator.clipboard.writeText(uuids.join("\n"))} variant="outline" className="w-full mt-2">Copy All</Button>
        </div>
      )}
    </div>
  );
};

export default UuidGeneratorTool;
