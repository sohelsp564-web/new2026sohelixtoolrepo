import { useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";

const ImagesToPdfTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

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
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={handleFiles} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
      {files.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">{files.length} image(s) selected</p>
          <Button onClick={generate} disabled={loading} className="w-full">{loading ? "Generating..." : "Create PDF"}</Button>
        </>
      )}
    </div>
  );
};

export default ImagesToPdfTool;
