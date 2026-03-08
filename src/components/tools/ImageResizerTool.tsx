import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";

const ImageResizerTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [result, setResult] = useState("");

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) {
      setFile(f); setPreview(URL.createObjectURL(f)); setResult("");
      const img = new Image(); img.onload = () => { setWidth(String(img.width)); setHeight(String(img.height)); }; img.src = URL.createObjectURL(f);
    } else { setFile(null); setPreview(""); setResult(""); }
  };

  const resize = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = parseInt(width); canvas.height = parseInt(height);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      setResult(canvas.toDataURL("image/png"));
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
          <Button onClick={resize} className="w-full h-11 rounded-xl">Resize Image</Button>
          {result ? (
            <>
              <div className="rounded-2xl border border-primary/20 bg-card p-3 shadow-soft">
                <p className="text-xs text-primary mb-2 font-medium">Resized ({width} × {height})</p>
                <img src={result} alt="Resized" className="rounded-xl w-full max-h-64 object-contain" />
              </div>
              <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2"><Download className="h-4 w-4" /> Download Resized Image</Button>
            </>
          ) : (
            <div className="rounded-2xl border border-border p-3">
              <img src={preview} alt="Preview" className="rounded-xl w-full max-h-64 object-contain" />
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ImageResizerTool;
