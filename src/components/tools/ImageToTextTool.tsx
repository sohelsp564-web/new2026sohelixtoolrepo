import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Copy, Download, ScanText } from "lucide-react";

const ImageToTextTool = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
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
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
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

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    a.click();
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
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {text && (
        <>
          <Textarea
            value={text}
            readOnly
            rows={10}
            className="font-mono text-sm"
          />
          <div className="flex gap-3">
            <Button onClick={copyText} variant="outline" className="flex-1 gap-2">
              <Copy className="h-4 w-4" /> Copy Text
            </Button>
            <Button onClick={downloadText} className="flex-1 gap-2">
              <Download className="h-4 w-4" /> Download .txt
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageToTextTool;
