import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const TextSorterTool = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const sort = (desc = false, numeric = false) => {
    const lines = text.split("\n").filter(l => l.trim());
    lines.sort((a, b) => {
      if (numeric) return desc ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b);
      return desc ? b.localeCompare(a) : a.localeCompare(b);
    });
    setResult(lines.join("\n"));
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter lines of text..." value={text} onChange={e => setText(e.target.value)} rows={6} />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => sort(false)}>A → Z</Button>
        <Button variant="outline" size="sm" onClick={() => sort(true)}>Z → A</Button>
        <Button variant="outline" size="sm" onClick={() => sort(false, true)}>0 → 9</Button>
        <Button variant="outline" size="sm" onClick={() => sort(true, true)}>9 → 0</Button>
      </div>
      {result && (
        <>
          <Textarea value={result} readOnly rows={6} />
          <Button onClick={() => navigator.clipboard.writeText(result)} variant="outline" className="w-full">Copy</Button>
        </>
      )}
    </div>
  );
};

export default TextSorterTool;
