import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Download } from "lucide-react";

const PdfPageRotatorTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState("90");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [pageCount, setPageCount] = useState(0);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    if (!f || f.type !== "application/pdf") {
      if (f) toast({ title: "Please upload a valid PDF file", variant: "destructive" });
      setFile(null); return;
    }
    setFile(f); setPreview("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      setPageCount(pdf.numPages);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
      setPreview(canvas.toDataURL("image/png"));
    } catch (err) {
      toast({ title: "Error reading PDF", description: String(err), variant: "destructive" });
    }
  };

  const rotate = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const [pdfjsLib, { jsPDF }] = await Promise.all([
        import("pdfjs-dist"),
        import("jspdf"),
      ]);
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const deg = parseInt(rotation);
      let newPdf: InstanceType<typeof jsPDF> | null = null;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2, rotation: deg });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
        if (i === 1) newPdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height] });
        else newPdf!.addPage([canvas.width, canvas.height], orientation);
        newPdf!.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      }
      newPdf!.save(`rotated-${file.name}`);
    } catch (err) {
      toast({ title: "Error rotating PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone accept=".pdf" onFiles={handleFiles} formats="PDF" label="Drag & drop your PDF here" />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{pageCount} page(s) detected</p>
          {preview && (
            <div className="rounded-2xl border border-border p-3 shadow-soft">
              <img loading="lazy" src={preview} alt="PDF Preview" className="rounded-xl max-h-48 w-full object-contain" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">Rotation</label>
            <Select value={rotation} onValueChange={setRotation}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° Clockwise</SelectItem>
                <SelectItem value="180">180°</SelectItem>
                <SelectItem value="270">270° Counter-clockwise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={rotate} disabled={loading} className="w-full h-11 rounded-xl gap-2">
            <Download className="h-4 w-4" /> {loading ? "Rotating..." : "Rotate & Download"}
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { setFile(null); setPreview(""); }}>Upload a different PDF</Button>
        </>
      )}
    </div>
  );
};

export default PdfPageRotatorTool;
