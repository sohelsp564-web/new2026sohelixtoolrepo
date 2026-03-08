import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const PdfToJpgTool = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast({ title: "Please upload a valid PDF file", variant: "destructive" });
      return;
    }
    setFileName(file.name);
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
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
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
    a.href = dataUrl;
    a.download = `${fileName.replace(".pdf", "")}-page-${index + 1}.jpg`;
    a.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => download(img, i));
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".pdf" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {loading && <p className="text-sm text-muted-foreground">Processing PDF pages...</p>}
      {images.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">{images.length} page(s) converted</p>
          <Button onClick={downloadAll} className="w-full">Download All Pages</Button>
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((img, i) => (
              <div key={i} className="space-y-2">
                <img src={img} alt={`Page ${i + 1}`} className="rounded-lg border border-border w-full" />
                <Button onClick={() => download(img, i)} variant="outline" size="sm" className="w-full">Download Page {i + 1}</Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PdfToJpgTool;
