import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ImageToBase64Tool = () => {
  const [result, setResult] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setResult(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {result && (
        <>
          <Textarea value={result} readOnly rows={6} className="font-mono text-xs" />
          <Button onClick={() => navigator.clipboard.writeText(result)} variant="outline" className="w-full">Copy Base64 String</Button>
        </>
      )}
    </div>
  );
};

export default ImageToBase64Tool;
