import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Loader2 } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

const ImageWatermarkTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [text, setText] = useState("Sohelix");
  const [opacity, setOpacity] = useState("30");
  const [fontSize, setFontSize] = useState("48");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); }
    else { setFile(null); setPreview(""); setResult(""); }
  };

  const apply = () => {
    if (!file) return;
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = parseInt(opacity) / 100;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // tile watermark
      const stepX = parseInt(fontSize) * 6;
      const stepY = parseInt(fontSize) * 4;
      ctx.save();
      ctx.rotate(-0.3);
      for (let x = -img.width; x < img.width * 2; x += stepX) {
        for (let y = -img.height; y < img.height * 2; y += stepY) {
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.lineWidth = 2;
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
      setResult(canvas.toDataURL("image/png"));
      setIsProcessing(false);
    };
    img.src = preview;
  };

  const download = () => { const a = document.createElement("a"); a.href = result; a.download = "watermarked.png"; a.click(); };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP" label="Drag & drop your image here" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Text</label><Input value={text} onChange={e => setText(e.target.value)} className="rounded-xl" /></div>
            <div><label className="text-sm font-medium mb-1 block">Opacity (%)</label><Input type="number" value={opacity} onChange={e => setOpacity(e.target.value)} min="5" max="100" className="rounded-xl" /></div>
            <div><label className="text-sm font-medium mb-1 block">Font Size</label><Input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} min="12" max="200" className="rounded-xl" /></div>
          </div>
          <Button onClick={apply} disabled={isProcessing} className="w-full h-11 rounded-xl gap-2">
            {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : "Apply Watermark"}
          </Button>
          {result ? (
            <>
              <ComparisonPreview originalSrc={preview} originalLabel="Original" processedSrc={result} processedLabel="Watermarked" />
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

export default ImageWatermarkTool;
