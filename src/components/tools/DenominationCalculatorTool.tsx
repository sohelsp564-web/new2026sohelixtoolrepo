import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURRENCIES, DENOMINATIONS, getCurrencySymbol, amountToWords, formatCurrency } from "@/lib/currencyUtils";
import { exportCSV, exportPDF, copyToClipboard } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Copy, RotateCcw, Download, Printer } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["hsl(var(--primary))", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b", "#a3a3a3"];

interface DenomRow {
  note: number;
  bundles: number;
  loose: number;
  totalNotes: number;
  amount: number;
}

const DenominationCalculatorTool = () => {
  const [currency, setCurrency] = useState("INR");
  const [inputs, setInputs] = useState<Record<number, { bundles: string; loose: string }>>({});

  const denoms = DENOMINATIONS[currency] || DENOMINATIONS["USD"];
  const sym = getCurrencySymbol(currency);

  const setInput = (note: number, field: "bundles" | "loose", value: string) => {
    // Only allow non-negative integers
    const cleaned = value.replace(/[^0-9]/g, "");
    setInputs(prev => ({ ...prev, [note]: { ...prev[note], bundles: prev[note]?.bundles || "0", loose: prev[note]?.loose || "0", [field]: cleaned } }));
  };

  const rows: DenomRow[] = useMemo(() => {
    return denoms.map(note => {
      const b = parseInt(inputs[note]?.bundles || "0") || 0;
      const l = parseInt(inputs[note]?.loose || "0") || 0;
      const totalNotes = b * 100 + l;
      return { note, bundles: b, loose: l, totalNotes, amount: totalNotes * note };
    });
  }, [denoms, inputs]);

  const totalNotes = rows.reduce((s, r) => s + (r.totalNotes > 0 && r.note >= 5 ? r.totalNotes : 0), 0);
  const totalCoins = rows.reduce((s, r) => s + (r.totalNotes > 0 && r.note < 5 ? r.totalNotes : 0), 0);
  const totalAmount = rows.reduce((s, r) => s + r.amount, 0);

  const chartData = rows.filter(r => r.amount > 0).map(r => ({ name: `${sym}${r.note}`, value: r.amount }));

  const reset = () => setInputs({});

  const resultText = rows.filter(r => r.amount > 0).map(r => `${sym}${r.note} × ${r.totalNotes} = ${sym}${r.amount.toLocaleString()}`).join("\n") + `\n\nTotal: ${formatCurrency(totalAmount, currency)}`;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `<html><head><title>Denomination Breakdown</title><style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f5f5f5;text-align:left}h1{font-size:18px}.total{font-weight:bold;font-size:16px;margin-top:16px}</style></head><body>
    <h1>Denomination Breakdown (${currency})</h1>
    <table><tr><th>Denomination</th><th>Bundles</th><th>Loose</th><th>Total Notes</th><th>Amount</th></tr>
    ${rows.filter(r => r.amount > 0).map(r => `<tr><td>${sym}${r.note}</td><td>${r.bundles}</td><td>${r.loose}</td><td>${r.totalNotes}</td><td>${sym}${r.amount.toLocaleString()}</td></tr>`).join("")}
    </table>
    <p class="total">Total: ${formatCurrency(totalAmount, currency)}</p>
    <p>${amountToWords(totalAmount, currency)}</p>
    <script>window.print();window.close();</script></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Currency</label>
        <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={currency} onChange={e => { setCurrency(e.target.value); setInputs({}); }}>
          {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
        </select>
      </div>

      {/* Denomination inputs */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-3 py-2">Denomination</th>
              <th className="text-center px-3 py-2">Bundles (×100)</th>
              <th className="text-center px-3 py-2">Loose</th>
              <th className="text-right px-3 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {denoms.map(note => {
              const row = rows.find(r => r.note === note)!;
              return (
                <tr key={note} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{sym}{note.toLocaleString()}</td>
                  <td className="px-2 py-1">
                    <Input
                      type="text" inputMode="numeric" pattern="[0-9]*"
                      className="h-8 text-center text-sm"
                      value={inputs[note]?.bundles || ""}
                      onChange={e => setInput(note, "bundles", e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="text" inputMode="numeric" pattern="[0-9]*"
                      className="h-8 text-center text-sm"
                      value={inputs[note]?.loose || ""}
                      onChange={e => setInput(note, "loose", e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.amount > 0 ? `${sym}${row.amount.toLocaleString()}` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live totals */}
      {totalAmount > 0 && (
        <div id="denom-result" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Notes</div>
              <div className="text-xl font-bold text-foreground">{totalNotes.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Coins</div>
              <div className="text-xl font-bold text-foreground">{totalCoins.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Amount</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(totalAmount, currency)}</div>
            </div>
          </div>

          {/* Amount in words */}
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="text-xs text-muted-foreground mb-1">In Words</div>
            <div className="text-sm font-medium text-foreground">{amountToWords(totalAmount, currency)}</div>
          </div>

          {/* Pie Chart */}
          {chartData.length > 1 && (
            <div className="rounded-lg border border-border p-4">
              <h4 className="text-sm font-semibold mb-3">Denomination Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(resultText); toast.success("Copied!"); }}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Reset</Button>
            <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="h-3.5 w-3.5 mr-1" />Print</Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("Denomination Breakdown", [
              { label: "Currency", value: currency },
              ...rows.filter(r => r.amount > 0).map(r => ({ label: `${sym}${r.note}`, value: `× ${r.totalNotes} = ${formatCurrency(r.amount, currency)}` })),
              { label: "Total", value: formatCurrency(totalAmount, currency) },
              { label: "In Words", value: amountToWords(totalAmount, currency) },
            ], "denomination")}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(
              ["Denomination", "Bundles", "Loose", "Total Notes", "Amount"],
              rows.filter(r => r.amount > 0).map(r => [`${sym}${r.note}`, r.bundles, r.loose, r.totalNotes, r.amount]),
              "denomination"
            )}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DenominationCalculatorTool;
