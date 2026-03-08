import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

const PdfPageRotatorTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState("90");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [pageCount, setPageCount] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") {
      toast({ title: "Please upload a valid PDF file", variant: "destructive" });
      return;
    }
    setFile(f);
    setPreview("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);

      // Preview first page
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
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
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const deg = parseInt(rotation);

      // Render each page rotated and create new PDF
      let newPdf: jsPDF | null = null;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2, rotation: deg });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;

        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

        if (i === 1) {
          newPdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height] });
        } else {
          newPdf!.addPage([canvas.width, canvas.height], orientation);
        }
        newPdf!.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      }

      newPdf!.save(`rotated-${file.name}`);
    } catch (err) {
      toast({ title: "Error rotating PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".pdf" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {file && (
        <>
          <p className="text-sm text-muted-foreground">{pageCount} page(s) detected</p>
          {preview && <img src={preview} alt="PDF Preview" className="rounded-lg border border-border max-h-48 w-full object-contain" />}
          <div>
            <label className="text-sm font-medium mb-1 block">Rotation</label>
            <Select value={rotation} onValueChange={setRotation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° Clockwise</SelectItem>
                <SelectItem value="180">180°</SelectItem>
                <SelectItem value="270">270° (90° Counter-clockwise)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={rotate} disabled={loading} className="w-full">{loading ? "Rotating..." : "Rotate & Download"}</Button>
        </>
      )}
    </div>
  );
};

export default PdfPageRotatorTool;
