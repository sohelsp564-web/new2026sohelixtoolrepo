import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Copy, Palette } from "lucide-react";

interface ColorSwatch {
  rgb: [number, number, number];
  hex: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

const ColorPaletteGeneratorTool = () => {
  const [colors, setColors] = useState<ColorSwatch[]>([]);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setColors([]);
  };

  const extractColors = async () => {
    if (!imgRef.current) return;
    try {
      // colorthief v3 exports named functions, not a class
      const { getPaletteSync } = await import("colorthief");

      const img = imgRef.current;
      if (!img.complete || img.naturalWidth === 0) {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Image failed to load"));
        });
      }
      await img.decode().catch(() => {});

      const palette = getPaletteSync(img, { colorCount: 8 });
      if (!palette || palette.length === 0) {
        toast({ title: "Could not extract colors", variant: "destructive" });
        return;
      }
      const swatches: ColorSwatch[] = palette.map(color => {
        const hex = color.hex();
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { rgb: [r, g, b] as [number, number, number], hex };
      });
      setColors(swatches);
    } catch (err) {
      toast({ title: "Error extracting colors", description: String(err), variant: "destructive" });
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({ title: `Copied ${hex}` });
  };

  const copyAll = () => {
    const text = colors.map(c => c.hex).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "All colors copied!" });
  };

  return (
    <div className="space-y-5">
      <FileUploadZone
        accept="image/*"
        onFiles={handleFiles}
        formats="PNG • JPG • WEBP"
        label="Drag & drop an image here"
        sublabel="or click to upload"
      />

      {imgSrc && (
        <>
          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Source"
              onLoad={extractColors}
              className="w-full max-h-64 object-contain"
            />
          </div>

          {colors.length > 0 && (
            <>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => copyHex(c.hex)}
                    className="flex flex-col items-center gap-1.5 group"
                    title={`Copy ${c.hex}`}
                  >
                    <div
                      className="w-full aspect-square rounded-xl border border-border shadow-soft group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[10px] font-mono font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {c.hex.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>

              <Button onClick={copyAll} variant="outline" className="w-full gap-2">
                <Copy className="h-4 w-4" /> Copy All HEX Codes
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => { setImgSrc(null); setColors([]); }}
          >
            Upload a different image
          </Button>
        </>
      )}
    </div>
  );
};

export default ColorPaletteGeneratorTool;
