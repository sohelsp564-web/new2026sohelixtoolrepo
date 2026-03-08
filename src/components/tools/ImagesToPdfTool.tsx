import { useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

const ImagesToPdfTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const generate = async () => {
    if (!files.length) return;
    setLoading(true);
    const pdf = new jsPDF();
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      const img = new Image();
      await new Promise<void>(r => { img.onload = () => r(); img.src = url; });
      const w = pdf.internal.pageSize.getWidth();
      const h = (img.height * w) / img.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(url, "JPEG", 0, 0, w, Math.min(h, pdf.internal.pageSize.getHeight()));
      URL.revokeObjectURL(url);
    }
    pdf.save("images.pdf");
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
