import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const LoanEmiTool = () => {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const [result, setResult] = useState<{ emi: number; total: number; interest: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal), r = parseFloat(rate) / 12 / 100, n = parseFloat(years) * 12;
    if (!p || !r || !n) return;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    setResult({ emi: Math.round(emi * 100) / 100, total: Math.round(total * 100) / 100, interest: Math.round((total - p) * 100) / 100 });
  };

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
        </>
      )}
    </div>
  );
};

export default LoanEmiTool;
