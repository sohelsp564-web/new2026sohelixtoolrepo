import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportCSV, exportPDF, copyToClipboard } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Copy, RotateCcw, Download } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { usePerformance } from "@/hooks/usePerformance";

const INR_DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
const COLORS = ["hsl(var(--primary))", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b", "#a3a3a3"];

interface DenomResult { note: number; count: number; total: number; }

const DenominationCalculatorTool = () => {
  const [amount, setAmount] = useState("5783");
  const [result, setResult] = useState<DenomResult[] | null>(null);
  const [error, setError] = useState("");
  const { measure } = usePerformance("Denomination Calculator");

  const calculate = async () => {
    const val = Math.floor(parseFloat(amount));
    if (!val || val <= 0) { setError("Enter a valid positive amount"); setResult(null); return; }
    setError("");
    await measure(() => {
      let remaining = val;
      const res: DenomResult[] = [];
      for (const note of INR_DENOMINATIONS) {
        const count = Math.floor(remaining / note);
        if (count > 0) {
          res.push({ note, count, total: count * note });
          remaining -= count * note;
        }
      }
      setResult(res);
    });
  };

  const reset = () => { setAmount("5783"); setResult(null); setError(""); };

  const chartData = result?.map(r => ({ name: `₹${r.note}`, value: r.count })) || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Amount (₹ INR)</label>
        <Input type="number" min="1" value={amount} onChange={e => { setAmount(e.target.value); setResult(null); }} placeholder="Enter amount in INR" />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
      <Button className="w-full" onClick={calculate}>Calculate Denomination</Button>

      {result && result.length > 0 && (
        <div id="denom-result" className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">Total Notes/Coins</div>
            <div className="text-2xl font-bold text-primary">{result.reduce((a, r) => a + r.count, 0)}</div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted"><th className="text-left px-3 py-2">Denomination</th><th className="text-right px-3 py-2">Count</th><th className="text-right px-3 py-2">Total</th></tr></thead>
              <tbody>
                {result.map(r => (
                  <tr key={r.note} className="border-t border-border">
                    <td className="px-3 py-2">₹{r.note.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-medium">{r.count}</td>
                    <td className="px-3 py-2 text-right">₹{r.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pie Chart */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold mb-3">Note Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(result.map(r => `₹${r.note} × ${r.count} = ₹${r.total}`).join("\n")); toast.success("Copied!"); }}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Reset</Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("Denomination Breakdown", [
              { label: "Amount", value: `₹${parseInt(amount).toLocaleString()}` },
              ...result.map(r => ({ label: `₹${r.note}`, value: `× ${r.count} = ₹${r.total.toLocaleString()}` })),
            ], "denomination")}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(
              ["Denomination", "Count", "Total"],
              result.map(r => [`₹${r.note}`, r.count, `₹${r.total}`]),
              "denomination"
            )}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DenominationCalculatorTool;
