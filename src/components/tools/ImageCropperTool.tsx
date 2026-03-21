import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

/* ── aspect ratio presets ── */
const RATIOS = [
  { label: "Free", value: "free" },
  { label: "1:1", value: "1:1" },
  { label: "4:3", value: "4:3" },
  { label: "16:9", value: "16:9" },
  { label: "3:4", value: "3:4" },
  { label: "9:16", value: "9:16" },
];

const HS = 8;
const MIN = 12;

type Handle = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | "move" | "new";
interface Rect { x: number; y: number; w: number; h: number }

function parseRatio(v: string): number | null {
  if (v === "free") return null;
  const [a, b] = v.split(":").map(Number);
  return a / b;
}
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }

const ImageCropperTool = () => {
  const [file, setFile]           = useState<File | null>(null);
  const [preview, setPreview]     = useState("");
  const [result, setResult]       = useState("");
  const [isProcessing, setIsProc] = useState(false);
  const [ratio, setRatio]         = useState("free");
  const [info, setInfo]           = useState("");

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const imgRef     = useRef<HTMLImageElement | null>(null);
  const cropRef    = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const dragRef    = useRef<{ handle: Handle; sx: number; sy: number; sr: Rect } | null>(null);
  const ratioRef   = useRef("free");

  useEffect(() => { ratioRef.current = ratio; }, [ratio]);

  /* ── draw overlay ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    const { width: W, height: H } = canvas;
    const { x, y, w, h } = cropRef.current;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);

    // dark mask
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, W, y);
    ctx.fillRect(0, y + h, W, H - y - h);
    ctx.fillRect(0, y, x, h);
    ctx.fillRect(x + w, y, W - x - w, h);

    // crop border
    ctx.strokeStyle = "#fff";
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(x, y, w, h);

    // rule-of-thirds
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth   = 0.5;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(x + (w / 3) * i, y); ctx.lineTo(x + (w / 3) * i, y + h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + (h / 3) * i); ctx.lineTo(x + w, y + (h / 3) * i); ctx.stroke();
    }

    // corner accent lines
    const ac = 14;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth   = 2.5;
    [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([cx,cy,dx,dy]) => {
      ctx.beginPath(); ctx.moveTo(cx as number, cy as number + (dy as number)*ac); ctx.lineTo(cx as number, cy as number); ctx.lineTo(cx as number + (dx as number)*ac, cy as number); ctx.stroke();
    });

    // handles
    const pts: [number, number][] = [
      [x, y], [x+w/2, y], [x+w, y],
      [x, y+h/2],          [x+w, y+h/2],
      [x, y+h], [x+w/2, y+h], [x+w, y+h],
    ];
    pts.forEach(([hx, hy]) => {
      ctx.fillStyle   = "#fff";
      ctx.fillRect(hx - HS/2, hy - HS/2, HS, HS);
      ctx.strokeStyle = "#666";
      ctx.lineWidth   = 1;
      ctx.strokeRect(hx - HS/2, hy - HS/2, HS, HS);
    });
  }, []);

  /* ── info label ── */
  const updateInfo = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const sx = img.naturalWidth  / canvas.width;
    const sy = img.naturalHeight / canvas.height;
    const { x, y, w, h } = cropRef.current;
    setInfo(`${Math.round(w*sx)} × ${Math.round(h*sy)} px`);
  }, []);

  /* ── load image into canvas ── */
  const loadIntoCanvas = useCallback((src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const maxW = (canvas.parentElement?.clientWidth ?? 640);
      const maxH = 460;
      const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
      canvas.width  = Math.round(img.naturalWidth  * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      // default: 80% centred crop
      const pad = 0.1;
      cropRef.current = {
        x: Math.round(canvas.width  * pad),
        y: Math.round(canvas.height * pad),
        w: Math.round(canvas.width  * (1 - 2*pad)),
        h: Math.round(canvas.height * (1 - 2*pad)),
      };
      draw();
      updateInfo();
    };
    img.src = src;
  }, [draw, updateInfo]);

  useEffect(() => { if (preview) loadIntoCanvas(preview); }, [preview, loadIntoCanvas]);

  /* ── hit-test ── */
  const hitHandle = (x: number, y: number): Handle => {
    const ht = HS + 3;
    const { x:cx, y:cy, w:cw, h:ch } = cropRef.current;
    const nx = (px: number) => Math.abs(x - px) <= ht;
    const ny = (py: number) => Math.abs(y - py) <= ht;
    if (nx(cx)      && ny(cy))      return "tl";
    if (nx(cx+cw)   && ny(cy))      return "tr";
    if (nx(cx)      && ny(cy+ch))   return "bl";
    if (nx(cx+cw)   && ny(cy+ch))   return "br";
    if (nx(cx+cw/2) && ny(cy))      return "t";
    if (nx(cx+cw/2) && ny(cy+ch))   return "b";
    if (nx(cx)      && ny(cy+ch/2)) return "l";
    if (nx(cx+cw)   && ny(cy+ch/2)) return "r";
    if (x>cx && x<cx+cw && y>cy && y<cy+ch) return "move";
    return "new";
  };

  /* ── pointer helpers ── */
  const pos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left)  * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)   * (canvas.height / rect.height),
    };
  };

  const CURSORS: Record<Handle, string> = {
    tl:"nwse-resize", tr:"nesw-resize", bl:"nesw-resize", br:"nwse-resize",
    t:"ns-resize", b:"ns-resize", l:"ew-resize", r:"ew-resize",
    move:"move", new:"crosshair",
  };

  const onDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = pos(e);
    const handle = hitHandle(x, y);
    dragRef.current = { handle, sx: x, sy: y, sr: { ...cropRef.current } };
  };

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const { x, y } = pos(e);
    // update cursor even without drag
    canvas.style.cursor = CURSORS[hitHandle(x, y)];
    if (!dragRef.current) return;

    const { handle, sx, sy, sr } = dragRef.current;
    const dx = x - sx, dy = y - sy;
    const CW = canvas.width, CH = canvas.height;
    const ar = parseRatio(ratioRef.current);
    let { x:rx, y:ry, w:rw, h:rh } = sr;
    let nx=rx, ny=ry, nw=rw, nh=rh;

    if (handle === "move") {
      nx = clamp(rx+dx, 0, CW-rw);
      ny = clamp(ry+dy, 0, CH-rh);
    } else if (handle === "new") {
      nx = Math.min(sx, x); ny = Math.min(sy, y);
      nw = Math.abs(dx); nh = Math.abs(dy);
      if (ar) nh = nw / ar;
      nx = clamp(nx, 0, CW-MIN); ny = clamp(ny, 0, CH-MIN);
      nw = clamp(nw, MIN, CW-nx); nh = clamp(nh, MIN, CH-ny);
    } else {
      if (handle==="tl"||handle==="l"||handle==="bl") { nx=rx+dx; nw=rw-dx; }
      if (handle==="tr"||handle==="r"||handle==="br") { nw=rw+dx; }
      if (handle==="tl"||handle==="t"||handle==="tr") { ny=ry+dy; nh=rh-dy; }
      if (handle==="bl"||handle==="b"||handle==="br") { nh=rh+dy; }
      if (nw<MIN){if(handle.includes("l")){nx=rx+rw-MIN;} nw=MIN;}
      if (nh<MIN){if(handle.includes("t")){ny=ry+rh-MIN;} nh=MIN;}
      nx=clamp(nx,0,CW-MIN); ny=clamp(ny,0,CH-MIN);
      nw=clamp(nw,MIN,CW-nx); nh=clamp(nh,MIN,CH-ny);
      if (ar) {
        if (handle==="t"||handle==="b") nw=nh*ar;
        else if (handle==="l"||handle==="r") nh=nw/ar;
        else { if(nw/nh>ar) nw=nh*ar; else nh=nw/ar; }
        nw=clamp(nw,MIN,CW-nx); nh=clamp(nh,MIN,CH-ny);
      }
    }
    cropRef.current = { x:nx, y:ny, w:nw, h:nh };
    draw();
    updateInfo();
  };

  const onUp = () => { dragRef.current = null; };

  /* ── apply aspect ratio change ── */
  const changeRatio = (v: string) => {
    setRatio(v);
    const ar = parseRatio(v);
    if (!ar || !canvasRef.current) return;
    const { x, y, w } = cropRef.current;
    const h = w / ar;
    const CW = canvasRef.current.width, CH = canvasRef.current.height;
    cropRef.current = { x: clamp(x,0,CW-w), y: clamp(y,0,CH-h), w, h: clamp(h,MIN,CH-y) };
    draw();
    updateInfo();
  };

  /* ── crop & download ── */
  const doCrop = () => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    setIsProc(true);
    const sx = img.naturalWidth  / canvas.width;
    const sy = img.naturalHeight / canvas.height;
    const { x, y, w, h } = cropRef.current;
    const out = document.createElement("canvas");
    out.width  = Math.round(w * sx);
    out.height = Math.round(h * sy);
    out.getContext("2d")!.drawImage(img, x*sx, y*sy, w*sx, h*sy, 0, 0, out.width, out.height);
    setResult(out.toDataURL("image/png"));
    setIsProc(false);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = result; a.download = "cropped-image.png"; a.click();
  };

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); setInfo(""); }
    else   { setFile(null); setPreview(""); setResult(""); setInfo(""); }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone
          accept="image/*"
          onFiles={handleFiles}
          formats="PNG • JPG • WEBP • GIF"
          label="Drag & drop your image here"
        />
      ) : (
        <>
          {/* Aspect ratio pills */}
          <div className="flex flex-wrap gap-1.5">
            {RATIOS.map(r => (
              <Button
                key={r.value}
                size="sm"
                variant={ratio === r.value ? "default" : "outline"}
                className="rounded-xl h-8 text-xs px-3"
                onClick={() => changeRatio(r.value)}
              >
                {r.label}
              </Button>
            ))}
          </div>

          {/* Interactive canvas */}
          <div className="rounded-2xl border border-border overflow-hidden bg-black/5 select-none">
            <canvas
              ref={canvasRef}
              className="w-full block"
              style={{ cursor: "crosshair", touchAction: "none" }}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
            />
          </div>

          {info && (
            <p className="text-xs text-center text-muted-foreground -mt-2">
              Crop: <span className="font-medium text-foreground">{info}</span> — drag to reselect
            </p>
          )}

          <Button onClick={doCrop} disabled={isProcessing} className="w-full h-11 rounded-xl gap-2">
            {isProcessing
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              : "Crop Image"}
          </Button>

          {result && (
            <>
              <ComparisonPreview
                originalSrc={preview}
                originalLabel="Original"
                processedSrc={result}
                processedLabel="Cropped"
              />
              <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2">
                <Download className="h-4 w-4" /> Download Cropped Image
              </Button>
            </>
          )}

          <Button
            variant="ghost" size="sm"
            className="w-full text-muted-foreground"
            onClick={() => handleFiles([])}
          >
            Upload a different image
          </Button>
        </>
      )}
    </div>
  );
};

export default ImageCropperTool;
