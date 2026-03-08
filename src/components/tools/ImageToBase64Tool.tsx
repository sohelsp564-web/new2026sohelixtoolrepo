import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";

const ImageToBase64Tool = () => {
  const [result, setResult] = useState("");
  const [hasFile, setHasFile] = useState(false);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (!f) { setResult(""); setHasFile(false); return; }
    setHasFile(true);
    const reader = new FileReader();
    reader.onload = () => setResult(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="space-y-5">
      {!hasFile ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop your image here" />
      ) : (
        <>
          {result && (
            <>
              <Textarea value={result} readOnly rows={6} className="font-mono text-xs rounded-xl" />
              <Button onClick={() => navigator.clipboard.writeText(result)} variant="outline" className="w-full h-11 rounded-xl gap-2"><Copy className="h-4 w-4" /> Copy Base64 String</Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { setResult(""); setHasFile(false); }}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ImageToBase64Tool;
