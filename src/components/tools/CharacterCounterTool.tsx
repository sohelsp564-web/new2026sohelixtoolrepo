import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const CharacterCounterTool = () => {
  const [text, setText] = useState("");
  return (
    <div className="space-y-4">
      <Textarea placeholder="Type or paste text..." value={text} onChange={e => setText(e.target.value)} rows={6} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["With spaces", text.length], ["Without spaces", text.replace(/\s/g, "").length], ["Words", text.trim() ? text.trim().split(/\s+/).length : 0], ["Lines", text ? text.split("\n").length : 0]].map(([l, v]) => (
          <div key={l as string} className="rounded-lg bg-muted p-3 text-center">
            <div className="text-2xl font-bold text-primary">{v}</div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterCounterTool;
