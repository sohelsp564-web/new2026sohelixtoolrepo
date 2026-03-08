import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Base64DecoderTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const decode = () => { try { setOutput(atob(input.trim())); } catch { setOutput("Error: Invalid Base64"); } };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste Base64 string..." value={input} onChange={e => setInput(e.target.value)} rows={5} className="font-mono text-xs" />
      <Button onClick={decode} className="w-full">Decode from Base64</Button>
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
