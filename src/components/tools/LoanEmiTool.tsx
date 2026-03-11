import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CURRENCIES, formatCurrency, getCurrencySymbol } from "@/lib/currencyUtils";
import { exportCSV, exportPDF, copyToClipboard } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Copy, RotateCcw, Download } from "lucide-react";

type DurUnit = "years" | "months" | "days";

const LoanEmiTool = () => {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [duration, setDuration] = useState("5");
  const [durUnit, setDurUnit] = useState<DurUnit>("years");
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState<{ emi: number; total: number; interest: number } | null>(null);
  const [showAmortization, setShowAmortization] = useState(false);

  const getMonths = () => {
    const d = parseFloat(duration) || 0;
    if (durUnit === "years") return Math.round(d * 12);
    if (durUnit === "days") return Math.round(d / 30);
    return Math.round(d);
  };

  const calculate = () => {
    const p = parseFloat(principal), r = parseFloat(rate) / 12 / 100, n = getMonths();
    if (!p || p <= 0 || !r || r <= 0 || !n || n <= 0) return;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    setResult({ emi: Math.round(emi * 100) / 100, total: Math.round(total * 100) / 100, interest: Math.round((total - p) * 100) / 100 });
    setShowAmortization(false);
  };

  const amortization = useMemo(() => {
    if (!result) return [];
    const p = parseFloat(principal);
    const monthlyRate = parseFloat(rate) / 12 / 100;
    const n = getMonths();
    const rows: { month: number; payment: number; principalPart: number; interestPart: number; balance: number }[] = [];
    let balance = p;
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * monthlyRate;
      const principalPart = result.emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      rows.push({ month: i, payment: Math.round(result.emi * 100) / 100, principalPart: Math.round(principalPart * 100) / 100, interestPart: Math.round(interestPart * 100) / 100, balance: Math.round(balance * 100) / 100 });
    }
    return rows;
  }, [result, principal, rate, duration, durUnit]);

  const chartData = result ? [{ name: "Principal", value: parseFloat(principal) }, { name: "Interest", value: result.interest }] : [];
  const sym = getCurrencySymbol(currency);

  const reset = () => { setPrincipal("100000"); setRate("8"); setDuration("5"); setDurUnit("years"); setResult(null); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Loan Amount</label><Input type="number" min="1" value={principal} onChange={e => { setPrincipal(e.target.value); setResult(null); }} /></div>
        <div>
          <label className="text-sm font-medium mb-1 block">Currency</label>
          <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={currency} onChange={e => setCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>)}
          </select>
        </div>
      </div>
      <div><label className="text-sm font-medium mb-1 block">Interest Rate (%/yr)</label><Input type="number" min="0.1" step="0.1" value={rate} onChange={e => { setRate(e.target.value); setResult(null); }} /></div>
      <div>
        <label className="text-sm font-medium mb-1 block">Tenure</label>
        <div className="flex gap-2">
          <Input type="number" min="1" value={duration} onChange={e => { setDuration(e.target.value); setResult(null); }} className="flex-1" />
          <div className="flex gap-1">
            {(["years", "months", "days"] as DurUnit[]).map(u => (
              <button key={u} onClick={() => { setDurUnit(u); setResult(null); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize ${durUnit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{u}</button>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={calculate} className="w-full">Calculate EMI</Button>

      {result && (
        <div id="emi-result" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {([["Monthly EMI", result.emi], ["Total Payment", result.total], ["Total Interest", result.interest]] as const).map(([l, v]) => (
              <div key={l} className="rounded-lg bg-muted p-3 text-center">
                <div className="text-lg font-bold text-primary">{formatCurrency(v, currency)}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">Principal vs Interest</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  <Cell fill="hsl(var(--primary))" />
                  <Cell fill="hsl(var(--muted-foreground))" />
                </Pie>
                <Tooltip formatter={(val: number) => formatCurrency(val, currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <Button variant="outline" className="w-full" onClick={() => setShowAmortization(!showAmortization)}>
              {showAmortization ? "Hide" : "Show"} Amortization Schedule
            </Button>
            {showAmortization && (
              <div className="mt-3 rounded-lg border border-border max-h-80 overflow-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-xs">Month</TableHead><TableHead className="text-xs">Payment</TableHead><TableHead className="text-xs">Principal</TableHead><TableHead className="text-xs">Interest</TableHead><TableHead className="text-xs">Balance</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {amortization.map(row => (
                      <TableRow key={row.month}>
                        <TableCell className="text-xs tabular-nums">{row.month}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(row.payment, currency)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(row.principalPart, currency)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(row.interestPart, currency)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(row.balance, currency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(`EMI: ${formatCurrency(result.emi, currency)}\nTotal: ${formatCurrency(result.total, currency)}\nInterest: ${formatCurrency(result.interest, currency)}`); toast.success("Copied!"); }}><Copy className="h-3.5 w-3.5 mr-1" />Copy</Button>
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Reset</Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF("Loan EMI Results", [
              { label: "Loan Amount", value: formatCurrency(parseFloat(principal), currency) },
              { label: "Rate", value: `${rate}% p.a.` },
              { label: "Tenure", value: `${duration} ${durUnit}` },
              { label: "Monthly EMI", value: formatCurrency(result.emi, currency) },
              { label: "Total Payment", value: formatCurrency(result.total, currency) },
              { label: "Total Interest", value: formatCurrency(result.interest, currency) },
            ], "loan-emi")}><Download className="h-3.5 w-3.5 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV(
              ["Month", "Payment", "Principal", "Interest", "Balance"],
              amortization.map(r => [r.month, r.payment, r.principalPart, r.interestPart, r.balance]),
              "loan-emi"
            )}><Download className="h-3.5 w-3.5 mr-1" />CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanEmiTool;
