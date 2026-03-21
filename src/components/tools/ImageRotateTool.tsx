import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RotateCw } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

const ImageRotateTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [angle, setAngle] = useState(90);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); }
    else { setFile(null); setPreview(""); setResult(""); }
  };

  const rotate = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const rad = (angle * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
      canvas.width = Math.round(img.width * cos + img.height * sin);
      canvas.height = Math.round(img.width * sin + img.height * cos);
      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  };

  const download = () => { const a = document.createElement("a"); a.href = result; a.download = "rotated.png"; a.click(); };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP" label="Drag & drop your image here" />
      ) : (
        <>
          <div className="flex gap-2">
            {[90, 180, 270].map(a => (
              <Button key={a} variant={angle === a ? "default" : "outline"} className="flex-1 rounded-xl gap-1" onClick={() => setAngle(a)}>
                <RotateCw className="h-4 w-4" /> {a}°
              </Button>
            ))}
          </div>
          <Button onClick={rotate} className="w-full h-11 rounded-xl">Rotate Image</Button>
          {result ? (
            <>
              <ComparisonPreview originalSrc={preview} originalLabel="Original" processedSrc={result} processedLabel={`Rotated ${angle}°`} />
              <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2"><Download className="h-4 w-4" /> Download</Button>
            </>
          ) : (
            <div className="rounded-2xl border border-border p-3"><img src={preview} alt="Preview" className="rounded-xl w-full max-h-64 object-contain" /></div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ImageRotateTool;
