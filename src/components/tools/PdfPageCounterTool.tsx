import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const PdfPageCounterTool = () => {
  const [info, setInfo] = useState<{ pages: number; name: string; size: string } | null>(null);
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
      const size = file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`;
      setInfo({ pages: pdf.numPages, name: file.name, size });
    } catch (err) {
      toast({ title: "Error reading PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".pdf" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {loading && <p className="text-sm text-muted-foreground">Reading PDF...</p>}
      {info && (
        <div className="grid grid-cols-3 gap-3">
          {[["Pages", info.pages], ["File Name", info.name], ["File Size", info.size]].map(([l, v]) => (
            <div key={l as string} className="rounded-lg bg-muted p-4 text-center">
              <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk' }}>{v}</div>
              <div className="text-xs text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfPageCounterTool;
