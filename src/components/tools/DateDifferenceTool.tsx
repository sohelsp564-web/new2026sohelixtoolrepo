import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

const DateDifferenceTool = () => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const result = useMemo(() => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1), d2 = new Date(date2);
    const [start, end] = d1 < d2 ? [d1, d2] : [d2, d1];

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) { months--; days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const diff = end.getTime() - start.getTime();
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diff / (1000 * 60 * 60));

    return { years, months, days, totalDays, totalWeeks, totalHours };
  }, [date1, date2]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Start Date</label><Input type="date" value={date1} onChange={e => setDate1(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">End Date</label><Input type="date" value={date2} onChange={e => setDate2(e.target.value)} /></div>
      </div>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[["Years", result.years], ["Months", result.months], ["Days", result.days]].map(([l, v]) => (
              <div key={l as string} className="rounded-lg bg-muted p-4 text-center">
                <div className="text-3xl font-bold text-primary">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["Total Days", result.totalDays], ["Total Weeks", result.totalWeeks], ["Total Hours", result.totalHours.toLocaleString()]].map(([l, v]) => (
              <div key={l as string} className="rounded-lg bg-muted/50 p-3 text-center">
                <div className="text-lg font-bold text-foreground">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DateDifferenceTool;
