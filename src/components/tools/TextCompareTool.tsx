import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const TextCompareTool = () => {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const maxLines = Math.max(linesA.length, linesB.length);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Original Text</label>
          <Textarea placeholder="Paste original text..." value={textA} onChange={e => setTextA(e.target.value)} rows={8} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Modified Text</label>
          <Textarea placeholder="Paste modified text..." value={textB} onChange={e => setTextB(e.target.value)} rows={8} />
        </div>
      </div>
      {(textA || textB) && (
        <div className="rounded-lg bg-muted p-4 space-y-0.5 font-mono text-sm max-h-80 overflow-y-auto">
          {Array.from({ length: maxLines }).map((_, i) => {
            const a = linesA[i] ?? "";
            const b = linesB[i] ?? "";
            const same = a === b;
            return (
              <div key={i} className={`flex gap-2 px-2 py-0.5 rounded ${same ? "" : "bg-destructive/10"}`}>
                <span className="text-muted-foreground w-6 text-right shrink-0">{i + 1}</span>
                <span className={same ? "text-foreground" : "text-destructive"}>{b || (a ? <span className="line-through opacity-50">{a}</span> : "\u00A0")}</span>
              </div>
            );
          })}
        </div>
      )}
      {textA && textB && (
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Total Lines", maxLines],
            ["Changed", Array.from({ length: maxLines }).filter((_, i) => (linesA[i] ?? "") !== (linesB[i] ?? "")).length],
            ["Unchanged", Array.from({ length: maxLines }).filter((_, i) => (linesA[i] ?? "") === (linesB[i] ?? "")).length],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold text-primary">{val}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextCompareTool;
