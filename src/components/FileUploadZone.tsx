import React, { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  sublabel?: string;
  formats?: string;
  maxSizeMB?: number;
  children?: React.ReactNode;
}

interface UploadedFile {
  file: File;
  preview?: string;
}

const FileUploadZone = ({
  accept,
  multiple = false,
  onFiles,
  label = "Drag & drop your file here",
  sublabel = "or click to upload",
  formats,
  maxSizeMB = 50,
}: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((fileList: File[]) => {
    const valid = fileList.filter(f => f.size <= maxSizeMB * 1024 * 1024);
    const withPreviews = valid.map(file => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    setUploadedFiles(multiple ? prev => [...prev, ...withPreviews] : withPreviews);
    onFiles(multiple ? [...uploadedFiles.map(u => u.file), ...valid] : valid);
  }, [onFiles, multiple, maxSizeMB, uploadedFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) processFiles(files);
  }, [processFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    if (uploadedFiles[index].preview) URL.revokeObjectURL(uploadedFiles[index].preview!);
    setUploadedFiles(updated);
    onFiles(updated.map(u => u.file));
  };

  const fmtSize = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 cursor-pointer transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01] shadow-glow"
            : "border-border hover:border-primary/40 hover:bg-muted/50"
        )}
      >
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
          isDragging ? "bg-primary text-primary-foreground scale-110" : "bg-primary/10 text-primary"
        )}>
          <Upload className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
        </div>
        {formats && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-1">
            {formats.split("•").map(f => f.trim()).filter(Boolean).map((f, i) => (
              <span key={`${f}-${i}`} className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {f}
              </span>
            ))}
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
      </div>

      {/* File Previews */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          {uploadedFiles.map((uf, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft transition-all hover:shadow-card">
              {uf.preview ? (
                <img loading="lazy" src={uf.preview} alt={uf.file.name} className="h-14 w-14 rounded-lg object-cover border border-border" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uf.file.name}</p>
                <p className="text-xs text-muted-foreground">{fmtSize(uf.file.size)}</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
