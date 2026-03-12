import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import FileUploadZone from "@/components/FileUploadZone";
import { Download, GripVertical, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── types ── */
interface UploadedImage {
  file: File;
  preview: string;
  name: string;
  size: number;
}

const PAGE_SIZES: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  fit: [0, 0], // dynamic
};

const fmtSize = (b: number) =>
  b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

/* ── canvas compress helper ── */
function loadImg(src: string): Promise<HTMLImageElement> {
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

async function compressImage(
  img: HTMLImageElement,
  quality: number,
  maxW?: number,
  maxH?: number,
): Promise<string> {
  const canvas = document.createElement("canvas");
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (maxW && w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
  if (maxH && h > maxH) { w = Math.round(w * (maxH / h)); h = maxH; }
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  canvas.width = canvas.height = 0;
  return dataUrl;
}

/* ── component ── */
const ImagesToPdfTool = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [compressQuality, setCompressQuality] = useState("0.8");
  const [maxWidth, setMaxWidth] = useState("");
  const [targetSizeKB, setTargetSizeKB] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultSize, setResultSize] = useState(0);

  const handleFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) {
      toast({ title: "Please upload image files", variant: "destructive" });
      return;
    }
    const newImages: UploadedImage[] = imgs.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const arr = [...prev];
      [arr[from], arr[to]] = [arr[to], arr[from]];
      return arr;
    });
  };

  const removeImage = (i: number) => {
    URL.revokeObjectURL(images[i].preview);
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const generate = useCallback(async () => {
    if (!images.length) return;
    setLoading(true);
    setProgress(0);
    setResultSize(0);

    try {
      const { jsPDF } = await import("jspdf");
      const quality = parseFloat(compressQuality) || 0.8;
      const mw = maxWidth ? parseInt(maxWidth) : undefined;
      const tgtBytes = targetSizeKB ? parseInt(targetSizeKB) * 1024 : 0;

      // Determine initial quality; if targeting size we may need to iterate
      let q = quality;
      let pdfBlob: Blob | null = null;
      const maxAttempts = tgtBytes ? 8 : 1;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const isLandscape = orientation === "landscape";

        // First page to init PDF
        const firstDataUrl = await fileToDataUrl(images[0].file);
        const firstImg = await loadImg(firstDataUrl);
        const firstCompressed = await compressImage(firstImg, q, mw);

        let pW: number, pH: number;
        if (pageSize === "fit") {
          pW = firstImg.naturalWidth;
          pH = firstImg.naturalHeight;
        } else {
          [pW, pH] = PAGE_SIZES[pageSize];
          if (isLandscape) [pW, pH] = [pH, pW];
        }

        const pdf = new jsPDF({
          orientation: isLandscape ? "landscape" : "portrait",
          unit: "pt",
          format: pageSize === "fit" ? [pW, pH] : (pageSize === "a4" ? "a4" : "letter"),
        });

        for (let i = 0; i < images.length; i++) {
          setProgress(Math.round(((i + 1) / images.length) * 90));
          const dataUrl = i === 0 ? firstCompressed : await compressImage(
            await loadImg(await fileToDataUrl(images[i].file)),
            q,
            mw,
          );
          const img = await loadImg(dataUrl);

          if (pageSize === "fit") {
            pW = img.naturalWidth;
            pH = img.naturalHeight;
            if (i > 0) pdf.addPage([pW, pH]);
          } else {
            if (i > 0) pdf.addPage();
          }

          const pgW = pdf.internal.pageSize.getWidth();
          const pgH = pdf.internal.pageSize.getHeight();

          // Fit image within page
          const ratio = Math.min(pgW / img.naturalWidth, pgH / img.naturalHeight);
          const imgW = img.naturalWidth * ratio;
          const imgH = img.naturalHeight * ratio;
          const x = (pgW - imgW) / 2;
          const y = (pgH - imgH) / 2;

          pdf.addImage(dataUrl, "JPEG", x, y, imgW, imgH);
        }

        const arrayBuf = pdf.output("arraybuffer");
        pdfBlob = new Blob([arrayBuf], { type: "application/pdf" });

        if (!tgtBytes || pdfBlob.size <= tgtBytes || q <= 0.05) break;
        q = Math.max(0.05, q * 0.7); // reduce quality
      }

      setProgress(100);
      if (pdfBlob) {
        setResultSize(pdfBlob.size);
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "images.pdf";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      toast({ title: "Error creating PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  }, [images, pageSize, orientation, compressQuality, maxWidth, targetSizeKB]);

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setResultSize(0);
    setProgress(0);
  };

  return (
    <div className="space-y-5">
      {/* Upload zone - always visible */}
      <FileUploadZone
        accept="image/*"
        multiple
        onFiles={handleFiles}
        formats="PNG • JPG • WEBP • GIF"
        label="Drag & drop images here"
        sublabel="or click to upload (multiple files supported)"
      />

      {images.length > 0 && (
        <>
          {/* Image list with reorder */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{images.length} image{images.length > 1 ? "s" : ""} selected</p>
            {images.map((img, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-soft"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <img
                  src={img.preview}
                  alt={img.name}
                  className="h-12 w-12 rounded-lg object-cover border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{img.name}</p>
                  <p className="text-[10px] text-muted-foreground">{fmtSize(img.size)}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveImage(i, i - 1)}
                    disabled={i === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveImage(i, i + 1)}
                    disabled={i === images.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeImage(i)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Page settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Page Size</label>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="fit">Fit to Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Orientation</label>
              <Select value={orientation} onValueChange={(v) => setOrientation(v as "portrait" | "landscape")}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Compression & resize options */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Image Quality</label>
              <Select value={compressQuality} onValueChange={setCompressQuality}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Original</SelectItem>
                  <SelectItem value="0.9">High (90%)</SelectItem>
                  <SelectItem value="0.8">Medium (80%)</SelectItem>
                  <SelectItem value="0.6">Low (60%)</SelectItem>
                  <SelectItem value="0.4">Very Low (40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Max Width (px)</label>
              <Input
                type="number"
                min={100}
                placeholder="e.g. 1920"
                value={maxWidth}
                onChange={(e) => setMaxWidth(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          {/* Target PDF size */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Target PDF Size (optional)</label>
            <div className="flex gap-2">
              {[100, 500, 1024, 2048].map((kb) => (
                <Button
                  key={kb}
                  variant={targetSizeKB === String(kb) ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setTargetSizeKB(String(kb))}
                >
                  {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              min={10}
              placeholder="Custom size in KB"
              value={targetSizeKB}
              onChange={(e) => setTargetSizeKB(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {/* Generate button */}
          <Button onClick={generate} disabled={loading} className="w-full h-11 rounded-xl gap-2">
            <Download className="h-4 w-4" />
            {loading ? "Generating PDF..." : `Create PDF (${images.length} images)`}
          </Button>

          {/* Progress */}
          {loading && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{progress}%</p>
            </div>
          )}

          {/* Result */}
          {resultSize > 0 && !loading && (
            <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
              <p className="text-sm text-muted-foreground">PDF Generated</p>
              <p className="text-2xl font-bold text-primary mt-1">{fmtSize(resultSize)}</p>
              <p className="text-xs text-muted-foreground mt-1">{images.length} pages</p>
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

export default ImagesToPdfTool;
