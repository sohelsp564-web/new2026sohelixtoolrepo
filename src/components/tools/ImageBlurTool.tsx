import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

const ImageBlurTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [radius, setRadius] = useState("5");

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); }
    else { setFile(null); setPreview(""); setResult(""); }
  };

  const apply = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `blur(${radius}px)`;
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  };

  const download = () => { const a = document.createElement("a"); a.href = result; a.download = "blurred.png"; a.click(); };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP" label="Drag & drop your image here" />
      ) : (
        <>
          <div><label className="text-sm font-medium mb-1 block">Blur Radius (px)</label><Input type="number" value={radius} onChange={e => setRadius(e.target.value)} min="1" max="50" className="rounded-xl" /></div>
          <Button onClick={apply} className="w-full h-11 rounded-xl">Apply Blur</Button>
          {result ? (
            <>
              <ComparisonPreview originalSrc={preview} originalLabel="Original" processedSrc={result} processedLabel="Blurred" />
              <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2"><Download className="h-4 w-4" /> Download</Button>
            </>
          ) : (
            <div className="rounded-2xl border border-border p-3"><img loading="lazy" src={preview} alt="Preview" className="rounded-xl w-full max-h-64 object-contain" /></div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ImageBlurTool;
