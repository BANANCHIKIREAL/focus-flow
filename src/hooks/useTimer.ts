import { useCallback, useEffect, useRef, useState } from "react";

export interface TimerDurations {
  focus: number; // minutes
}

export const DEFAULT_DURATIONS: TimerDurations = { focus: 25 };
export const MIN_MINUTES = 1;
export const MAX_MINUTES = 180;

export function useTimer(durations: TimerDurations) {
  const [remaining, setRemaining] = useState(durations.focus * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const durationsRef = useRef(durations);
  useEffect(() => {
    durationsRef.current = durations;
  }, [durations]);

  // Reflect duration changes when idle
  useEffect(() => {
    if (!running) {
      setRemaining(durations.focus * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations.focus]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const start = useCallback(() => {
    setRemaining((r) => (r <= 0 ? durationsRef.current.focus * 60 : r));
    setRunning(true);
  }, []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(durationsRef.current.focus * 60);
  }, []);

  return {
    remaining,
    running,
    total: durations.focus * 60,
    start,
    pause,
    reset,
  };
}
