import { useCallback, useEffect, useState } from "react";
import { DEFAULT_DURATIONS, type TimerDurations, MIN_MINUTES, MAX_MINUTES } from "./useTimer";
import type { BackgroundVariant } from "@/components/Background";

const KEY_DURATIONS = "focus-space:durations";
const KEY_LUNCH_ENABLED = "focus-space:lunch-enabled";
const KEY_BG_VARIANT = "focus-space:bg-variant";
const KEY_BG_IMAGE = "focus-space:bg-image";
const KEY_BG_BLUR = "focus-space:bg-blur";
const KEY_TIMER_RING_STYLE = "focus-space:timer-ring-style";
const KEY_TIMER_RING_WIDTH = "focus-space:timer-ring-width";
const KEY_TIMER_FONT = "focus-space:timer-font";
const KEY_TIMER_FONT_SIZE = "focus-space:timer-font-size";

export const MIN_BLUR = 0;
export const MAX_BLUR = 40;
export const DEFAULT_BLUR = 0;
export const MIN_TIMER_RING_WIDTH = 2;
export const MAX_TIMER_RING_WIDTH = 10;
export const DEFAULT_TIMER_RING_WIDTH = 3;
export const MIN_TIMER_FONT_SIZE = 72;
export const MAX_TIMER_FONT_SIZE = 132;
export const DEFAULT_TIMER_FONT_SIZE = 112;

export interface TimerRingStyle {
  id: string;
  name: string;
  color: string;
  glow: string;
}

export interface TimerFontStyle {
  id: string;
  name: string;
  className: string;
}

export const TIMER_RING_STYLES: TimerRingStyle[] = [
  { id: "aqua", name: "Aqua", color: "oklch(0.82 0.12 200)", glow: "oklch(0.82 0.12 200)" },
  { id: "violet", name: "Violet", color: "oklch(0.78 0.17 305)", glow: "oklch(0.78 0.17 305)" },
  { id: "sunrise", name: "Sunrise", color: "oklch(0.82 0.16 55)", glow: "oklch(0.82 0.16 55)" },
  { id: "mint", name: "Mint", color: "oklch(0.8 0.14 155)", glow: "oklch(0.8 0.14 155)" },
  { id: "ice", name: "Ice", color: "oklch(0.9 0.06 230)", glow: "oklch(0.9 0.06 230)" },
];

export const TIMER_FONT_STYLES: TimerFontStyle[] = [
  { id: "display", name: "Display", className: "font-display" },
  { id: "system", name: "System", className: "font-sans font-semibold" },
  { id: "mono", name: "Mono", className: "font-mono font-semibold" },
  { id: "serif", name: "Serif", className: "font-serif" },
];

function clamp(n: number) {
  if (Number.isNaN(n)) return MIN_MINUTES;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(n)));
}

function clampBlur(n: number) {
  if (Number.isNaN(n)) return DEFAULT_BLUR;
  return Math.min(MAX_BLUR, Math.max(MIN_BLUR, Math.round(n)));
}

function clampTimerRingWidth(n: number) {
  if (Number.isNaN(n)) return DEFAULT_TIMER_RING_WIDTH;
  return Math.min(MAX_TIMER_RING_WIDTH, Math.max(MIN_TIMER_RING_WIDTH, Math.round(n)));
}

function clampTimerFontSize(n: number) {
  if (Number.isNaN(n)) return DEFAULT_TIMER_FONT_SIZE;
  return Math.min(MAX_TIMER_FONT_SIZE, Math.max(MIN_TIMER_FONT_SIZE, Math.round(n)));
}

function getTimerRingStyle(id: string | null) {
  return TIMER_RING_STYLES.find((style) => style.id === id) ?? TIMER_RING_STYLES[0];
}

function getTimerFontStyle(id: string | null) {
  return TIMER_FONT_STYLES.find((style) => style.id === id) ?? TIMER_FONT_STYLES[0];
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
  const [lunchEnabled, setLunchEnabledState] = useState(false);
  const [bgVariant, setBgVariantState] = useState<BackgroundVariant>("aurora");
  const [bgImage, setBgImageState] = useState<string | null>(null);
  const [bgBlur, setBgBlurState] = useState<number>(DEFAULT_BLUR);
  const [timerRingStyle, setTimerRingStyleState] = useState<TimerRingStyle>(TIMER_RING_STYLES[0]);
  const [timerRingWidth, setTimerRingWidthState] = useState<number>(DEFAULT_TIMER_RING_WIDTH);
  const [timerFontStyle, setTimerFontStyleState] = useState<TimerFontStyle>(TIMER_FONT_STYLES[0]);
  const [timerFontSize, setTimerFontSizeState] = useState<number>(DEFAULT_TIMER_FONT_SIZE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const d = readJSON<TimerDurations>(KEY_DURATIONS, DEFAULT_DURATIONS);
    setDurationsState({
      focus: clamp(d.focus),
      lunch: clamp(d.lunch ?? DEFAULT_DURATIONS.lunch),
    });
    const lunchRaw = typeof window !== "undefined" ? localStorage.getItem(KEY_LUNCH_ENABLED) : null;
    setLunchEnabledState(lunchRaw === "true");
    const v = (typeof window !== "undefined" && localStorage.getItem(KEY_BG_VARIANT)) as BackgroundVariant | null;
    if (v) setBgVariantState(v);
    const img = typeof window !== "undefined" ? localStorage.getItem(KEY_BG_IMAGE) : null;
    if (img) setBgImageState(img);
    const blurRaw = typeof window !== "undefined" ? localStorage.getItem(KEY_BG_BLUR) : null;
    if (blurRaw != null) setBgBlurState(clampBlur(parseInt(blurRaw, 10)));
    const ringStyleId = typeof window !== "undefined" ? localStorage.getItem(KEY_TIMER_RING_STYLE) : null;
    setTimerRingStyleState(getTimerRingStyle(ringStyleId));
    const ringWidthRaw = typeof window !== "undefined" ? localStorage.getItem(KEY_TIMER_RING_WIDTH) : null;
    if (ringWidthRaw != null) setTimerRingWidthState(clampTimerRingWidth(parseInt(ringWidthRaw, 10)));
    const fontStyleId = typeof window !== "undefined" ? localStorage.getItem(KEY_TIMER_FONT) : null;
    setTimerFontStyleState(getTimerFontStyle(fontStyleId));
    const fontSizeRaw = typeof window !== "undefined" ? localStorage.getItem(KEY_TIMER_FONT_SIZE) : null;
    if (fontSizeRaw != null) setTimerFontSizeState(clampTimerFontSize(parseInt(fontSizeRaw, 10)));
    setHydrated(true);
  }, []);

  const setDurations = useCallback((next: Partial<TimerDurations>) => {
    setDurationsState((prev) => {
      const merged: TimerDurations = {
        focus: clamp(next.focus ?? prev.focus),
        lunch: clamp(next.lunch ?? prev.lunch),
      };
      try { localStorage.setItem(KEY_DURATIONS, JSON.stringify(merged)); } catch {}
      return merged;
    });
  }, []);

  const setLunchEnabled = useCallback((enabled: boolean) => {
    setLunchEnabledState(enabled);
    try { localStorage.setItem(KEY_LUNCH_ENABLED, String(enabled)); } catch {}
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

  const setTimerRingStyle = useCallback((id: string) => {
    const nextStyle = getTimerRingStyle(id);
    setTimerRingStyleState(nextStyle);
    try { localStorage.setItem(KEY_TIMER_RING_STYLE, nextStyle.id); } catch {}
  }, []);

  const setTimerRingWidth = useCallback((n: number) => {
    const c = clampTimerRingWidth(n);
    setTimerRingWidthState(c);
    try { localStorage.setItem(KEY_TIMER_RING_WIDTH, String(c)); } catch {}
  }, []);

  const setTimerFontStyle = useCallback((id: string) => {
    const nextStyle = getTimerFontStyle(id);
    setTimerFontStyleState(nextStyle);
    try { localStorage.setItem(KEY_TIMER_FONT, nextStyle.id); } catch {}
  }, []);

  const setTimerFontSize = useCallback((n: number) => {
    const c = clampTimerFontSize(n);
    setTimerFontSizeState(c);
    try { localStorage.setItem(KEY_TIMER_FONT_SIZE, String(c)); } catch {}
  }, []);

  return {
    hydrated,
    durations,
    setDurations,
    lunchEnabled,
    setLunchEnabled,
    bgVariant,
    setBgVariant,
    bgImage,
    setBgImage,
    bgBlur,
    setBgBlur,
    timerRingStyle,
    setTimerRingStyle,
    timerRingWidth,
    setTimerRingWidth,
    timerFontStyle,
    setTimerFontStyle,
    timerFontSize,
    setTimerFontSize,
  };
}
