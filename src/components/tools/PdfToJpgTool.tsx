import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Download } from "lucide-react";

const PdfToJpgTool = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [hasFile, setHasFile] = useState(false);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      if (file) toast({ title: "Please upload a valid PDF file", variant: "destructive" });
      setHasFile(false);
      return;
    }
    setFileName(file.name);
    setHasFile(true);
    setLoading(true);
    setImages([]);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const results: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        results.push(canvas.toDataURL("image/jpeg", 0.92));
      }
      setImages(results);
    } catch (err) {
      toast({ title: "Error processing PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  const download = (dataUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = dataUrl; a.download = `${fileName.replace(".pdf", "")}-page-${index + 1}.jpg`; a.click();
  };

  return (
    <div className="space-y-5">
      {!hasFile ? (
        <FileUploadZone accept=".pdf" onFiles={handleFiles} formats="PDF" label="Drag & drop your PDF here" />
      ) : (
        <>
          {loading && <p className="text-sm text-muted-foreground text-center animate-pulse-soft">Processing PDF pages...</p>}
          {images.length > 0 && (
            <>
              <Button onClick={() => images.forEach((img, i) => download(img, i))} className="w-full h-11 rounded-xl gap-2">
                <Download className="h-4 w-4" /> Download All {images.length} Pages
              </Button>
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((img, i) => (
                  <div key={i} className="rounded-2xl border border-border p-3 shadow-soft">
                    <img loading="lazy" src={img} alt={`Page ${i + 1}`} className="rounded-xl w-full" />
                    <Button onClick={() => download(img, i)} variant="outline" size="sm" className="w-full mt-2 rounded-xl">Download Page {i + 1}</Button>
                  </div>
                ))}
              </div>
            </>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { setHasFile(false); setImages([]); }}>Upload a different PDF</Button>
        </>
      )}
    </div>
  );
};

export default PdfToJpgTool;
