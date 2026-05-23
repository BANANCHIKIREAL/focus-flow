import { useCallback, useEffect, useRef, useState } from "react";

export type SoundIconType =
  | "rain"
  | "thunder"
  | "cloudLightning"
  | "forest"
  | "waves"
  | "fire"
  | "birds"
  | "night"
  | "stream"
  | "cafe"
  | "wind"
  | "book"
  | "bug"
  | "sun"
  | "savannah"
  | "plane"
  | "mountain"
  | "bell"
  | "leaf"
  | "default";

export interface SoundTrack {
  id: string;
  name: string;
  icon: SoundIconType;
  src: string;
  volume: number;
  enabled: boolean;
}

const INITIAL_SOUNDS: SoundTrack[] = [
  {
    id: "rain-thunder",
    name: "Rain & Thunder",
    icon: "rain",
    src: "/sounds/rain-thunder.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "horse-ride",
    name: "Horse Ride & Grassland Windchimes",
    icon: "wind",
    src: "/sounds/horse-ride.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "night-field",
    name: "Night Field",
    icon: "night",
    src: "/sounds/night-field.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "crickets",
    name: "Crickets",
    icon: "bug",
    src: "/sounds/crickets.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "owl",
    name: "Owl",
    icon: "night",
    src: "/sounds/owl.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "waves-medium",
    name: "Medium Waves",
    icon: "waves",
    src: "/sounds/waves-medium.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "book-pages",
    name: "Book Pages",
    icon: "book",
    src: "/sounds/book-pages.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "waves-gentle",
    name: "Gentle Waves",
    icon: "waves",
    src: "/sounds/waves-gentle.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "morning-birds",
    name: "Morning Birds",
    icon: "sun",
    src: "/sounds/morning-birds.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "grassland-wind",
    name: "Grassland Wind",
    icon: "wind",
    src: "/sounds/grassland-wind.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "forest",
    name: "Forest Ambience",
    icon: "forest",
    src: "/sounds/forest.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "savannah",
    name: "Savannah Animals",
    icon: "leaf",
    src: "/sounds/savannah.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "jungle-night-animals",
    name: "Jungle Night Animals",
    icon: "night",
    src: "/sounds/Articulated Sounds - Undiscovered -  Jungle Night Animal Calls Ciccadas Birds.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "airplane-awaiting-takeoff",
    name: "Airplane Takeoff",
    icon: "plane",
    src: "/sounds/Carlos Santa Rita - Airplane awaiting takeoff.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "field-birds-crickets",
    name: "Field Birds & Crickets",
    icon: "birds",
    src: "/sounds/Carlos Santa Rita - Field grassland birds singing insects and crickets.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "ocean-waves-close",
    name: "Ocean Waves",
    icon: "waves",
    src: "/sounds/Charles Rose - White Beach - Ocean Waves Close Recording.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "blackbirds-flock",
    name: "Blackbirds Flock",
    icon: "birds",
    src: "/sounds/Skyclad Sound - Traveling - Blackbirds Bird Flock Background Chirping.wav",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "mountain-wind",
    name: "Mountain Wind",
    icon: "mountain",
    src: "/sounds/Tone Glow Libraries - Mountain Wind - Strong Wind Rushing Through Dead Winter Grass.wav",
    volume: 0.75,
    enabled: false,
  },
];

// Volume multiplier to boost all sounds significantly
const VOLUME_MULTIPLIER = 1.8;

export function useAudioMixer() {
  const [tracks, setTracks] = useState<SoundTrack[]>(INITIAL_SOUNDS);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    tracks.forEach((t) => {
      if (!t.src) return;
      let el = audioRefs.current[t.id];
      if (!el) {
        el = new Audio(t.src);
        el.loop = true;
        audioRefs.current[t.id] = el;
      }
      el.volume = Math.min(1, t.volume * VOLUME_MULTIPLIER);
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
