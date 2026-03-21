import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Copy, Download, ScanText, FileText } from "lucide-react";

const ImageToWordTool = () => {
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }
    setLoading(true);
    setProgress(0);
    setText("");

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      setText(result.data.text);
      if (!result.data.text.trim()) {
        toast({ title: "No text detected in this image" });
      }
    } catch (err) {
      toast({ title: "OCR failed", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadDoc = () => {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .split("\n")
      .map(line => `<p>${line || "&nbsp;"}</p>`)
      .join("");

    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Extracted Text</title>
      <style>body{font-family:Arial,sans-serif;font-size:12pt;line-height:1.5;margin:2cm;} p{margin:0 0 4pt;}</style>
      </head><body>${escaped}</body></html>`;

    const blob = new Blob([html], { type: "application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "extracted-text.doc"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <FileUploadZone
        accept="image/*"
        onFiles={handleFiles}
        formats="PNG • JPG • WEBP • GIF • BMP"
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
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {text && (
        <>
          <div className="rounded-2xl border border-border p-4 bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Preview</p>
            <Textarea value={text} readOnly rows={10} className="font-mono text-sm bg-transparent border-0 p-0 focus-visible:ring-0 resize-none" />
          </div>
          <div className="flex gap-3">
            <Button onClick={copyText} variant="outline" className="flex-1 h-11 rounded-xl gap-2">
              <Copy className="h-4 w-4" /> Copy Text
            </Button>
            <Button onClick={downloadDoc} className="flex-1 h-11 rounded-xl gap-2">
              <FileText className="h-4 w-4" /> Download .doc
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl gap-2 text-muted-foreground"
            onClick={() => {
              const blob = new Blob([text], { type: "text/plain" });
              const url  = URL.createObjectURL(blob);
              const a    = document.createElement("a");
              a.href = url; a.download = "extracted-text.txt"; a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4" /> Also download as .txt
          </Button>
        </>
      )}
    </div>
  );
};

export default ImageToWordTool;
