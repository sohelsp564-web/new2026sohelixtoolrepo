import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";

const FONTS = ["Arial", "Georgia", "Impact", "Courier New", "Times New Roman", "Verdana"];
const POSITIONS = [
  { label: "Top Left",     x: 5,  y: 10 },
  { label: "Top Center",   x: 50, y: 10 },
  { label: "Top Right",    x: 95, y: 10 },
  { label: "Center",       x: 50, y: 50 },
  { label: "Bottom Left",  x: 5,  y: 90 },
  { label: "Bottom Center",x: 50, y: 90 },
  { label: "Bottom Right", x: 95, y: 90 },
];

const AddTextToImageTool = () => {
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [text, setText]       = useState("Your text here");
  const [fontSize, setFontSize]   = useState(36);
  const [color, setColor]         = useState("#ffffff");
  const [font, setFont]           = useState("Arial");
  const [posX, setPosX]           = useState(50);
  const [posY, setPosY]           = useState(90);
  const [bold, setBold]           = useState(false);
  const [shadow, setShadow]       = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const x = (posX / 100) * canvas.width;
    const y = (posY / 100) * canvas.height;
    const scaledFont = Math.round(fontSize * (canvas.width / 600));
    ctx.font = `${bold ? "bold " : ""}${scaledFont}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = posX < 20 ? "left" : posX > 80 ? "right" : "center";
    ctx.textBaseline = "middle";

    if (shadow) {
      ctx.shadowColor   = "rgba(0,0,0,0.7)";
      ctx.shadowBlur    = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur  = 0;
    }
    ctx.fillText(text, x, y);
    ctx.shadowColor = "transparent";
  }, [text, fontSize, color, font, posX, posY, bold, shadow]);

  useEffect(() => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxW = canvas.parentElement?.clientWidth ?? 600;
      const scale = Math.min(1, maxW / img.naturalWidth, 500 / img.naturalHeight);
      canvas.width  = Math.round(img.naturalWidth  * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      imgRef.current = img;
      drawCanvas();
    };
    img.src = preview;
  }, [preview, drawCanvas]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

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
    const x = (posX / 100) * out.width;
    const y = (posY / 100) * out.height;
    ctx.font      = `${bold ? "bold " : ""}${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = posX < 20 ? "left" : posX > 80 ? "right" : "center";
    ctx.textBaseline = "middle";
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
    }
    ctx.fillText(text, x, y);
    const a = document.createElement("a");
    a.href = out.toDataURL("image/png"); a.download = "image-with-text.png"; a.click();
    toast({ title: "Image downloaded!" });
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop your image here" />
      ) : (
        <>
          {/* Text input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Text</label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Enter your text"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Controls row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Font</label>
              <select value={font} onChange={e => setFont(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Font Size: {fontSize}px</label>
              <input type="range" min={10} max={200} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-14 rounded-lg border border-input cursor-pointer" />
                <input type="text" value={color} onChange={e => setColor(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Position</label>
              <select
                onChange={e => {
                  const p = POSITIONS[Number(e.target.value)];
                  if (p) { setPosX(p.x); setPosY(p.y); }
                }}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {POSITIONS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Fine-tune position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">X: {posX}%</label>
              <input type="range" min={0} max={100} value={posX} onChange={e => setPosX(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase mb-1.5 block">Y: {posY}%</label>
              <input type="range" min={0} max={100} value={posY} onChange={e => setPosY(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-2">
            <Button size="sm" variant={bold ? "default" : "outline"} className="rounded-xl h-8 px-4 text-xs font-bold" onClick={() => setBold(!bold)}>Bold</Button>
            <Button size="sm" variant={shadow ? "default" : "outline"} className="rounded-xl h-8 px-4 text-xs" onClick={() => setShadow(!shadow)}>Shadow</Button>
          </div>

          {/* Live preview canvas */}
          <div className="rounded-2xl border border-border overflow-hidden bg-black/5">
            <canvas ref={canvasRef} className="w-full block" />
          </div>

          <Button onClick={download} className="w-full h-11 rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download Image
          </Button>

          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>
            Upload a different image
          </Button>
        </>
      )}
    </div>
  );
};

export default AddTextToImageTool;
