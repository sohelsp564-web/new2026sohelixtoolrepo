import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import imageCompression from "browser-image-compression";

const ImageCompressorTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [compressed, setCompressed] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState("");
  const [quality, setQuality] = useState([80]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ original: 0, compressed: 0 });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setCompressed(null); setCompressedUrl(""); }
  };

  const compress = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    try {
      const opts = { maxSizeMB: (quality[0] / 100) * (file.size / 1024 / 1024), useWebWorker: true, maxWidthOrHeight: 4096 };
      const out = await imageCompression(file, opts);
      setCompressed(out);
      setCompressedUrl(URL.createObjectURL(out));
      setStats({ original: file.size, compressed: out.size });
    } catch { /* ignore */ }
    setLoading(false);
  }, [file, quality]);

  const download = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a"); a.href = compressedUrl; a.download = `compressed-${file?.name || "image.jpg"}`; a.click();
  };

  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20" />
      {preview && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quality: {quality[0]}%</label>
            <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
          </div>
          <Button onClick={compress} disabled={loading} className="w-full">{loading ? "Compressing..." : "Compress Image"}</Button>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Original ({fmt(file?.size || 0)})</p>
              <img src={preview} alt="Original" className="rounded-lg border border-border max-h-64 w-full object-contain" />
            </div>
            {compressedUrl && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Compressed ({fmt(stats.compressed)}) — {((1 - stats.compressed / stats.original) * 100).toFixed(1)}% smaller</p>
                <img src={compressedUrl} alt="Compressed" className="rounded-lg border border-border max-h-64 w-full object-contain" />
              </div>
            )}
          </div>
          {compressedUrl && <Button onClick={download} variant="outline" className="w-full">Download Compressed Image</Button>}
        </>
      )}
    </div>
  );
};

export default ImageCompressorTool;
