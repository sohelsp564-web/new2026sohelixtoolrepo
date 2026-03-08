import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const RemoveExtraSpacesTool = () => {
  const [text, setText] = useState("");
  const cleaned = text.replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n").split("\n").map(l => l.trim()).join("\n");

  const copy = () => { navigator.clipboard.writeText(cleaned); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste text with extra spaces..." value={text} onChange={e => setText(e.target.value)} rows={6} />
      {text && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold text-primary">{text.length}</div>
              <div className="text-xs text-muted-foreground">Original Length</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold text-primary">{cleaned.length}</div>
              <div className="text-xs text-muted-foreground">Cleaned Length</div>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Result</p>
              <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={copy}><Copy className="h-3 w-3" /> Copy</Button>
            </div>
            <p className="text-sm whitespace-pre-wrap">{cleaned}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default RemoveExtraSpacesTool;
