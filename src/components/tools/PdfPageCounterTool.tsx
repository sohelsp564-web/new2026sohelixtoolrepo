import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";

const PdfPageCounterTool = () => {
  const [info, setInfo] = useState<{ pages: number; name: string; size: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      if (file) toast({ title: "Please upload a valid PDF file", variant: "destructive" });
      setHasFile(false); return;
    }
    setHasFile(true);
    setLoading(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const size = file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`;
      setInfo({ pages: pdf.numPages, name: file.name, size });
    } catch (err) {
      toast({ title: "Error reading PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {!hasFile ? (
        <FileUploadZone accept=".pdf" onFiles={handleFiles} formats="PDF" label="Drag & drop your PDF here" />
      ) : (
        <>
          {loading && <p className="text-sm text-muted-foreground text-center animate-pulse-soft">Reading PDF...</p>}
          {info && (
            <div className="grid grid-cols-3 gap-3">
              {[["Pages", info.pages], ["File", info.name], ["Size", info.size]].map(([l, v]) => (
                <div key={l as string} className="rounded-2xl bg-muted p-4 text-center shadow-soft">
                  <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk' }}>{v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { setHasFile(false); setInfo(null); }}>Upload a different PDF</Button>
        </>
      )}
    </div>
  );
};

export default PdfPageCounterTool;
