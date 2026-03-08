import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const ColorPickerTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [color, setColor] = useState({ hex: "", rgb: "", hsl: "" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
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
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {preview && (
        <>
          <img ref={imgRef} src={preview} alt="Source" className="hidden" onLoad={onImgLoad} />
          <canvas ref={canvasRef} onClick={pickColor} className="rounded-lg border border-border max-h-64 w-full object-contain cursor-crosshair" style={{ imageRendering: "pixelated" }} />
          {color.hex && (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
              <div className="h-12 w-12 rounded-lg border border-border" style={{ backgroundColor: color.hex }} />
              <div className="space-y-1 text-sm">
                <p><strong>HEX:</strong> {color.hex} <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(color.hex)}>Copy</Button></p>
                <p><strong>RGB:</strong> {color.rgb}</p>
                <p><strong>HSL:</strong> {color.hsl}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ColorPickerTool;
