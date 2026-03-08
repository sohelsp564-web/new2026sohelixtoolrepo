import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const LoremIpsumTool = () => {
  const [count, setCount] = useState("3");
  const [result, setResult] = useState("");

  const generate = () => {
    const n = Math.max(1, Math.min(50, parseInt(count) || 1));
    setResult(Array(n).fill(LOREM).join("\n\n"));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1"><label className="text-sm font-medium mb-1 block">Paragraphs</label><Input type="number" value={count} onChange={e => setCount(e.target.value)} min={1} max={50} /></div>
        <Button onClick={generate}>Generate</Button>
      </div>
      {result && (
        <>
          <Textarea value={result} readOnly rows={10} />
          <Button onClick={() => navigator.clipboard.writeText(result)} variant="outline" className="w-full">Copy</Button>
        </>
      )}
    </div>
  );
};

export default LoremIpsumTool;
