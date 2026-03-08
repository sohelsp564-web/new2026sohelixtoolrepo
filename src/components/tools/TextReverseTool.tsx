import { useMemo } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TextToolWrapper from "./TextToolWrapper";

const TextReverseTool = () => {
  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    toast.success("Copied!");
  };

  return (
    <TextToolWrapper storageKey="text-reverse" placeholder="Type or paste your text here...">
      {({ text }) => {
        const reversed = useMemo(() => text.split("").reverse().join(""), [text]);
        const wordReversed = useMemo(() => text.split(/\s+/).reverse().join(" "), [text]);

        if (!text) return null;

        return (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reversed Characters</p>
                <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => copy(reversed)}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <p className="text-sm break-all">{reversed}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reversed Words</p>
                <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => copy(wordReversed)}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <p className="text-sm break-all">{wordReversed}</p>
            </div>
          </div>
        );
      }}
    </TextToolWrapper>
  );
};

export default TextReverseTool;
