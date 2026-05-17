import { useCallback, useEffect, useRef, useState } from "react";

export interface SoundTrack {
  id: string;
  name: string;
  emoji: string;
  src: string;
  volume: number;
  enabled: boolean;
}

const INITIAL_SOUNDS: SoundTrack[] = [
  { id: "rain",    name: "Rain",    emoji: "🌧️", src: "", volume: 0.5, enabled: false },
  { id: "thunder", name: "Thunder", emoji: "⛈️", src: "", volume: 0.5, enabled: false },
  { id: "forest",  name: "Forest",  emoji: "🌲", src: "", volume: 0.5, enabled: false },
  { id: "waves",   name: "Waves",   emoji: "🌊", src: "", volume: 0.5, enabled: false },
  { id: "wind",    name: "Wind",    emoji: "🍃", src: "", volume: 0.5, enabled: false },
  { id: "fire",    name: "Fire",    emoji: "🔥", src: "", volume: 0.5, enabled: false },
  { id: "cafe",    name: "Café",    emoji: "☕", src: "", volume: 0.5, enabled: false },
  { id: "birds",   name: "Birds",   emoji: "🐦", src: "", volume: 0.5, enabled: false },
  { id: "night",   name: "Night",   emoji: "🌙", src: "", volume: 0.5, enabled: false },
  { id: "stream",  name: "Stream",  emoji: "💧", src: "", volume: 0.5, enabled: false },
];

export function useAudioMixer() {
  const [tracks, setTracks] = useState<SoundTrack[]>(INITIAL_SOUNDS);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Sync audio elements with state
  useEffect(() => {
    tracks.forEach((t) => {
      if (!t.src) return;
      let el = audioRefs.current[t.id];
      if (!el) {
        el = new Audio(t.src);
        el.loop = true;
        audioRefs.current[t.id] = el;
      }
      el.volume = t.volume;
      if (t.enabled) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [tracks]);

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((a) => a.pause());
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  }, []);

  const setVolume = useCallback((id: string, volume: number) => {
    setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, volume } : t)));
  }, []);

  const stopAll = useCallback(() => {
    setTracks((ts) => ts.map((t) => ({ ...t, enabled: false })));
  }, []);

  return { tracks, toggle, setVolume, stopAll };
}
