import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Copy } from "lucide-react";

interface Metadata {
  title: string;
  author: string;
  subject: string;
  creator: string;
  producer: string;
  creationDate: string;
  modDate: string;
  pages: number;
}

const PdfMetadataViewerTool = () => {
  const [meta, setMeta] = useState<Metadata | null>(null);
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
      const info = await pdf.getMetadata();
      const d = (info.info as any) || {};
      setMeta({
        title: d.Title || "N/A", author: d.Author || "N/A", subject: d.Subject || "N/A",
        creator: d.Creator || "N/A", producer: d.Producer || "N/A",
        creationDate: d.CreationDate ? String(d.CreationDate) : "N/A",
        modDate: d.ModDate ? String(d.ModDate) : "N/A", pages: pdf.numPages,
      });
    } catch (err) {
      toast({ title: "Error reading PDF metadata", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {!hasFile ? (
        <FileUploadZone accept=".pdf" onFiles={handleFiles} formats="PDF" label="Drag & drop your PDF here" />
      ) : (
        <>
          {loading && <p className="text-sm text-muted-foreground text-center animate-pulse-soft">Reading metadata...</p>}
          {meta && (
            <div className="space-y-2">
              {Object.entries(meta).map(([key, val]) => (
                <div key={key} className="flex justify-between rounded-xl bg-muted px-4 py-3 shadow-soft">
                  <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="text-sm text-muted-foreground truncate max-w-[60%] text-right">{String(val)}</span>
                </div>
              ))}
              <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(meta, null, 2))} variant="outline" className="w-full h-11 rounded-xl gap-2"><Copy className="h-4 w-4" /> Copy Metadata</Button>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { setHasFile(false); setMeta(null); }}>Upload a different PDF</Button>
        </>
      )}
    </div>
  );
};

export default PdfMetadataViewerTool;
