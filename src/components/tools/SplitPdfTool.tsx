import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Download, Scissors } from "lucide-react";

const SplitPdfTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    if (!f || f.type !== "application/pdf") {
      toast({ title: "Please upload a valid PDF", variant: "destructive" });
      return;
    }
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPageCount();
      setTotalPages(pages);
      setFrom("1");
      setTo(String(pages));
    } catch (err) {
      toast({ title: "Error reading PDF", description: String(err), variant: "destructive" });
    }
  };

  const split = async () => {
    if (!file) return;
    const start = parseInt(from);
    const end = parseInt(to);
    if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
      toast({ title: "Invalid page range", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
      const pages = await newDoc.copyPages(srcDoc, indices);
      pages.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split_pages_${start}-${end}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "PDF split successfully!" });
    } catch (err) {
      toast({ title: "Error splitting PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileUploadZone
          accept=".pdf"
          onFiles={handleFiles}
          formats="PDF"
          label="Drag & drop your PDF here"
          sublabel="or click to upload"
        />
      ) : (
        <>
          <div className="rounded-2xl bg-muted p-4 text-center shadow-soft">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-2xl font-bold text-primary mt-1" style={{ fontFamily: "Space Grotesk" }}>
              {totalPages} pages
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From page</Label>
              <Input
                id="from"
                type="number"
                min={1}
                max={totalPages}
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To page</Label>
              <Input
                id="to"
                type="number"
                min={1}
                max={totalPages}
                value={to}
                onChange={e => setTo(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={split} disabled={loading} className="w-full h-11 rounded-xl gap-2">
            <Scissors className="h-4 w-4" />
            {loading ? "Splitting..." : `Extract Pages ${from}–${to}`}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => { setFile(null); setTotalPages(0); }}
          >
            Upload a different PDF
          </Button>
        </>
      )}
    </div>
  );
};

export default SplitPdfTool;
