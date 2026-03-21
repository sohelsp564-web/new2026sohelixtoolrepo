import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import JSZip from "jszip";

const QrBatchGenerator = () => {
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; dataUrl: string }[]>([]);

  const generate = useCallback(async () => {
    const lines = input.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    setGenerating(true);
    const results: { url: string; dataUrl: string }[] = [];

    for (const line of lines) {
      const qr = new QRCodeStyling({ width: 300, height: 300, data: line, dotsOptions: { type: "square" } });
      const raw = await qr.getRawData("png");
      if (raw) {
        const blob = raw instanceof Blob ? raw : new Blob([raw as unknown as BlobPart]);
        results.push({ url: line, dataUrl: URL.createObjectURL(blob) });
      }
    }
    setPreviews(results);
    setGenerating(false);
  }, [input]);

  const downloadAll = useCallback(async () => {
    if (!previews.length) return;
    const zip = new JSZip();
    for (let i = 0; i < previews.length; i++) {
      const res = await fetch(previews[i].dataUrl);
      const blob = await res.blob();
      zip.file(`qrcode-${i + 1}.png`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "qrcodes.zip";
    a.click();
  }, [previews]);

  return (
    <div className="space-y-4 border-t border-border pt-6">
      <h3 className="text-sm font-semibold">Batch QR Generator</h3>
      <p className="text-xs text-muted-foreground">Paste multiple URLs (one per line) to generate QR codes for all of them.</p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={5}
        placeholder={"https://site1.com\nhttps://site2.com\nhttps://site3.com"}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
      />
      <div className="flex gap-2">
        <Button onClick={generate} disabled={generating || !input.trim()}>
          {generating ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Generating...</> : "Generate All"}
        </Button>
        {previews.length > 0 && (
          <Button variant="outline" onClick={downloadAll}>
            <Download className="h-4 w-4 mr-1.5" /> Download All as ZIP
          </Button>
        )}
      </div>
      {previews.length > 0 && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3 flex flex-col items-center gap-2">
              <img loading="lazy" src={p.dataUrl} alt={`QR ${i + 1}`} className="w-full aspect-square rounded-lg object-contain" />
              <p className="text-[10px] text-muted-foreground truncate w-full text-center">{p.url.slice(0, 30)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QrBatchGenerator;
