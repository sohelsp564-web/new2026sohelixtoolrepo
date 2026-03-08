import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePerformance } from "@/hooks/usePerformance";

const JsonFormatterTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { measure } = usePerformance("JSON Formatter");

  const format = async () => {
    try {
      const result = await measure(() => JSON.stringify(JSON.parse(input), null, 2));
      setOutput(result);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = async () => {
    try {
      const result = await measure(() => JSON.stringify(JSON.parse(input)));
      setOutput(result);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste JSON here..." value={input} onChange={e => setInput(e.target.value)} rows={8} className="font-mono text-xs" />
      <div className="flex gap-2">
        <Button onClick={format} className="flex-1">Format</Button>
        <Button onClick={minify} variant="outline" className="flex-1">Minify</Button>
      </div>
      {error && <p className="text-sm text-destructive">❌ {error}</p>}
      {output && (
        <>
          <Textarea value={output} readOnly rows={10} className="font-mono text-xs" />
          <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="w-full">Copy</Button>
        </>
      )}
    </div>
  );
};

export default JsonFormatterTool;
