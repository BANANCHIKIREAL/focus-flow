import { useCallback, useEffect, useRef, useState } from "react";

export type TimerMode = "focus" | "break";

export interface TimerDurations {
  focus: number; // minutes
  break: number; // minutes
}

export const DEFAULT_DURATIONS: TimerDurations = { focus: 25, break: 5 };
export const MIN_MINUTES = 1;
export const MAX_MINUTES = 180;

export function useTimer(durations: TimerDurations, autoSwitch = true) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [remaining, setRemaining] = useState(durations.focus * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  // Keep latest durations available inside the interval without restarting it
  const durationsRef = useRef(durations);
  useEffect(() => {
    durationsRef.current = durations;
  }, [durations]);

  // When durations change AND timer is idle, reflect the new value immediately
  useEffect(() => {
    if (!running) {
      setRemaining(durations[mode] * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations.focus, durations.break]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (autoSwitch) {
            const next: TimerMode = mode === "focus" ? "break" : "focus";
            setMode(next);
            return durationsRef.current[next] * 60;
          }
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, mode, autoSwitch]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(durationsRef.current[mode] * 60);
  }, [mode]);

  const switchMode = useCallback((m: TimerMode) => {
    setMode(m);
    setRemaining(durationsRef.current[m] * 60);
    setRunning(false);
  }, []);

  return {
    mode,
    remaining,
    running,
    total: durations[mode] * 60,
    start,
    pause,
    reset,
    switchMode,
  };
}
