import { useState } from "react";
import { Input } from "@/components/ui/input";

const TimeDurationTool = () => {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:30");

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const totalMins = (eh * 60 + em) - (sh * 60 + sm);
  const hours = Math.floor(Math.abs(totalMins) / 60);
  const mins = Math.abs(totalMins) % 60;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Start Time</label><Input type="time" value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">End Time</label><Input type="time" value={end} onChange={e => setEnd(e.target.value)} /></div>
      </div>
      <div className="rounded-lg bg-muted p-6 text-center">
        <div className="text-3xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk' }}>{hours}h {mins}m</div>
        <div className="text-sm text-muted-foreground">({Math.abs(totalMins)} minutes total)</div>
      </div>
    </div>
  );
};

export default TimeDurationTool;
