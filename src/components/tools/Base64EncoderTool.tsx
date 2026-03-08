import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Base64EncoderTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const encode = () => { try { setOutput(btoa(input)); } catch { setOutput("Error encoding"); } };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter text to encode..." value={input} onChange={e => setInput(e.target.value)} rows={5} />
      <Button onClick={encode} className="w-full">Encode to Base64</Button>
      {output && (
        <>
          <Textarea value={output} readOnly rows={5} className="font-mono text-xs" />
          <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="w-full">Copy</Button>
        </>
      )}
    </div>
  );
};

export default Base64EncoderTool;
