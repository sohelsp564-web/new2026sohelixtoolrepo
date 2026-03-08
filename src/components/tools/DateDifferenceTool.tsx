import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DateDifferenceTool = () => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const diff = date1 && date2 ? Math.abs(new Date(date2).getTime() - new Date(date1).getTime()) : 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Start Date</label><Input type="date" value={date1} onChange={e => setDate1(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">End Date</label><Input type="date" value={date2} onChange={e => setDate2(e.target.value)} /></div>
      </div>
      {date1 && date2 && (
        <div className="grid grid-cols-3 gap-3">
          {[["Days", days], ["Weeks", weeks], ["Months", months]].map(([l, v]) => (
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

export default DateDifferenceTool;
