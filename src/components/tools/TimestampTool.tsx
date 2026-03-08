import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TimestampTool = () => {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState("");

  const convert = () => {
    const num = parseInt(ts);
    const ms = num > 1e12 ? num : num * 1000;
    const d = new Date(ms);
    setDateStr(d.toString());
  };

  const now = () => setTs(String(Math.floor(Date.now() / 1000)));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={ts} onChange={e => setTs(e.target.value)} placeholder="Unix timestamp" className="font-mono" />
        <Button variant="outline" onClick={now}>Now</Button>
      </div>
      <Button onClick={convert} className="w-full">Convert</Button>
      {dateStr && (
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm"><strong>Date:</strong> {dateStr}</p>
          <p className="text-sm"><strong>ISO:</strong> {new Date(parseInt(ts) > 1e12 ? parseInt(ts) : parseInt(ts) * 1000).toISOString()}</p>
        </div>
      )}
    </div>
  );
};

export default TimestampTool;
