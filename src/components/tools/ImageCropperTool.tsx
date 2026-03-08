import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ImageCropperTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 });
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); }
  };

  useEffect(() => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      setImgDims({ w: img.width, h: img.height });
      setCrop({ x: 0, y: 0, w: Math.min(img.width, 400), h: Math.min(img.height, 400) });
    };
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
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {preview && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {(["x", "y", "w", "h"] as const).map(k => (
              <div key={k}><label className="text-xs font-medium">{k.toUpperCase()}</label>
              <input type="number" value={crop[k]} onChange={e => setCrop(p => ({ ...p, [k]: parseInt(e.target.value) || 0 }))} className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm" /></div>
            ))}
          </div>
          <img src={preview} alt="Preview" className="rounded-lg border border-border max-h-48 w-full object-contain" />
          <Button onClick={doCrop} className="w-full">Crop Image</Button>
          {result && (
            <>
              <img src={result} alt="Cropped" className="rounded-lg border border-border max-h-48 w-full object-contain" />
              <Button onClick={download} variant="outline" className="w-full">Download Cropped Image</Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ImageCropperTool;
