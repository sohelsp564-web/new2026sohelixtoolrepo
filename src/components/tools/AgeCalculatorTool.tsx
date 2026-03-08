import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AgeCalculatorTool = () => {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [now, setNow] = useState(new Date());
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    if (!calculated) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [calculated]);

  const result = useMemo(() => {
    if (!dob || !calculated) return null;
    const [y, m, d] = dob.split("-").map(Number);
    const [h = 0, min = 0] = tob ? tob.split(":").map(Number) : [];
    const birth = new Date(y, m - 1, d, h, min, 0);
    if (isNaN(birth.getTime())) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const hours = now.getHours() - birth.getHours() + (now.getMinutes() < birth.getMinutes() ? -1 : 0);
    const minutes = (now.getMinutes() - birth.getMinutes() + 60) % 60;
    const seconds = (now.getSeconds() - birth.getSeconds() + 60) % 60;

    // Next birthday
    let nextBirthday = new Date(now.getFullYear(), m - 1, d);
    if (nextBirthday.getTime() <= now.getTime()) {
      nextBirthday = new Date(now.getFullYear() + 1, m - 1, d);
    }
    const bdayDiffMs = nextBirthday.getTime() - now.getTime();
    const bdayDays = Math.floor(bdayDiffMs / (1000 * 60 * 60 * 24));
    const bdayHours = Math.floor((bdayDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const bdayMinutes = Math.floor((bdayDiffMs % (1000 * 60 * 60)) / (1000 * 60));
    const bdaySeconds = Math.floor((bdayDiffMs % (1000 * 60)) / 1000);

    return {
      years, months, days,
      hours: ((hours % 24) + 24) % 24,
      minutes,
      seconds,
      totalMonths, totalWeeks, totalDays, totalHours, totalMinutes, totalSeconds,
      nextBirthday: { days: bdayDays, hours: bdayHours, minutes: bdayMinutes, seconds: bdaySeconds, turningAge: years + 1 },
    };
  }, [dob, tob, now, calculated]);

  const calculate = () => setCalculated(true);

  const primaryStats = result
    ? [
        { label: "Years", value: result.years },
        { label: "Months", value: result.months },
        { label: "Days", value: result.days },
        { label: "Hours", value: result.hours },
        { label: "Minutes", value: result.minutes },
        { label: "Seconds", value: result.seconds },
      ]
    : [];

  const detailedStats = result
    ? [
        { label: "Total Months", value: result.totalMonths.toLocaleString() },
        { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
        { label: "Total Days", value: result.totalDays.toLocaleString() },
        { label: "Total Hours", value: result.totalHours.toLocaleString() },
        { label: "Total Minutes", value: result.totalMinutes.toLocaleString() },
        { label: "Total Seconds", value: result.totalSeconds.toLocaleString() },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Date of Birth</label>
          <Input type="date" value={dob} onChange={e => { setDob(e.target.value); setCalculated(false); }} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Time of Birth <span className="text-muted-foreground">(optional)</span></label>
          <Input type="time" value={tob} onChange={e => { setTob(e.target.value); setCalculated(false); }} />
        </div>
      </div>
      <Button onClick={calculate} className="w-full" disabled={!dob}>Calculate Age</Button>

      {result && (
        <>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Age</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {primaryStats.map(s => (
                <div key={s.label} className="rounded-xl bg-muted p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary tabular-nums">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Detailed Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {detailedStats.map(s => (
                <Card key={s.label} className="p-3 text-center border-transparent shadow-none bg-muted/50">
                  <div className="text-lg font-bold text-foreground tabular-nums">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">🎂 Next Birthday Countdown (Turning {result.nextBirthday.turningAge})</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Days", value: result.nextBirthday.days },
                { label: "Hours", value: result.nextBirthday.hours },
                { label: "Minutes", value: result.nextBirthday.minutes },
                { label: "Seconds", value: result.nextBirthday.seconds },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-primary/10 p-3 text-center">
                  <div className="text-2xl font-bold text-primary tabular-nums">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Example Calculation */}
      <div className="rounded-lg border border-dashed border-border p-4">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">📌 Example Calculation</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Date of Birth:</span> January 15, 1990</p>
          <p><span className="font-medium text-foreground">Current Date:</span> March 8, 2026</p>
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            <p><span className="font-medium text-foreground">Age:</span> 36 years, 1 month, 21 days</p>
            <p><span className="font-medium text-foreground">Total Days:</span> 13,201</p>
            <p><span className="font-medium text-foreground">Total Weeks:</span> 1,885</p>
            <p><span className="font-medium text-foreground">Total Hours:</span> 316,824</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculatorTool;
