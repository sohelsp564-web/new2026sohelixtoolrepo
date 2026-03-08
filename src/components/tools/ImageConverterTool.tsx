import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const formatMap: Record<string, { from: string; to: string; mime: string }> = {
  "png-to-jpg": { from: "PNG", to: "JPG", mime: "image/jpeg" },
  "jpg-to-png": { from: "JPG", to: "PNG", mime: "image/png" },
  "webp-to-jpg": { from: "WebP", to: "JPG", mime: "image/jpeg" },
  "jpg-to-webp": { from: "JPG", to: "WebP", mime: "image/webp" },
};

const ImageConverterTool = () => {
  const location = useLocation();
  const slug = location.pathname.split("/").pop() || "";
  const fmt = formatMap[slug] || { from: "Image", to: "Image", mime: "image/png" };
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setPreview(URL.createObjectURL(f)); setResult(""); }
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

  const download = () => {
    const ext = fmt.to.toLowerCase();
    const a = document.createElement("a"); a.href = result; a.download = `converted.${ext}`; a.click();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Convert {fmt.from} to {fmt.to} format</p>
      <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {preview && (
        <>
          <img src={preview} alt="Preview" className="rounded-lg border border-border max-h-48 w-full object-contain" />
          <Button onClick={convert} className="w-full">Convert to {fmt.to}</Button>
          {result && (
            <>
              <p className="text-sm text-muted-foreground">✅ Conversion complete!</p>
              <Button onClick={download} variant="outline" className="w-full">Download {fmt.to} File</Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ImageConverterTool;
