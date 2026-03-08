import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SlugGeneratorTool = () => {
  const [input, setInput] = useState("");
  const slug = input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");

  return (
    <div className="space-y-4">
      <Input placeholder="Enter text to slugify..." value={input} onChange={e => setInput(e.target.value)} />
      {slug && (
        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <code className="flex-1 font-mono text-sm text-primary">{slug}</code>
          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(slug)}>Copy</Button>
        </div>
      )}
    </div>
  );
};

export default SlugGeneratorTool;
