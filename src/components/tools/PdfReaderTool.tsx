import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";

const PdfReaderTool = () => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasFile, setHasFile] = useState(false);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      if (file) toast({ title: "Please upload a valid PDF file", variant: "destructive" });
      setHasFile(false); return;
    }
    setHasFile(true);
    setLoading(true);
    setPages([]); setCurrentPage(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const results: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        results.push(canvas.toDataURL("image/png"));
      }
      setPages(results);
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
          {loading && <p className="text-sm text-muted-foreground text-center animate-pulse-soft">Loading PDF...</p>}
          {pages.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="rounded-xl" disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>← Previous</Button>
                <span className="text-sm text-muted-foreground font-medium">Page {currentPage + 1} of {pages.length}</span>
                <Button variant="outline" size="sm" className="rounded-xl" disabled={currentPage === pages.length - 1} onClick={() => setCurrentPage(p => p + 1)}>Next →</Button>
              </div>
              <div className="rounded-2xl border border-border p-3 shadow-soft">
                <img loading="lazy" src={pages[currentPage]} alt={`Page ${currentPage + 1}`} className="rounded-xl w-full" />
              </div>
            </>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { setHasFile(false); setPages([]); }}>Upload a different PDF</Button>
        </>
      )}
    </div>
  );
};

export default PdfReaderTool;
