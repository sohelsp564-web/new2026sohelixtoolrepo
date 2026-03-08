import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const WordCounterTool = () => {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="space-y-4">
      <Textarea placeholder="Type or paste your text here..." value={text} onChange={e => setText(e.target.value)} rows={8} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          ["Words", words], ["Characters", chars], ["No Spaces", charsNoSpace],
          ["Sentences", sentences], ["Paragraphs", paragraphs], ["Read Time", `${readTime}m`],
        ].map(([label, val]) => (
          <div key={label as string} className="rounded-lg bg-muted p-3 text-center">
            <div className="text-2xl font-bold text-primary">{val}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordCounterTool;
