import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

const JsonToCsvTool = () => {
  const [input, setInput] = useState("");
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      const data = JSON.parse(input);
      if (!Array.isArray(data) || data.length === 0) { setError("Input must be a non-empty JSON array of objects."); return; }
      const headers = Object.keys(data[0]);
      const rows = data.map((obj: Record<string, unknown>) =>
        headers.map(h => { const v = String(obj[h] ?? ""); return v.includes(",") ? `"${v}"` : v; }).join(",")
      );
      setCsv([headers.join(","), ...rows].join("\n"));
    } catch { setError("Invalid JSON input."); }
  };

  const copy = () => { navigator.clipboard.writeText(csv); toast.success("Copied!"); };
  const download = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "data.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Textarea placeholder='Paste JSON array here...\n[{"name":"John","age":30}]' value={input} onChange={e => setInput(e.target.value)} rows={8} className="font-mono text-sm" />
      <Button onClick={convert} className="w-full">Convert to CSV</Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {csv && (
        <>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CSV Output</p>
              <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={copy}><Copy className="h-3 w-3" /> Copy</Button>
            </div>
            <pre className="text-sm overflow-auto max-h-64 whitespace-pre-wrap font-mono">{csv}</pre>
          </div>
          <Button onClick={download} variant="outline" className="w-full h-11 rounded-xl gap-2"><Download className="h-4 w-4" /> Download CSV</Button>
        </>
      )}
    </div>
  );
};

export default JsonToCsvTool;
