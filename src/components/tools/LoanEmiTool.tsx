import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const LoanEmiTool = () => {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const [result, setResult] = useState<{ emi: number; total: number; interest: number } | null>(null);
  const [showAmortization, setShowAmortization] = useState(false);

  const calculate = () => {
    const p = parseFloat(principal), r = parseFloat(rate) / 12 / 100, n = parseFloat(years) * 12;
    if (!p || !r || !n) return;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    setResult({ emi: Math.round(emi * 100) / 100, total: Math.round(total * 100) / 100, interest: Math.round((total - p) * 100) / 100 });
    setShowAmortization(false);
  };

  const amortization = useMemo(() => {
    if (!result) return [];
    const p = parseFloat(principal);
    const monthlyRate = parseFloat(rate) / 12 / 100;
    const n = parseFloat(years) * 12;
    const rows: { month: number; payment: number; principalPart: number; interestPart: number; balance: number }[] = [];
    let balance = p;
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * monthlyRate;
      const principalPart = result.emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      rows.push({
        month: i,
        payment: Math.round(result.emi * 100) / 100,
        principalPart: Math.round(principalPart * 100) / 100,
        interestPart: Math.round(interestPart * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      });
    }
    return rows;
  }, [result, principal, rate, years]);

  const chartData = result
    ? [
        { name: "Principal", value: parseFloat(principal) },
        { name: "Interest", value: result.interest },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Loan Amount</label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Interest Rate (%/yr)</label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Tenure (years)</label><Input type="number" value={years} onChange={e => setYears(e.target.value)} /></div>
      </div>
      <Button onClick={calculate} className="w-full">Calculate EMI</Button>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {([["Monthly EMI", result.emi], ["Total Payment", result.total], ["Total Interest", result.interest]] as const).map(([l, v]) => (
              <div key={l} className="rounded-lg bg-muted p-3 text-center">
                <div className="text-lg font-bold text-primary">${v.toLocaleString()}</div>
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
                <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Amortization Table */}
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAmortization(!showAmortization)}
            >
              {showAmortization ? "Hide" : "Show"} Amortization Schedule
            </Button>
            {showAmortization && (
              <div className="mt-3 rounded-lg border border-border max-h-80 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Month</TableHead>
                      <TableHead className="text-xs">Payment</TableHead>
                      <TableHead className="text-xs">Principal</TableHead>
                      <TableHead className="text-xs">Interest</TableHead>
                      <TableHead className="text-xs">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amortization.map(row => (
                      <TableRow key={row.month}>
                        <TableCell className="text-xs tabular-nums">{row.month}</TableCell>
                        <TableCell className="text-xs tabular-nums">${row.payment.toLocaleString()}</TableCell>
                        <TableCell className="text-xs tabular-nums">${row.principalPart.toLocaleString()}</TableCell>
                        <TableCell className="text-xs tabular-nums">${row.interestPart.toLocaleString()}</TableCell>
                        <TableCell className="text-xs tabular-nums">${row.balance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Example Calculation */}
      <Card className="p-4 border-dashed border-border">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">📌 Example Calculation</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Loan Amount:</span> $100,000</p>
          <p><span className="font-medium text-foreground">Interest Rate:</span> 6% per year</p>
          <p><span className="font-medium text-foreground">Term:</span> 10 years</p>
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            <p><span className="font-medium text-foreground">Monthly EMI:</span> $1,110.21</p>
            <p><span className="font-medium text-foreground">Total Payment:</span> $133,224.60</p>
            <p><span className="font-medium text-foreground">Total Interest:</span> $33,224.60</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoanEmiTool;
