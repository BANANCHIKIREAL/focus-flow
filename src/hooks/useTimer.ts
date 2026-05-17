import { useCallback, useEffect, useRef, useState } from "react";

export interface TimerDurations {
  focus: number; // minutes
  lunch: number; // minutes
}

export type TimerPhase = "focus" | "lunch";

export const DEFAULT_DURATIONS: TimerDurations = { focus: 25, lunch: 5 };
export const MIN_MINUTES = 1;
export const MAX_MINUTES = 180;

function getPhaseDuration(durations: TimerDurations, phase: TimerPhase) {
  return durations[phase] * 60;
}

export function useTimer(
  durations: TimerDurations,
  lunchEnabled: boolean,
  onComplete?: (phase: TimerPhase) => void,
) {
  const [phase, setPhase] = useState<TimerPhase>("focus");
  const [remaining, setRemaining] = useState(durations.focus * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const durationsRef = useRef(durations);
  const phaseRef = useRef<TimerPhase>("focus");
  const lunchEnabledRef = useRef(lunchEnabled);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  useEffect(() => {
    durationsRef.current = durations;
  }, [durations]);
  useEffect(() => {
    lunchEnabledRef.current = lunchEnabled;
  }, [lunchEnabled]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reflect duration changes when idle
  useEffect(() => {
    if (!running) {
      completedRef.current = false;
      setRemaining(getPhaseDuration(durations, phaseRef.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations.focus, durations.lunch]);

  useEffect(() => {
    if (remaining !== 0 || !running || completedRef.current) return;
    completedRef.current = true;
    const completedPhase = phaseRef.current;
    onCompleteRef.current?.(completedPhase);

    if (completedPhase === "focus" && lunchEnabledRef.current) {
      phaseRef.current = "lunch";
      setPhase("lunch");
      setRemaining(getPhaseDuration(durationsRef.current, "lunch"));
      completedRef.current = false;
      return;
    }

    if (completedPhase === "lunch") {
      phaseRef.current = "focus";
      setPhase("focus");
      setRemaining(getPhaseDuration(durationsRef.current, "focus"));
      completedRef.current = false;
      return;
    }

    setRunning(false);
  }, [remaining, running]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
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
    completedRef.current = false;
    setRemaining((r) => (r <= 0 ? getPhaseDuration(durationsRef.current, phaseRef.current) : r));
    setRunning(true);
  }, []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    completedRef.current = false;
    phaseRef.current = "focus";
    setPhase("focus");
    setRunning(false);
    setRemaining(getPhaseDuration(durationsRef.current, "focus"));
  }, []);

  return {
    phase,
    remaining,
    running,
    total: getPhaseDuration(durations, phase),
    start,
    pause,
    reset,
  };
}
