import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Download, GripVertical, X, Merge } from "lucide-react";

interface PdfFile {
  file: File;
  name: string;
  pages?: number;
}

const MergePdfTool = () => {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleFiles = useCallback(async (uploaded: File[]) => {
    const pdfs = uploaded.filter(f => f.type === "application/pdf");
    if (pdfs.length < uploaded.length) {
      toast({ title: "Only PDF files are accepted", variant: "destructive" });
    }
    const newFiles: PdfFile[] = pdfs.map(f => ({ file: f, name: f.name }));

    try {
      const { PDFDocument } = await import("pdf-lib");
      for (const pf of newFiles) {
        const bytes = await pf.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        pf.pages = doc.getPageCount();
      }
    } catch { /* pages stay undefined */ }

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setFiles(prev => {
      const next = [...prev];
      const [item] = next.splice(dragIdx, 1);
      next.splice(idx, 0, item);
      return next;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const merge = async () => {
    if (files.length < 2) {
      toast({ title: "Please upload at least 2 PDF files", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();

      for (const pf of files) {
        const bytes = await pf.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }

      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "PDF merged successfully!" });
    } catch (err) {
      toast({ title: "Error merging PDFs", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  const fmtSize = (b: number) =>
    b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-5">
      <FileUploadZone
        accept=".pdf"
        multiple
        onFiles={handleFiles}
        formats="PDF"
        label="Drag & drop PDF files here"
        sublabel="or click to upload (multiple files supported)"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {files.length} file{files.length > 1 ? "s" : ""} — drag to reorder
          </p>
          {files.map((pf, i) => (
            <div
              key={`${pf.name}-${i}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft transition-all hover:shadow-card cursor-grab active:cursor-grabbing ${
                dragIdx === i ? "opacity-50" : ""
              }`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Merge className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{pf.name}</p>
                <p className="text-xs text-muted-foreground">
                  {fmtSize(pf.file.size)}
                  {pf.pages !== undefined && ` • ${pf.pages} page${pf.pages > 1 ? "s" : ""}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeFile(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length >= 2 && (
        <Button onClick={merge} disabled={loading} className="w-full h-11 rounded-xl gap-2">
          <Download className="h-4 w-4" />
          {loading ? "Merging..." : `Merge ${files.length} PDFs`}
        </Button>
      )}
    </div>
  );
};

export default MergePdfTool;
