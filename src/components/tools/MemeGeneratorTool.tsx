import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";

const MemeGeneratorTool = () => {
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [topText, setTopText]     = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [fontSize, setFontSize]   = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const scale = canvas.width / 600;
    const fs    = Math.round(fontSize * scale);
    ctx.font         = `900 ${fs}px Impact, Arial Black, sans-serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "top";

    const drawStrokedText = (t: string, x: number, y: number) => {
      ctx.strokeStyle = "#000";
      ctx.lineWidth   = Math.max(2, fs * 0.12);
      ctx.lineJoin    = "round";
      ctx.strokeText(t, x, y);
      ctx.fillStyle = textColor;
      ctx.fillText(t, x, y);
    };

    const cx  = canvas.width / 2;
    const pad = Math.round(fs * 0.3);

    // Top text
    if (topText) {
      ctx.textBaseline = "top";
      drawStrokedText(topText.toUpperCase(), cx, pad);
    }

    // Bottom text
    if (bottomText) {
      ctx.textBaseline = "bottom";
      ctx.font = `900 ${fs}px Impact, Arial Black, sans-serif`;
      ctx.strokeText(bottomText.toUpperCase(), cx, canvas.height - pad);
      ctx.fillStyle = textColor;
      ctx.fillText(bottomText.toUpperCase(), cx, canvas.height - pad);
    }
  }, [topText, bottomText, fontSize, textColor]);

  useEffect(() => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxW  = canvas.parentElement?.clientWidth ?? 600;
      const scale = Math.min(1, maxW / img.naturalWidth, 520 / img.naturalHeight);
      canvas.width  = Math.round(img.naturalWidth  * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      imgRef.current = img;
      drawMeme();
    };
    img.src = preview;
  }, [preview, drawMeme]);

  useEffect(() => { drawMeme(); }, [drawMeme]);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
    else   { setFile(null); setPreview(""); }
  };

  const download = () => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const out = document.createElement("canvas");
    out.width  = img.naturalWidth;
    out.height = img.naturalHeight;
    const ctx  = out.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const fs = fontSize;
    ctx.font      = `900 ${fs}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = "center";
    const cx  = out.width / 2;
    const pad = Math.round(fs * 0.3);

    const strokeFill = (t: string, x: number, y: number, baseline: CanvasTextBaseline) => {
      ctx.textBaseline = baseline;
      ctx.strokeStyle  = "#000";
      ctx.lineWidth    = Math.max(2, fs * 0.12);
      ctx.lineJoin     = "round";
      ctx.strokeText(t, x, y);
      ctx.fillStyle = textColor;
      ctx.fillText(t, x, y);
    };

    if (topText)    strokeFill(topText.toUpperCase(),    cx, pad,               "top");
    if (bottomText) strokeFill(bottomText.toUpperCase(), cx, out.height - pad,  "bottom");

    const a = document.createElement("a");
    a.href = out.toDataURL("image/jpeg", 0.92); a.download = "meme.jpg"; a.click();
    toast({ title: "Meme downloaded!" });
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop your image here" />
      ) : (
        <>
          {/* Text inputs */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Top Text</label>
              <input
                type="text"
                value={topText}
                onChange={e => setTopText(e.target.value)}
                placeholder="TOP TEXT"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Bottom Text</label>
              <input
                type="text"
                value={bottomText}
                onChange={e => setBottomText(e.target.value)}
                placeholder="BOTTOM TEXT"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Font size & color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Font Size: {fontSize}px</label>
              <input type="range" min={16} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-9 w-14 rounded-lg border border-input cursor-pointer" />
                <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="rounded-2xl border border-border overflow-hidden bg-black select-none">
            <canvas ref={canvasRef} className="w-full block" />
          </div>

          <Button onClick={download} className="w-full h-11 rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download Meme
          </Button>

          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>
            Upload a different image
          </Button>
        </>
      )}
    </div>
  );
};

export default MemeGeneratorTool;
