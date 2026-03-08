import { useMemo } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TextToolWrapper from "./TextToolWrapper";

const TextToSlugTool = () => {
  return (
    <TextToolWrapper storageKey="text-to-slug" placeholder="Enter text to convert to slug..." rows={3}>
      {({ text }) => {
        const slug = useMemo(
          () =>
            text
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-"),
          [text]
        );

        if (!text) return null;

        return (
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated Slug</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(slug);
                  toast.success("Copied!");
                }}
              >
                <Copy className="h-3 w-3" /> Copy
              </Button>
            </div>
            <p className="text-lg font-mono text-primary break-all">{slug}</p>
          </div>
        );
      }}
    </TextToolWrapper>
  );
};

export default TextToSlugTool;
