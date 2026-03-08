import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const CssMinifierTool = () => {
  const [input, setInput] = useState("");
  const minified = input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

  const saved = input.length > 0 ? Math.round((1 - minified.length / input.length) * 100) : 0;
  const copy = () => { navigator.clipboard.writeText(minified); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste CSS code here..." value={input} onChange={e => setInput(e.target.value)} rows={8} className="font-mono text-sm" />
      {input && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[["Original", `${input.length} chars`], ["Minified", `${minified.length} chars`], ["Saved", `${saved}%`]].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-muted p-3 text-center">
                <div className="text-lg font-bold text-primary">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Minified CSS</p>
              <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={copy}><Copy className="h-3 w-3" /> Copy</Button>
            </div>
            <pre className="text-sm overflow-auto max-h-48 whitespace-pre-wrap font-mono break-all">{minified}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default CssMinifierTool;
