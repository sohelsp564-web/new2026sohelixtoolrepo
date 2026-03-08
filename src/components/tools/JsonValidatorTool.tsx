import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const JsonValidatorTool = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const validate = () => {
    try { JSON.parse(input); setResult({ valid: true, message: "✅ Valid JSON" }); }
    catch (e: any) { setResult({ valid: false, message: `❌ ${e.message}` }); }
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste JSON to validate..." value={input} onChange={e => setInput(e.target.value)} rows={8} className="font-mono text-xs" />
      <Button onClick={validate} className="w-full">Validate JSON</Button>
      {result && <div className={`p-3 rounded-lg text-sm ${result.valid ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>{result.message}</div>}
    </div>
  );
};

export default JsonValidatorTool;
