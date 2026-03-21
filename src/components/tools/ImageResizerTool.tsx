import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Loader2 } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

const ImageResizerTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) {
      const previewUrl = URL.createObjectURL(f);
      setFile(f); setPreview(previewUrl); setResult("");
      const img = new Image(); img.onload = () => { setWidth(String(img.width)); setHeight(String(img.height)); }; img.src = previewUrl;
    } else { setFile(null); setPreview(""); setResult(""); }
  };

  const resize = () => {
    if (!file) return;
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = parseInt(width); canvas.height = parseInt(height);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      setResult(canvas.toDataURL("image/png"));
      setIsProcessing(false);
    };
    img.src = preview;
  };

  const download = () => { const a = document.createElement("a"); a.href = result; a.download = "resized-image.png"; a.click(); };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop your image here" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Width (px)</label><Input value={width} onChange={e => setWidth(e.target.value)} type="number" className="rounded-xl" /></div>
            <div><label className="text-sm font-medium mb-1 block">Height (px)</label><Input value={height} onChange={e => setHeight(e.target.value)} type="number" className="rounded-xl" /></div>
          </div>
          <Button onClick={resize} disabled={isProcessing} className="w-full h-11 rounded-xl gap-2">
            {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : "Resize Image"}
          </Button>
          {result ? (
            <>
              <ComparisonPreview
                originalSrc={preview}
                originalLabel="Original"
                processedSrc={result}
                processedLabel={`Resized (${width} × ${height})`}
              />
              <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2"><Download className="h-4 w-4" /> Download Resized Image</Button>
            </>
          ) : (
            <div className="rounded-2xl border border-border p-3">
              <img loading="lazy" src={preview} alt="Preview" className="rounded-xl w-full max-h-64 object-contain" />
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ImageResizerTool;
