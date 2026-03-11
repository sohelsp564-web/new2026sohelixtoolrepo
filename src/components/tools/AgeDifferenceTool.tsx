import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

const AgeDifferenceTool = () => {
  const [dob1, setDob1] = useState("");
  const [dob2, setDob2] = useState("");

  const result = useMemo(() => {
    if (!dob1 || !dob2) return null;
    const d1 = new Date(dob1), d2 = new Date(dob2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const [start, end] = d1 < d2 ? [d1, d2] : [d2, d1];

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) { months--; days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const diff = end.getTime() - start.getTime();
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    return { years, months, days, totalDays, totalWeeks, totalMonths };
  }, [dob1, dob2]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Date of Birth 1</label>
          <Input type="date" value={dob1} onChange={e => setDob1(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Date of Birth 2</label>
          <Input type="date" value={dob2} onChange={e => setDob2(e.target.value)} />
        </div>
      </div>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {([["Years", result.years], ["Months", result.months], ["Days", result.days]] as const).map(([l, v]) => (
              <div key={l} className="rounded-lg bg-muted p-4 text-center">
                <div className="text-3xl font-bold text-primary">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([["Total Months", result.totalMonths], ["Total Weeks", result.totalWeeks], ["Total Days", result.totalDays]] as const).map(([l, v]) => (
              <div key={l} className="rounded-lg bg-muted/50 p-3 text-center">
                <div className="text-lg font-bold text-foreground">{v.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AgeDifferenceTool;
