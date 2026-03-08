import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const TextReverseTool = () => {
  const [text, setText] = useState("");
  const reversed = text.split("").reverse().join("");
  const wordReversed = text.split(/\s+/).reverse().join(" ");

  const copy = (val: string) => { navigator.clipboard.writeText(val); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Type or paste your text here..." value={text} onChange={e => setText(e.target.value)} rows={6} />
      {text && (
        <div className="space-y-3">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reversed Characters</p>
              <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => copy(reversed)}><Copy className="h-3 w-3" /> Copy</Button>
            </div>
            <p className="text-sm break-all">{reversed}</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reversed Words</p>
              <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => copy(wordReversed)}><Copy className="h-3 w-3" /> Copy</Button>
            </div>
            <p className="text-sm break-all">{wordReversed}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextReverseTool;
