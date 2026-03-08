import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";

const ColorPickerTool = () => {
  const [hasFile, setHasFile] = useState(false);
  const [preview, setPreview] = useState("");
  const [color, setColor] = useState({ hex: "", rgb: "", hsl: "" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setHasFile(true); setPreview(URL.createObjectURL(f)); setColor({ hex: "", rgb: "", hsl: "" }); }
    else { setHasFile(false); setPreview(""); }
  };

  const pickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const rr = r / 255, gg = g / 255, bb = b / 255;
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
      else if (max === gg) h = ((bb - rr) / d + 2) / 6;
      else h = ((rr - gg) / d + 4) / 6;
    }
    const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    setColor({ hex, rgb, hsl });
  };

  const onImgLoad = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")?.drawImage(img, 0, 0);
  };

  return (
    <div className="space-y-5">
      {!hasFile ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop your image here" sublabel="Click on any pixel to pick its color" />
      ) : (
        <>
          <img ref={imgRef} src={preview} alt="Source" className="hidden" onLoad={onImgLoad} />
          <div className="rounded-2xl border border-border p-2 shadow-soft">
            <canvas ref={canvasRef} onClick={pickColor} className="rounded-xl max-h-72 w-full object-contain cursor-crosshair" style={{ imageRendering: "pixelated" }} />
          </div>
          <p className="text-xs text-muted-foreground text-center">Click anywhere on the image to pick a color</p>
          {color.hex && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted shadow-soft">
              <div className="h-14 w-14 rounded-2xl border border-border shadow-card" style={{ backgroundColor: color.hex }} />
              <div className="space-y-1.5 text-sm flex-1">
                {[["HEX", color.hex], ["RGB", color.rgb], ["HSL", color.hsl]].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span><strong>{label}:</strong> {val}</span>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => navigator.clipboard.writeText(val)}>
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ColorPickerTool;
