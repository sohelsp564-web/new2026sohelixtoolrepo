import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FlipHorizontal, FlipVertical } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

const ImageFlipTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [dir, setDir] = useState<"h" | "v">("h");

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); }
    else { setFile(null); setPreview(""); setResult(""); }
  };

  const flip = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (dir === "h") { ctx.scale(-1, 1); ctx.drawImage(img, -img.width, 0); }
      else { ctx.scale(1, -1); ctx.drawImage(img, 0, -img.height); }
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  };

  const download = () => { const a = document.createElement("a"); a.href = result; a.download = "flipped.png"; a.click(); };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP" label="Drag & drop your image here" />
      ) : (
        <>
          <div className="flex gap-2">
            <Button variant={dir === "h" ? "default" : "outline"} className="flex-1 rounded-xl gap-1" onClick={() => setDir("h")}>
              <FlipHorizontal className="h-4 w-4" /> Horizontal
            </Button>
            <Button variant={dir === "v" ? "default" : "outline"} className="flex-1 rounded-xl gap-1" onClick={() => setDir("v")}>
              <FlipVertical className="h-4 w-4" /> Vertical
            </Button>
          </div>
          <Button onClick={flip} className="w-full h-11 rounded-xl">Flip Image</Button>
          {result ? (
            <>
              <ComparisonPreview originalSrc={preview} originalLabel="Original" processedSrc={result} processedLabel={`Flipped ${dir === "h" ? "Horizontally" : "Vertically"}`} />
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

export default ImageFlipTool;
