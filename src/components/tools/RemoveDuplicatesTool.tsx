import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const RemoveDuplicatesTool = () => {
  const [text, setText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [result, setResult] = useState("");

  const remove = () => {
    const lines = text.split("\n");
    const seen = new Set<string>();
    const unique = lines.filter(l => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    setResult(unique.join("\n"));
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste lines of text..." value={text} onChange={e => setText(e.target.value)} rows={6} />
      <div className="flex items-center gap-2">
        <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} />
        <span className="text-sm">Case sensitive</span>
      </div>
      <Button onClick={remove} className="w-full">Remove Duplicates</Button>
      {result && (
        <>
          <Textarea value={result} readOnly rows={6} />
          <Button onClick={() => navigator.clipboard.writeText(result)} variant="outline" className="w-full">Copy Result</Button>
        </>
      )}
    </div>
  );
};

export default RemoveDuplicatesTool;
