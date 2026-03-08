import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const CsvToJsonTool = () => {
  const [csv, setCsv] = useState("");
  const [json, setJson] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      const lines = csv.trim().split("\n");
      if (lines.length < 2) { setError("CSV must have at least a header row and one data row."); return; }
      const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
      const result = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = values[i] || ""; });
        return obj;
      });
      setJson(JSON.stringify(result, null, 2));
    } catch { setError("Failed to parse CSV."); }
  };

  const copy = () => { navigator.clipboard.writeText(json); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <Textarea placeholder="Paste CSV data here...\nname,age,city\nJohn,30,NYC" value={csv} onChange={e => setCsv(e.target.value)} rows={8} className="font-mono text-sm" />
      <Button onClick={convert} className="w-full">Convert to JSON</Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {json && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">JSON Output</p>
            <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={copy}><Copy className="h-3 w-3" /> Copy</Button>
          </div>
          <pre className="text-sm overflow-auto max-h-64 whitespace-pre-wrap">{json}</pre>
        </div>
      )}
    </div>
  );
};

export default CsvToJsonTool;
