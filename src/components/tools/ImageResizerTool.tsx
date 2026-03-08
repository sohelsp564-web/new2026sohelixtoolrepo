import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ImageResizerTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [result, setResult] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); const img = new Image(); img.onload = () => { setWidth(String(img.width)); setHeight(String(img.height)); }; img.src = URL.createObjectURL(f); }
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
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {preview && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Width (px)</label><Input value={width} onChange={e => setWidth(e.target.value)} type="number" /></div>
            <div><label className="text-sm font-medium mb-1 block">Height (px)</label><Input value={height} onChange={e => setHeight(e.target.value)} type="number" /></div>
          </div>
          <Button onClick={resize} className="w-full">Resize Image</Button>
          {result && (
            <>
              <img src={result} alt="Resized" className="rounded-lg border border-border max-h-64 w-full object-contain" />
              <Button onClick={download} variant="outline" className="w-full">Download Resized Image</Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ImageResizerTool;
