import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const RegexTesterTool = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("");

  const matches = useMemo(() => {
    if (!pattern || !text) return [];
    try {
      const re = new RegExp(pattern, flags);
      return Array.from(text.matchAll(re)).map(m => ({ match: m[0], index: m.index ?? 0 }));
    } catch { return []; }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1"><label className="text-sm font-medium mb-1 block">Pattern</label><Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="e.g. \\d+" className="font-mono" /></div>
        <div className="w-20"><label className="text-sm font-medium mb-1 block">Flags</label><Input value={flags} onChange={e => setFlags(e.target.value)} className="font-mono" /></div>
      </div>
      <Textarea placeholder="Enter test string..." value={text} onChange={e => setText(e.target.value)} rows={5} />
      <div className="rounded-lg bg-muted p-3">
        <p className="text-sm font-medium mb-2">{matches.length} match(es) found</p>
        {matches.length > 0 && (
          <div className="space-y-1">
            {matches.slice(0, 50).map((m, i) => (
              <div key={i} className="text-xs font-mono"><span className="text-muted-foreground">#{i + 1} at {m.index}:</span> <span className="text-primary font-bold">{m.match}</span></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegexTesterTool;
