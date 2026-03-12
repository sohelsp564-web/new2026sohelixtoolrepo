import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Copy, Download, FileSpreadsheet, FileText, ScanText, RotateCcw } from "lucide-react";

const ImageToExcelWordTool = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast({ title: "Please upload a valid image file (JPG, PNG, or WEBP).", variant: "destructive" });
      return;
    }

    setLoading(true);
    setProgress(0);
    setText("");
    setFileName(file.name.replace(/\.[^.]+$/, ""));

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const extracted = result.data.text;
      setText(extracted);
      if (!extracted.trim()) {
        toast({ title: "No text detected in this image." });
      } else {
        toast({ title: "Text extracted successfully!" });
      }
    } catch (err) {
      console.error("OCR error:", err);
      toast({ title: "OCR failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  }, [text]);

  const downloadExcel = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const XLSX = await import("xlsx");
      const lines = text.split("\n").filter((l) => l.trim());
      const rows = lines.map((line) => {
        // Split by tabs first, then by 2+ spaces
        const cells = line.includes("\t")
          ? line.split("\t")
          : line.split(/\s{2,}/);
        return cells.map((c) => c.trim());
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Extracted Text");
      XLSX.writeFile(wb, `${fileName || "extracted"}.xlsx`);
      toast({ title: "Excel file downloaded!" });
    } catch (err) {
      console.error("Excel export error:", err);
      toast({ title: "Excel export failed", description: String(err), variant: "destructive" });
    }
  }, [text, fileName]);

  const downloadWord = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const docxLib = await import("docx");
      const { Document, Packer, Paragraph, TextRun } = docxLib;
      const lines = text.split("\n");
      const paragraphs = lines.map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
          })
      );
      const doc = new Document({
        sections: [{ children: paragraphs }],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName || "extracted"}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Word file downloaded!" });
    } catch (err) {
      console.error("Word export error:", err);
      toast({ title: "Word export failed", description: String(err), variant: "destructive" });
    }
  }, [text, fileName]);

  const reset = useCallback(() => {
    setText("");
    setProgress(0);
    setFileName("");
    setLoading(false);
  }, []);

  return (
    <div className="space-y-5">
      <FileUploadZone
        accept="image/*"
        onFiles={handleFiles}
        formats="JPG • PNG • WEBP"
        label="Drag & drop an image here"
        sublabel="or click to upload"
      />

      {loading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ScanText className="h-4 w-4 animate-pulse" /> Extracting text...
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {text && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Extracted Text Preview
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              placeholder="Extracted text will appear here..."
            />
            <p className="text-xs text-muted-foreground">
              You can edit the text before downloading.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={copyText} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" /> Copy Text
            </Button>
            <Button onClick={downloadExcel} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Download Excel
            </Button>
            <Button onClick={downloadWord} variant="secondary" className="gap-2">
              <FileText className="h-4 w-4" /> Download Word
            </Button>
            <Button onClick={reset} variant="ghost" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageToExcelWordTool;
