import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const cases = [
  { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { label: "lowercase", fn: (s: string) => s.toLowerCase() },
  { label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
  { label: "Sentence case", fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { label: "aLtErNaTiNg", fn: (s: string) => s.split("").map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join("") },
];

const TextCaseConverterTool = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter your text..." value={text} onChange={e => setText(e.target.value)} rows={5} />
      <div className="flex flex-wrap gap-2">
        {cases.map(c => <Button key={c.label} variant="outline" size="sm" onClick={() => setResult(c.fn(text))}>{c.label}</Button>)}
      </div>
      {result && (
        <>
          <Textarea value={result} readOnly rows={5} />
          <Button onClick={() => navigator.clipboard.writeText(result)} variant="outline" className="w-full">Copy Result</Button>
        </>
      )}
    </div>
  );
};

export default TextCaseConverterTool;
