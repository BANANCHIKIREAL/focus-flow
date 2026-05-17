import { useCallback, useEffect, useState } from "react";
import { DEFAULT_DURATIONS, type TimerDurations, MIN_MINUTES, MAX_MINUTES } from "./useTimer";
import type { BackgroundVariant } from "@/components/Background";

const KEY_DURATIONS = "focus-space:durations";
const KEY_BG_VARIANT = "focus-space:bg-variant";
const KEY_BG_IMAGE = "focus-space:bg-image";
const KEY_BG_BLUR = "focus-space:bg-blur";

export const MIN_BLUR = 0;
export const MAX_BLUR = 40;
export const DEFAULT_BLUR = 0;

function clamp(n: number) {
  if (Number.isNaN(n)) return MIN_MINUTES;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(n)));
}

function clampBlur(n: number) {
  if (Number.isNaN(n)) return DEFAULT_BLUR;
  return Math.min(MAX_BLUR, Math.max(MIN_BLUR, Math.round(n)));
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useSettings() {
  const [durations, setDurationsState] = useState<TimerDurations>(DEFAULT_DURATIONS);
  const [bgVariant, setBgVariantState] = useState<BackgroundVariant>("aurora");
  const [bgImage, setBgImageState] = useState<string | null>(null);
  const [bgBlur, setBgBlurState] = useState<number>(DEFAULT_BLUR);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const d = readJSON<TimerDurations>(KEY_DURATIONS, DEFAULT_DURATIONS);
    setDurationsState({ focus: clamp(d.focus) });
    const v = (typeof window !== "undefined" && localStorage.getItem(KEY_BG_VARIANT)) as BackgroundVariant | null;
    if (v) setBgVariantState(v);
    const img = typeof window !== "undefined" ? localStorage.getItem(KEY_BG_IMAGE) : null;
    if (img) setBgImageState(img);
    const blurRaw = typeof window !== "undefined" ? localStorage.getItem(KEY_BG_BLUR) : null;
    if (blurRaw != null) setBgBlurState(clampBlur(parseInt(blurRaw, 10)));
    setHydrated(true);
  }, []);

  const setDurations = useCallback((next: Partial<TimerDurations>) => {
    setDurationsState((prev) => {
      const merged: TimerDurations = { focus: clamp(next.focus ?? prev.focus) };
      try { localStorage.setItem(KEY_DURATIONS, JSON.stringify(merged)); } catch {}
      return merged;
    });
  }, []);

  const setBgVariant = useCallback((v: BackgroundVariant) => {
    setBgVariantState(v);
    try { localStorage.setItem(KEY_BG_VARIANT, v); } catch {}
  }, []);

  const setBgImage = useCallback((dataUrl: string | null) => {
    setBgImageState(dataUrl);
    try {
      if (dataUrl) localStorage.setItem(KEY_BG_IMAGE, dataUrl);
      else localStorage.removeItem(KEY_BG_IMAGE);
    } catch {}
  }, []);

  const setBgBlur = useCallback((n: number) => {
    const c = clampBlur(n);
    setBgBlurState(c);
    try { localStorage.setItem(KEY_BG_BLUR, String(c)); } catch {}
  }, []);

  return {
    hydrated,
    durations,
    setDurations,
    bgVariant,
    setBgVariant,
    bgImage,
    setBgImage,
    bgBlur,
    setBgBlur,
  };
}
