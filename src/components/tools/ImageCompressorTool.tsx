import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import imageCompression from "browser-image-compression";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";
import { Download } from "lucide-react";

const ImageCompressorTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [quality, setQuality] = useState([80]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ original: 0, compressed: 0 });

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setCompressedUrl(""); }
    else { setFile(null); setPreview(""); setCompressedUrl(""); }
  };

  const compress = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    try {
      const targetSizeMB = Math.max(0.01, (quality[0] / 100) * (file.size / 1024 / 1024));
      const out = await imageCompression(file, { maxSizeMB: targetSizeMB, useWebWorker: true, maxWidthOrHeight: 4096 });
      setCompressedUrl(URL.createObjectURL(out));
      setStats({ original: file.size, compressed: out.size });
    } catch (err) {
      toast({ title: "Compression failed", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  }, [file, quality]);

  const download = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a"); a.href = compressedUrl; a.download = `compressed-${file?.name || "image.jpg"}`; a.click();
  };

  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop your image here" />
      ) : (
        <>
          <div className="space-y-3">
            <label className="text-sm font-medium">Quality: {quality[0]}%</label>
            <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
          </div>
          <Button onClick={compress} disabled={loading} className="w-full h-11 rounded-xl">{loading ? "Compressing..." : "Compress Image"}</Button>
          {compressedUrl ? (
            <>
              <ComparisonPreview
                originalSrc={preview}
                originalLabel={`Original (${fmt(stats.original)})`}
                processedSrc={compressedUrl}
                processedLabel={`Compressed (${fmt(stats.compressed)}) — ${((1 - stats.compressed / stats.original) * 100).toFixed(1)}% smaller`}
              />
              <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2">
                <Download className="h-4 w-4" /> Download Compressed Image
              </Button>
            </>
          ) : (
            <div className="rounded-2xl border border-border p-3">
              <img src={preview} alt="Preview" className="rounded-xl w-full max-h-64 object-contain" />
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => handleFiles([])}>Upload a different image</Button>
        </>
      )}
    </div>
  );
};

export default ImageCompressorTool;
