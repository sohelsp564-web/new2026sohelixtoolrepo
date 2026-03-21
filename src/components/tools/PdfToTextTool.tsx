import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Copy, Download, FileText } from "lucide-react";

const PdfToTextTool = () => {
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
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
    setProgress(0);
    setText("");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");
        pages.push(`--- Page ${i} ---\n${pageText}`);
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      const result = pages.join("\n\n");
      setText(result);
      if (!result.trim()) {
        toast({ title: "No text found", description: "This PDF may be image-based or scanned." });
      }
    } catch (err) {
      toast({ title: "Error reading PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(".pdf", "") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {!hasFile ? (
        <FileUploadZone accept=".pdf" onFiles={handleFiles} formats="PDF" label="Drag & drop your PDF here" />
      ) : (
        <>
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 animate-pulse" /> Extracting text...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {text && (
            <>
              <Textarea value={text} readOnly rows={12} className="font-mono text-sm" />
              <div className="flex gap-3">
                <Button onClick={copyText} variant="outline" className="flex-1 h-11 rounded-xl gap-2">
                  <Copy className="h-4 w-4" /> Copy Text
                </Button>
                <Button onClick={downloadTxt} className="flex-1 h-11 rounded-xl gap-2">
                  <Download className="h-4 w-4" /> Download .txt
                </Button>
              </div>
            </>
          )}

          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { setHasFile(false); setText(""); }}>
            Upload a different PDF
          </Button>
        </>
      )}
    </div>
  );
};

export default PdfToTextTool;
