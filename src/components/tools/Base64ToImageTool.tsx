import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const Base64ToImageTool = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const isValid = input.startsWith("data:image") || /^[A-Za-z0-9+/=]+$/.test(input.trim());
  const src = input.startsWith("data:image") ? input : `data:image/png;base64,${input.trim()}`;

  const download = () => { const a = document.createElement("a"); a.href = src; a.download = "image.png"; a.click(); };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste Base64 string here..." value={input} onChange={e => { setInput(e.target.value); setError(""); }} rows={5} className="font-mono text-xs" />
      {input && isValid && (
        <>
          <img src={src} alt="Decoded" className="rounded-lg border border-border max-h-64 w-full object-contain" onError={() => setError("Invalid Base64 image")} />
          {!error && <Button onClick={download} variant="outline" className="w-full">Download Image</Button>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </>
      )}
    </div>
  );
};

export default Base64ToImageTool;
