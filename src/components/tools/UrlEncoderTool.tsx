import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const UrlEncoderTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter URL or text..." value={input} onChange={e => setInput(e.target.value)} rows={4} />
      <Button onClick={() => setOutput(encodeURIComponent(input))} className="w-full">Encode URL</Button>
      {output && (<><Textarea value={output} readOnly rows={4} className="font-mono text-xs" /><Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="w-full">Copy</Button></>)}
    </div>
  );
};

export default UrlEncoderTool;
