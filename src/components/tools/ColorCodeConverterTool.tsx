import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  if (h.length !== 3 && h.length !== 6) return null;
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const ColorCodeConverterTool = () => {
  const [hex, setHex] = useState("#3b82f6");
  const [r, setR] = useState("59");
  const [g, setG] = useState("130");
  const [b, setB] = useState("246");
  const [mode, setMode] = useState<"hex" | "rgb">("hex");

  const fromHex = (val: string) => {
    setHex(val);
    const rgb = hexToRgb(val);
    if (rgb) { setR(String(rgb.r)); setG(String(rgb.g)); setB(String(rgb.b)); }
  };

  const fromRgb = () => {
    const rv = parseInt(r) || 0, gv = parseInt(g) || 0, bv = parseInt(b) || 0;
    setHex(rgbToHex(rv, gv, bv));
  };

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const copy = (val: string) => { navigator.clipboard.writeText(val); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <Button variant={mode === "hex" ? "default" : "outline"} className="flex-1 rounded-xl" onClick={() => setMode("hex")}>HEX → RGB</Button>
        <Button variant={mode === "rgb" ? "default" : "outline"} className="flex-1 rounded-xl" onClick={() => setMode("rgb")}>RGB → HEX</Button>
      </div>
      {mode === "hex" ? (
        <div className="flex gap-3 items-end">
          <div className="flex-1"><label className="text-sm font-medium mb-1 block">HEX Color</label><Input value={hex} onChange={e => fromHex(e.target.value)} className="font-mono" /></div>
          <input type="color" value={hex} onChange={e => fromHex(e.target.value)} className="h-10 w-10 rounded-lg border border-border cursor-pointer" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-sm font-medium mb-1 block">R</label><Input type="number" value={r} onChange={e => { setR(e.target.value); }} onBlur={fromRgb} min="0" max="255" /></div>
          <div><label className="text-sm font-medium mb-1 block">G</label><Input type="number" value={g} onChange={e => { setG(e.target.value); }} onBlur={fromRgb} min="0" max="255" /></div>
          <div><label className="text-sm font-medium mb-1 block">B</label><Input type="number" value={b} onChange={e => { setB(e.target.value); }} onBlur={fromRgb} min="0" max="255" /></div>
        </div>
      )}
      {rgb && (
        <>
          <div className="h-20 rounded-xl border border-border" style={{ backgroundColor: hex }} />
          <div className="space-y-2">
            {[
              ["HEX", hex],
              ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
              ["HSL", hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ""],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-muted px-4 py-2">
                <span className="text-sm"><span className="text-muted-foreground">{label}:</span> <span className="font-mono font-medium">{val}</span></span>
                <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => copy(val)}><Copy className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ColorCodeConverterTool;
