import { useEffect, useRef, useState } from "react";
import { X, Upload, RotateCcw, Minus, Plus, VolumeX } from "lucide-react";
import { BACKGROUNDS, type BackgroundVariant } from "./Background";
import { SoundMixer } from "./SoundMixer";
import type { SoundTrack } from "@/hooks/useAudioMixer";
import {
  DEFAULT_DURATIONS,
  MAX_MINUTES,
  MIN_MINUTES,
  type TimerDurations,
} from "@/hooks/useTimer";
import { MAX_BLUR, MIN_BLUR } from "@/hooks/useSettings";

interface Props {
  open: boolean;
  onClose: () => void;
  durations: TimerDurations;
  setDurations: (d: Partial<TimerDurations>) => void;
  bgVariant: BackgroundVariant;
  setBgVariant: (v: BackgroundVariant) => void;
  bgImage: string | null;
  setBgImage: (img: string | null) => void;
  bgBlur: number;
  setBgBlur: (n: number) => void;
  tracks: SoundTrack[];
  onToggleTrack: (id: string) => void;
  onVolumeTrack: (id: string, v: number) => void;
  onStopAll: () => void;
}

export function SettingsPanel({
  open,
  onClose,
  durations,
  setDurations,
  bgVariant,
  setBgVariant,
  bgImage,
  setBgImage,
  bgBlur,
  setBgBlur,
  tracks,
  onToggleTrack,
  onVolumeTrack,
  onStopAll,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const activeCount = tracks.filter((t) => t.enabled).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setBgImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] glass border-l border-border transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Settings
            </div>
            <h2 className="font-display text-2xl">Your Focus Space</h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full glass flex items-center justify-center hover:text-primary transition-colors"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-89px)] px-6 py-6 space-y-8">
          {/* Timer */}
          <section className="space-y-4">
            <SectionTitle>Timer</SectionTitle>
            <MinuteStepper
              label="Focus time"
              value={durations.focus}
              onChange={(v) => setDurations({ focus: v })}
            />
            <button
              onClick={() => setDurations(DEFAULT_DURATIONS)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> Reset to 25
            </button>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Changes apply when the timer is idle. A running session won't be interrupted.
            </p>
          </section>

          {/* Atmosphere */}
          <section className="space-y-4">
            <SectionTitle>Atmosphere</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBgVariant(b.id);
                    setBgImage(null);
                  }}
                  className={`h-9 px-4 rounded-full text-xs glass transition-all ${
                    bgVariant === b.id && !bgImage
                      ? "text-foreground glow-ring"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </section>

          {/* Custom image */}
          <section className="space-y-4">
            <SectionTitle>Custom background</SectionTitle>

            <div
              className="aspect-video w-full rounded-2xl overflow-hidden glass flex items-center justify-center relative"
              style={
                bgImage
                  ? {
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!bgImage && (
                <span className="text-xs text-muted-foreground">No image selected</span>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 h-10 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Upload size={14} />
                {bgImage ? "Change background" : "Upload image"}
              </button>
              {bgImage && (
                <button
                  onClick={() => setBgImage(null)}
                  className="h-10 px-4 rounded-full glass text-sm inline-flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Stored locally in your browser and rendered in full resolution.
            </p>
          </section>

          {/* Background blur */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <SectionTitle>Background blur</SectionTitle>
              <span className="text-xs tabular-nums text-muted-foreground">{bgBlur}px</span>
            </div>
            <input
              type="range"
              min={MIN_BLUR}
              max={MAX_BLUR}
              step={1}
              value={bgBlur}
              onChange={(e) => setBgBlur(parseInt(e.target.value, 10))}
              className="w-full accent-primary cursor-pointer"
              aria-label="Background blur"
            />
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Sharp</span>
              <span>Dreamy</span>
            </div>
          </section>

          {/* Sound mixer */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <SectionTitle>Sound mixer</SectionTitle>
                {activeCount > 0 && (
                  <span className="text-xs text-primary">{activeCount} active</span>
                )}
              </div>
              {activeCount > 0 && (
                <button
                  onClick={onStopAll}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <VolumeX size={14} /> Mute all
                </button>
              )}
            </div>
            <SoundMixer tracks={tracks} onToggle={onToggleTrack} onVolume={onVolumeTrack} />
          </section>
        </div>
      </aside>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      {children}
    </div>
  );
}

function MinuteStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [draft, setDraft] = useState<string>(String(value));
  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = (raw: string) => {
    if (raw === "") {
      onChange(MIN_MINUTES);
      setDraft(String(MIN_MINUTES));
      return;
    }
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, n));
    onChange(clamped);
    setDraft(String(clamped));
  };

  const dec = () => onChange(Math.max(MIN_MINUTES, value - 1));
  const inc = () => onChange(Math.min(MAX_MINUTES, value + 1));

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm">{label}</div>
        <div className="text-[11px] text-muted-foreground">
          {MIN_MINUTES}–{MAX_MINUTES} minutes
        </div>
      </div>
      <div className="flex items-center gap-1 glass rounded-full p-1">
        <button
          onClick={dec}
          className="h-8 w-8 rounded-full hover:bg-foreground/10 flex items-center justify-center"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          className="w-14 bg-transparent text-center text-sm tabular-nums focus:outline-none"
        />
        <button
          onClick={inc}
          className="h-8 w-8 rounded-full hover:bg-foreground/10 flex items-center justify-center"
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
