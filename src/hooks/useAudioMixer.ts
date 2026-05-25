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
    id: "strong-wave",
    name: "Strong Wave",
    icon: "waves",
    src: "/sounds/Волна сильная Charles Rose - White Beach - Ocean Waves Close Recording_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "mountain-wind",
    name: "Mountain Wind",
    icon: "mountain",
    src: "/sounds/Горный ветер Tone Glow Libraries - Mountain Wind - Strong Wind Rushing Through Dead Winter Grass_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "jungle",
    name: "Jungle Night",
    icon: "night",
    src: "/sounds/джунгли Articulated Sounds - Undiscovered -  Jungle Night Animal Calls Ciccadas Birds_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "rain-thunder",
    name: "Rain & Thunder",
    icon: "rain",
    src: "/sounds/Дождь с громом Tone Glow Libraries - Rural Ambiences - Open Field Continuous Rain Distant Thunder Close Thunder_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "ireland-wind",
    name: "Ireland Grassland Wind",
    icon: "wind",
    src: "/sounds/Ирландия Angel Perez Grandi - Irish Nature - Grassland Wind Blowing_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "horse-ride",
    name: "Horse Ride",
    icon: "bell",
    src: "/sounds/конная прогулкаVadi Sound - Cozy Ambiences - Grassland Windchimes Ringing Horse Shangri La China_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "forest",
    name: "Forest Ambience",
    icon: "forest",
    src: "/sounds/лес Dauzkobza - Natural Woodland - Forest Ambience Warbler Birds Chirping Singing_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "night-field",
    name: "Night Field",
    icon: "night",
    src: "/sounds/ночное поле Carlos Santa Rita - Field grassland birds singing insects and crickets _hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "birds",
    name: "Birds",
    icon: "birds",
    src: "/sounds/Птицы Skyclad Sound - Traveling - Blackbirds Bird Flock Background Chirping _hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "savannah",
    name: "Savannah",
    icon: "savannah",
    src: "/sounds/Саванна Articulated Sounds - Undiscovered - Calm Savannah Grassland Animals Calling Birds Insects_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "airplane-cabin",
    name: "Airplane Cabin",
    icon: "plane",
    src: "/sounds/салон самолета Carlos Santa Rita - Airplane awaiting takeoff_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "crickets",
    name: "Crickets",
    icon: "bug",
    src: "/sounds/сверчки refocus - Crickets nearby on the lawn_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "owl",
    name: "Owl",
    icon: "night",
    src: "/sounds/сова Carlos Santa Rita - Owl chirps next to flowing water_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "medium-waves",
    name: "Medium Waves",
    icon: "waves",
    src: "/sounds/Средние волны Charles Rose - White Beach - Calm Waves _hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "book-pages",
    name: "Book Pages",
    icon: "book",
    src: "/sounds/страницы книги Foley Walkers - Flip to the next page book_hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "gentle-wave",
    name: "Gentle Wave",
    icon: "waves",
    src: "/sounds/тихая волна Alexander Gastrell - Wave Break - Gentle Waves Lapping Pebbles and Shells Splashing _hq.mp3",
    volume: 0.75,
    enabled: false,
  },
  {
    id: "morning",
    name: "Morning Birds",
    icon: "sun",
    src: "/sounds/утро Carlos Santa Rita - Dawn - rural area birds chirping in the foreground nature_hq.mp3",
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
