import { useCallback, useEffect, useRef, useState } from "react";

export type TimerMode = "focus" | "break";

const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  break: 5 * 60,
};

export function useTimer(autoSwitch = true) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [remaining, setRemaining] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (autoSwitch) {
            const next: TimerMode = mode === "focus" ? "break" : "focus";
            setMode(next);
            return DURATIONS[next];
          }
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return clear;
  }, [running, mode, autoSwitch]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(DURATIONS[mode]);
  }, [mode]);

  const switchMode = useCallback((m: TimerMode) => {
    setMode(m);
    setRemaining(DURATIONS[m]);
    setRunning(false);
  }, []);

  return {
    mode,
    remaining,
    running,
    total: DURATIONS[mode],
    start,
    pause,
    reset,
    switchMode,
  };
}
