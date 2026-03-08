import { useCallback, useRef } from "react";
import { perfMonitor } from "@/lib/performanceMonitor";

/**
 * Hook to measure tool operations.
 *
 * Usage:
 *   const { measure, startTimer } = usePerformance("Image Compressor");
 *
 *   // Wrap async work:
 *   const result = await measure(() => compressImage(file));
 *
 *   // Or manual timer:
 *   const stop = startTimer();
 *   doWork();
 *   stop();
 */
export function usePerformance(toolName: string) {
  const toolRef = useRef(toolName);
  toolRef.current = toolName;

  const measure = useCallback(async <T>(fn: () => T | Promise<T>): Promise<T> => {
    return perfMonitor.measure(toolRef.current, fn);
  }, []);

  const startTimer = useCallback((): (() => void) => {
    return perfMonitor.startTimer(toolRef.current);
  }, []);

  const record = useCallback((duration: number) => {
    perfMonitor.record(toolRef.current, duration);
  }, []);

  return { measure, startTimer, record };
}
