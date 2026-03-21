import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

const ImageCropperTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 400, h: 400 });

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); }
    else { setFile(null); setPreview(""); setResult(""); }
  };

  useEffect(() => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => setCrop({ x: 0, y: 0, w: Math.min(img.width, 400), h: Math.min(img.height, 400) });
    img.src = preview;
  }, [preview]);

  const doCrop = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.w; canvas.height = crop.h;
      canvas.getContext("2d")?.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  };

  const download = () => { const a = document.createElement("a"); a.href = result; a.download = "cropped-image.png"; a.click(); };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop your image here" />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2">
            {(["x", "y", "w", "h"] as const).map(k => (
              <div key={k}>
                <label className="text-xs font-medium uppercase text-muted-foreground">{k === "w" ? "Width" : k === "h" ? "Height" : k.toUpperCase()}</label>
                <input type="number" value={crop[k]} onChange={e => setCrop(p => ({ ...p, [k]: parseInt(e.target.value) || 0 }))} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
            ))}
          </div>
          {result ? (
            <ComparisonPreview
              originalSrc={preview}
              originalLabel="Original"
              processedSrc={result}
              processedLabel="Cropped"
            />
          ) : (
            <div className="rounded-2xl border border-border p-3">
              <img loading="lazy" src={preview} alt="Preview" className="rounded-xl w-full max-h-48 object-contain" />
            </div>
          )}
          <Button onClick={doCrop} className="w-full h-11 rounded-xl">Crop Image</Button>
          {result && (
            <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2"><Download className="h-4 w-4" /> Download Cropped Image</Button>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ImageCropperTool;
