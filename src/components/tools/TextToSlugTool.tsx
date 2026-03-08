import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const TextToSlugTool = () => {
  const [text, setText] = useState("");
  const slug = text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const copy = () => { navigator.clipboard.writeText(slug); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter text to convert to slug..." value={text} onChange={e => setText(e.target.value)} rows={3} />
      {text && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated Slug</p>
            <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={copy}><Copy className="h-3 w-3" /> Copy</Button>
          </div>
          <p className="text-lg font-mono text-primary break-all">{slug}</p>
        </div>
      )}
    </div>
  );
};

export default TextToSlugTool;
