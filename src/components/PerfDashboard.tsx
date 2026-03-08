import { useState, useEffect } from "react";
import { perfMonitor, type PerfEntry, type ToolStats } from "@/lib/performanceMonitor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PerfDashboard = () => {
  const [stats, setStats] = useState<ToolStats[]>([]);
  const [recent, setRecent] = useState<PerfEntry[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      setStats(perfMonitor.getStats());
      setRecent(perfMonitor.getEntries().slice(-20).reverse());
    };
    update();
    return perfMonitor.subscribe(update);
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform"
        title="Performance Dashboard"
      >
        ⏱
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[420px] max-h-[70vh] overflow-auto rounded-2xl border border-border bg-background shadow-2xl">
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
        <h3 className="font-bold text-sm" style={{ fontFamily: "Space Grotesk" }}>⏱ Performance Monitor</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { perfMonitor.clear(); }}>Clear</Button>
          <Button variant="outline" size="sm" onClick={() => perfMonitor.printSummary()}>Log</Button>
          <Button variant="ghost" size="sm" onClick={() => setVisible(false)}>✕</Button>
        </div>
      </div>

      {stats.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground text-center">No data yet. Use a tool to start tracking.</p>
      ) : (
        <div className="p-4 space-y-4">
          {/* Stats Table */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Tool Statistics</h4>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 font-medium">Tool</th>
                    <th className="text-right p-2 font-medium">Avg</th>
                    <th className="text-right p-2 font-medium">Max</th>
                    <th className="text-right p-2 font-medium">Runs</th>
                    <th className="text-right p-2 font-medium">Slow</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.tool} className="border-t border-border/50">
                      <td className="p-2 font-medium truncate max-w-[140px]">{s.tool}</td>
                      <td className={`p-2 text-right tabular-nums ${s.avg > 500 ? "text-destructive font-bold" : ""}`}>
                        {s.avg.toFixed(0)}ms
                      </td>
                      <td className={`p-2 text-right tabular-nums ${s.max > 500 ? "text-destructive" : ""}`}>
                        {s.max.toFixed(0)}ms
                      </td>
                      <td className="p-2 text-right tabular-nums">{s.count}</td>
                      <td className="p-2 text-right">
                        {s.slowCount > 0 ? (
                          <span className="text-destructive font-bold">{s.slowCount}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Entries */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Recent Operations</h4>
            <div className="space-y-1">
              {recent.map((e, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
                    e.status === "slow" ? "bg-destructive/10 text-destructive" : "bg-muted/30"
                  }`}
                >
                  <span className="truncate max-w-[180px] font-medium">{e.tool}</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">{e.duration.toFixed(1)}ms</span>
                    <span>{e.status === "slow" ? "🔴" : "🟢"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfDashboard;
