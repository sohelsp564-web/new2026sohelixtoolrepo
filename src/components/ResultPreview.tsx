import React from "react";
import { cn } from "@/lib/utils";

interface ResultPreviewProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ResultPreview = ({ title = "Result", children, className }: ResultPreviewProps) => (
  <div className={cn("rounded-2xl border border-border bg-card p-4 shadow-soft", className)}>
    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">{title}</p>
    {children}
  </div>
);

interface ComparisonPreviewProps {
  originalSrc: string;
  originalLabel: string;
  processedSrc: string;
  processedLabel: string;
}

const ComparisonPreview = ({ originalSrc, originalLabel, processedSrc, processedLabel }: ComparisonPreviewProps) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
      <p className="text-xs text-muted-foreground mb-2 font-medium">{originalLabel}</p>
      <img loading="lazy" src={originalSrc} alt="Original" className="rounded-xl w-full max-h-64 object-contain" />
    </div>
    <div className="rounded-2xl border border-primary/20 bg-card p-3 shadow-soft">
      <p className="text-xs text-primary mb-2 font-medium">{processedLabel}</p>
      <img loading="lazy" src={processedSrc} alt="Processed" className="rounded-xl w-full max-h-64 object-contain" />
    </div>
  </div>
);

export { ResultPreview, ComparisonPreview };
