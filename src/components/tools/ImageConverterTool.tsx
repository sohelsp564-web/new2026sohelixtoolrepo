import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import FileUploadZone from "@/components/FileUploadZone";
import { ComparisonPreview } from "@/components/ResultPreview";

const formatMap: Record<string, { from: string; to: string; mime: string; ext: string }> = {
  "png-to-jpg": { from: "PNG", to: "JPG", mime: "image/jpeg", ext: "jpg" },
  "jpg-to-png": { from: "JPG", to: "PNG", mime: "image/png", ext: "png" },
  "webp-to-jpg": { from: "WebP", to: "JPG", mime: "image/jpeg", ext: "jpg" },
  "jpg-to-webp": { from: "JPG", to: "WebP", mime: "image/webp", ext: "webp" },
};

const ImageConverterTool = () => {
  const location = useLocation();
  const slug = location.pathname.split("/").pop() || "";
  const fmt = formatMap[slug] || { from: "Image", to: "Image", mime: "image/png", ext: "png" };
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(""); }
    else { setFile(null); setPreview(""); setResult(""); }
  };

  const convert = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (fmt.mime === "image/jpeg") { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL(fmt.mime, 0.92));
    };
    img.src = preview;
  };

  const download = () => { const a = document.createElement("a"); a.href = result; a.download = `converted.${fmt.ext}`; a.click(); };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept="image/*" onFiles={handleFiles} formats={`${fmt.from} • PNG • JPG • WEBP`} label={`Drag & drop your ${fmt.from} image here`} />
      ) : (
        <>
          <Button onClick={convert} className="w-full h-11 rounded-xl">Convert to {fmt.to}</Button>
          {result ? (
            <>
              <ComparisonPreview originalSrc={preview} originalLabel={`Original (${fmt.from})`} processedSrc={result} processedLabel={`Converted (${fmt.to})`} />
              <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2"><Download className="h-4 w-4" /> Download {fmt.to} File</Button>
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

export default ImageConverterTool;
