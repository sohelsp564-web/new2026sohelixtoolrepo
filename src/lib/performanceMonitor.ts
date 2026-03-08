/**
 * Sohelix Tools — Performance Monitor
 * Tracks tool execution times, detects slow operations, and provides insights.
 * Uses browser Performance API. Zero impact on tool functionality.
 */

const SLOW_THRESHOLD_MS = 500;
const MAX_ENTRIES = 200;

export interface PerfEntry {
  tool: string;
  duration: number;
  timestamp: number;
  status: "ok" | "slow";
}

export interface ToolStats {
  tool: string;
  avg: number;
  min: number;
  max: number;
  count: number;
  slowCount: number;
}

class PerformanceMonitor {
  private entries: PerfEntry[] = [];
  private listeners: Set<() => void> = new Set();

  /** Measure an async or sync operation */
  async measure<T>(tool: string, fn: () => T | Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      this.record(tool, performance.now() - start);
      return result;
    } catch (err) {
      this.record(tool, performance.now() - start);
      throw err;
    }
  }

  /** Record a duration manually */
  record(tool: string, duration: number) {
    const status: PerfEntry["status"] = duration > SLOW_THRESHOLD_MS ? "slow" : "ok";
    const entry: PerfEntry = { tool, duration: Math.round(duration * 100) / 100, timestamp: Date.now(), status };

    this.entries.push(entry);
    if (this.entries.length > MAX_ENTRIES) this.entries.shift();

    // Console logging
    const tag = status === "slow" ? "🔴 SLOW" : "🟢 OK";
    const msg = `${tool} | ${entry.duration.toFixed(1)} ms | ${tag}`;

    if (status === "slow") {
      console.warn(`⚠️ Performance warning: ${tool} processing time exceeded ${SLOW_THRESHOLD_MS}ms threshold (${entry.duration.toFixed(1)}ms).`);
      console.warn(`   Suggestions: Use Web Workers for heavy computation, optimize loops, reduce re-renders.`);
    } else {
      console.log(`⏱ ${msg}`);
    }

    this.notify();
  }

  /** Start a manual timer, returns stop function */
  startTimer(tool: string): () => void {
    const start = performance.now();
    return () => this.record(tool, performance.now() - start);
  }

  /** Get all entries */
  getEntries(): PerfEntry[] {
    return [...this.entries];
  }

  /** Get per-tool statistics */
  getStats(): ToolStats[] {
    const map = new Map<string, number[]>();
    for (const e of this.entries) {
      if (!map.has(e.tool)) map.set(e.tool, []);
      map.get(e.tool)!.push(e.duration);
    }
    return Array.from(map.entries()).map(([tool, durations]) => ({
      tool,
      avg: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length * 100) / 100,
      min: Math.round(Math.min(...durations) * 100) / 100,
      max: Math.round(Math.max(...durations) * 100) / 100,
      count: durations.length,
      slowCount: durations.filter(d => d > SLOW_THRESHOLD_MS).length,
    })).sort((a, b) => b.avg - a.avg);
  }

  /** Get slow entries */
  getSlowEntries(): PerfEntry[] {
    return this.entries.filter(e => e.status === "slow");
  }

  /** Subscribe to changes */
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  /** Clear all entries */
  clear() {
    this.entries = [];
    this.notify();
  }

  /** Check if long task API is available and monitor */
  observeLongTasks() {
    if (typeof PerformanceObserver === "undefined") return;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(1)}ms — may block UI thread.`);
          }
        }
      });
      observer.observe({ type: "longtask", buffered: true });
    } catch {
      // longtask not supported in this browser
    }
  }

  /** Print performance summary to console */
  printSummary() {
    const stats = this.getStats();
    if (stats.length === 0) {
      console.log("📊 No performance data recorded yet.");
      return;
    }
    console.group("📊 Sohelix Tools — Performance Summary");
    console.table(stats.map(s => ({
      "Tool": s.tool,
      "Avg (ms)": s.avg,
      "Min (ms)": s.min,
      "Max (ms)": s.max,
      "Runs": s.count,
      "Slow": s.slowCount,
    })));
    const slow = this.getSlowEntries();
    if (slow.length > 0) {
      console.warn(`⚠️ ${slow.length} slow operation(s) detected. Consider:`);
      console.warn("   • Offloading heavy work to Web Workers");
      console.warn("   • Optimizing loops and array operations");
      console.warn("   • Using useMemo/useCallback to reduce re-renders");
      console.warn("   • Debouncing rapid input processing");
    }
    console.groupEnd();
  }
}

/** Singleton instance */
export const perfMonitor = new PerformanceMonitor();

// Auto-observe long tasks on init
if (typeof window !== "undefined") {
  perfMonitor.observeLongTasks();
  // Expose to dev console
  (window as any).__sohelixPerf = perfMonitor;
}
