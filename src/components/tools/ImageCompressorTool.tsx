import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";
import { Progress } from "@/components/ui/progress";
import { Download, Trash2, Archive, Image as ImageIcon, X } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";
import { cn } from "@/lib/utils";

/* ── types ─────────────────────────────────────────── */
interface ImageResult {
  file: File;
  originalUrl: string;
  originalSize: number;
  compressedUrl: string;
  compressedBlob: Blob;
  compressedSize: number;
  name: string;
}

/* ── canvas helpers ────────────────────────────────── */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function compressToTargetSize(
  img: HTMLImageElement,
  targetBytes: number,
  resizeW?: number,
  resizeH?: number,
  onProgress?: (p: number) => void,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  let w = resizeW || img.naturalWidth;
  let h = resizeH || img.naturalHeight;
  if (resizeW && !resizeH) h = Math.round(img.naturalHeight * (resizeW / img.naturalWidth));
  if (resizeH && !resizeW) w = Math.round(img.naturalWidth * (resizeH / img.naturalHeight));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  let lo = 0.01, hi = 1.0, best: Blob | null = null;
  const maxIter = 15;
  for (let i = 0; i < maxIter; i++) {
    const q = (lo + hi) / 2;
    const blob = await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), "image/jpeg", q),
    );
    onProgress?.(Math.round(((i + 1) / maxIter) * 100));
    if (blob.size <= targetBytes) {
      best = blob;
      lo = q;
    } else {
      hi = q;
    }
    if (Math.abs(blob.size - targetBytes) / targetBytes < 0.05) {
      best = blob;
      break;
    }
  }
  // cleanup
  canvas.width = canvas.height = 0;
  return best ?? await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", lo));
}

async function compressByQuality(
  img: HTMLImageElement,
  quality: number,
  resizeW?: number,
  resizeH?: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  let w = resizeW || img.naturalWidth;
  let h = resizeH || img.naturalHeight;
  if (resizeW && !resizeH) h = Math.round(img.naturalHeight * (resizeW / img.naturalWidth));
  if (resizeH && !resizeW) w = Math.round(img.naturalWidth * (resizeH / img.naturalHeight));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), "image/jpeg", quality / 100),
  );
  canvas.width = canvas.height = 0;
  return blob;
}

/* ── presets ────────────────────────────────────────── */
const SIZE_PRESETS = [
  { label: "20 KB", kb: 20 },
  { label: "50 KB", kb: 50 },
  { label: "100 KB", kb: 100 },
  { label: "200 KB", kb: 200 },
  { label: "500 KB", kb: 500 },
];

const SMART_PRESETS = [
  { label: "Passport Photo", kb: 50 },
  { label: "Government Form", kb: 100 },
  { label: "Website Image", kb: 200 },
  { label: "Email Attachment", kb: 500 },
];

/* ── format helpers ────────────────────────────────── */
const fmtSize = (b: number) =>
  b >= 1024 * 1024
    ? `${(b / 1024 / 1024).toFixed(2)} MB`
    : `${(b / 1024).toFixed(1)} KB`;

/* ── component ─────────────────────────────────────── */
const ImageCompressorTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"quality" | "target">("quality");
  const [quality, setQuality] = useState([80]);
  const [targetKB, setTargetKB] = useState("");
  const [resizeW, setResizeW] = useState("");
  const [resizeH, setResizeH] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ImageResult[]>([]);
  const { measure } = usePerformance("Image Compressor");
  const abortRef = useRef(false);

  const handleFiles = (incoming: File[]) => {
    const images = incoming.filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      toast({ title: "Please upload image files", variant: "destructive" });
      return;
    }
    setFiles(images);
    setResults([]);
  };

  const compress = useCallback(async () => {
    if (!files.length) return;
    const tgt = mode === "target" ? parseInt(targetKB) : 0;
    if (mode === "target" && (!tgt || tgt <= 0)) {
      toast({ title: "Enter a valid target size", variant: "destructive" });
      return;
    }
    setLoading(true);
    setProgress(0);
    abortRef.current = false;
    const allResults: ImageResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        if (abortRef.current) break;
        const file = files[i];
        const dataUrl = await fileToDataUrl(file);
        const img = await loadImage(dataUrl);
        const rw = resizeW ? parseInt(resizeW) : undefined;
        const rh = resizeH ? parseInt(resizeH) : undefined;

        let blob: Blob;
        if (mode === "target") {
          blob = await measure(() =>
            compressToTargetSize(img, tgt * 1024, rw, rh, (p) =>
              setProgress(Math.round(((i + p / 100) / files.length) * 100)),
            ),
          );
        } else {
          blob = await measure(() =>
            compressByQuality(img, quality[0], rw, rh),
          );
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
        allResults.push({
          file,
          originalUrl: dataUrl,
          originalSize: file.size,
          compressedUrl: URL.createObjectURL(blob),
          compressedBlob: blob,
          compressedSize: blob.size,
          name: file.name.replace(/\.[^.]+$/, "") + "_compressed.jpg",
        });
      }
      setResults(allResults);
    } catch (err) {
      toast({ title: "Compression failed", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  }, [files, mode, quality, targetKB, resizeW, resizeH, measure]);

  const downloadOne = (r: ImageResult) => {
    const a = document.createElement("a");
    a.href = r.compressedUrl;
    a.download = r.name;
    a.click();
  };

  const downloadAllZip = async () => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const r of results) {
        zip.file(r.name, r.compressedBlob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = "compressed_images.zip";
      a.click();
      URL.revokeObjectURL(zipUrl);
    } catch {
      toast({ title: "ZIP creation failed", variant: "destructive" });
    }
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.compressedUrl));
    setFiles([]);
    setResults([]);
    setProgress(0);
    setTargetKB("");
    setResizeW("");
    setResizeH("");
    setQuality([80]);
  };

  /* ── render ── */
  return (
    <div className="space-y-5">
      {/* Upload */}
      {files.length === 0 ? (
        <FileUploadZone
          accept="image/*"
          multiple
          onFiles={handleFiles}
          formats="PNG • JPG • WEBP • GIF"
          label="Drag & drop images here"
          sublabel="or click to upload (single or multiple)"
        />
      ) : (
        <>
          {/* File list */}
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
              >
                <ImageIcon className="h-3 w-3" />
                {f.name} ({fmtSize(f.size)})
              </span>
            ))}
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2">
            <Button
              variant={mode === "quality" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("quality")}
              className="rounded-xl"
            >
              Quality Slider
            </Button>
            <Button
              variant={mode === "target" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("target")}
              className="rounded-xl"
            >
              Target Size
            </Button>
          </div>

          {/* Quality mode */}
          {mode === "quality" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Quality: {quality[0]}%</label>
              <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
            </div>
          )}

          {/* Target mode */}
          {mode === "target" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Target File Size (KB)</label>
              <div className="flex flex-wrap gap-2">
                {SIZE_PRESETS.map((p) => (
                  <Button
                    key={p.kb}
                    variant={targetKB === String(p.kb) ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setTargetKB(String(p.kb))}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min={1}
                placeholder="Custom size in KB"
                value={targetKB}
                onChange={(e) => setTargetKB(e.target.value.replace(/\D/g, ""))}
              />

              <p className="text-xs font-medium text-muted-foreground mt-2">Smart Presets</p>
              <div className="flex flex-wrap gap-2">
                {SMART_PRESETS.map((p) => (
                  <Button
                    key={p.label}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setTargetKB(String(p.kb))}
                  >
                    {p.label} ({p.kb} KB)
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Resize options */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Resize (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                min={1}
                placeholder="Width (px)"
                value={resizeW}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setResizeW(v);
                  if (keepAspect) setResizeH("");
                }}
              />
              <Input
                type="number"
                min={1}
                placeholder="Height (px)"
                value={resizeH}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setResizeH(v);
                  if (keepAspect) setResizeW("");
                }}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={keepAspect}
                onChange={(e) => setKeepAspect(e.target.checked)}
                className="accent-primary"
              />
              Maintain aspect ratio
            </label>
          </div>

          {/* Compress button */}
          <Button
            onClick={compress}
            disabled={loading}
            className="w-full h-11 rounded-xl"
          >
            {loading ? "Compressing..." : `Compress ${files.length} Image${files.length > 1 ? "s" : ""}`}
          </Button>

          {/* Progress */}
          {loading && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{progress}%</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((r, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{r.file.name}</p>
                    <span className="text-xs font-bold text-primary">
                      {((1 - r.compressedSize / r.originalSize) * 100).toFixed(1)}% smaller
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-muted p-2">
                      <p className="text-muted-foreground">Original</p>
                      <p className="font-bold">{fmtSize(r.originalSize)}</p>
                    </div>
                    {mode === "target" && (
                      <div className="rounded-lg bg-muted p-2">
                        <p className="text-muted-foreground">Target</p>
                        <p className="font-bold">{targetKB} KB</p>
                      </div>
                    )}
                    <div className="rounded-lg bg-primary/10 p-2">
                      <p className="text-muted-foreground">Compressed</p>
                      <p className="font-bold text-primary">{fmtSize(r.compressedSize)}</p>
                    </div>
                  </div>

                  {/* Before / After */}
                  <ComparisonPreview
                    originalSrc={r.originalUrl}
                    originalLabel={`Original (${fmtSize(r.originalSize)})`}
                    processedSrc={r.compressedUrl}
                    processedLabel={`Compressed (${fmtSize(r.compressedSize)})`}
                  />

                  <Button onClick={() => downloadOne(r)} variant="outline" className="w-full h-10 rounded-xl gap-2">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              ))}

              {/* Bulk actions */}
              {results.length > 1 && (
                <Button onClick={downloadAllZip} className="w-full h-11 rounded-xl gap-2">
                  <Archive className="h-4 w-4" /> Download All as ZIP
                </Button>
              )}
            </div>
          )}

          {/* Reset */}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={reset}>
            <Trash2 className="h-3 w-3 mr-1" /> Reset
          </Button>
        </>
      )}
    </div>
  );
};

export default ImageCompressorTool;
