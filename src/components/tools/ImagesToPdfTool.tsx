import { useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/FileUploadZone";
import { Download } from "lucide-react";

const ImagesToPdfTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const toDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const generate = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const pdf = new jsPDF();
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await toDataURL(files[i]);
        const img = new Image();
        await new Promise<void>((r, rej) => { img.onload = () => r(); img.onerror = rej; img.src = dataUrl; });
        const w = pdf.internal.pageSize.getWidth();
        const h = (img.height * w) / img.width;
        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", 0, 0, w, Math.min(h, pdf.internal.pageSize.getHeight()));
      }
      pdf.save("images.pdf");
    } catch (err) {
      toast({ title: "Error creating PDF", description: String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <FileUploadZone accept="image/*" multiple onFiles={setFiles} formats="PNG • JPG • WEBP • GIF" label="Drag & drop images here" sublabel="or click to upload (multiple files supported)" />
      {files.length > 0 && (
        <Button onClick={generate} disabled={loading} className="w-full h-11 rounded-xl gap-2">
          <Download className="h-4 w-4" /> {loading ? "Generating PDF..." : `Create PDF (${files.length} images)`}
        </Button>
      )}
    </div>
  );
};

export default ImagesToPdfTool;
