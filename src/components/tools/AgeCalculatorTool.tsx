import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AgeCalculatorTool = () => {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculate = () => {
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    setResult({ years, months, days });
  };

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Date of Birth</label><Input type="date" value={dob} onChange={e => setDob(e.target.value)} /></div>
      <Button onClick={calculate} className="w-full">Calculate Age</Button>
      {result && (
        <div className="grid grid-cols-3 gap-3">
          {[["Years", result.years], ["Months", result.months], ["Days", result.days]].map(([l, v]) => (
            <div key={l as string} className="rounded-lg bg-muted p-4 text-center">
              <div className="text-3xl font-bold text-primary">{v}</div>
              <div className="text-xs text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgeCalculatorTool;
