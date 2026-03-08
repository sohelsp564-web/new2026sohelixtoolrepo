import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Base64DecoderTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const binary = atob(input.trim());
      // Handle Unicode properly using TextDecoder
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
      setError("");
    } catch (e: any) {
      setError("Invalid Base64 string");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste Base64 string..." value={input} onChange={e => setInput(e.target.value)} rows={5} className="font-mono text-xs" />
      <Button onClick={decode} className="w-full">Decode from Base64</Button>
      {error && <p className="text-sm text-destructive">❌ {error}</p>}
      {output && (
        <>
          <Textarea value={output} readOnly rows={5} />
          <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="w-full">Copy</Button>
        </>
      )}
    </div>
  );
};

export default Base64DecoderTool;
