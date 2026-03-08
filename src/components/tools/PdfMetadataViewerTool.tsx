import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast({ title: "Please upload a valid PDF file", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const info = await pdf.getMetadata();
      const d = (info.info as any) || {};

      setMeta({
        title: d.Title || "N/A",
        author: d.Author || "N/A",
        subject: d.Subject || "N/A",
        creator: d.Creator || "N/A",
        producer: d.Producer || "N/A",
        creationDate: d.CreationDate ? String(d.CreationDate) : "N/A",
        modDate: d.ModDate ? String(d.ModDate) : "N/A",
        pages: pdf.numPages,
      });
    } catch (err) {
      toast({ title: "Error reading PDF metadata", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".pdf" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {loading && <p className="text-sm text-muted-foreground">Reading metadata...</p>}
      {meta && (
        <div className="space-y-2">
          {Object.entries(meta).map(([key, val]) => (
            <div key={key} className="flex justify-between rounded-lg bg-muted px-4 py-2">
              <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
              <span className="text-sm text-muted-foreground truncate max-w-[60%] text-right">{String(val)}</span>
            </div>
          ))}
          <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(meta, null, 2))} variant="outline" className="w-full">Copy Metadata</Button>
        </div>
      )}
    </div>
  );
};

export default PdfMetadataViewerTool;
