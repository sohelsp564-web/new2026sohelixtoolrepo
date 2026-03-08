import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TimeDurationTool = () => {
  const [mode, setMode] = useState<"duration" | "add" | "subtract">("duration");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:30");
  const [h, setH] = useState("1");
  const [m, setM] = useState("30");
  const [s, setS] = useState("0");

  // Duration mode
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const totalMins = (eh * 60 + em) - (sh * 60 + sm);
  const dHours = Math.floor(Math.abs(totalMins) / 60);
  const dMins = Math.abs(totalMins) % 60;

  // Add/Subtract mode
  const baseSeconds = (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
  const [addH2, setAddH2] = useState("0");
  const [addM2, setAddM2] = useState("30");
  const [addS2, setAddS2] = useState("0");
  const addSeconds = (parseInt(addH2) || 0) * 3600 + (parseInt(addM2) || 0) * 60 + (parseInt(addS2) || 0);
  const resultSeconds = mode === "add" ? baseSeconds + addSeconds : baseSeconds - addSeconds;
  const absResult = Math.abs(resultSeconds);
  const rH = Math.floor(absResult / 3600);
  const rM = Math.floor((absResult % 3600) / 60);
  const rS = absResult % 60;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["duration", "add", "subtract"] as const).map(md => (
          <button
            key={md}
            onClick={() => setMode(md)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${mode === md ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {md === "duration" ? "Duration" : md === "add" ? "Add Time" : "Subtract Time"}
          </button>
        ))}
      </div>

      {mode === "duration" ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium mb-1 block">Start Time</label><Input type="time" value={start} onChange={e => setStart(e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">End Time</label><Input type="time" value={end} onChange={e => setEnd(e.target.value)} /></div>
          </div>
          <div className="rounded-lg bg-muted p-6 text-center">
            <div className="text-3xl font-bold text-primary">{dHours}h {dMins}m</div>
            <div className="text-sm text-muted-foreground">({Math.abs(totalMins)} minutes total)</div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="text-sm font-medium mb-1 block">Base Time</label>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs text-muted-foreground">Hours</label><Input type="number" min="0" value={h} onChange={e => setH(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Minutes</label><Input type="number" min="0" value={m} onChange={e => setM(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Seconds</label><Input type="number" min="0" value={s} onChange={e => setS(e.target.value)} /></div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{mode === "add" ? "Add" : "Subtract"}</label>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs text-muted-foreground">Hours</label><Input type="number" min="0" value={addH2} onChange={e => setAddH2(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Minutes</label><Input type="number" min="0" value={addM2} onChange={e => setAddM2(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Seconds</label><Input type="number" min="0" value={addS2} onChange={e => setAddS2(e.target.value)} /></div>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {resultSeconds < 0 ? "−" : ""}{rH}h {rM}m {rS}s
            </div>
            <div className="text-sm text-muted-foreground">({Math.abs(resultSeconds).toLocaleString()} seconds total)</div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeDurationTool;
