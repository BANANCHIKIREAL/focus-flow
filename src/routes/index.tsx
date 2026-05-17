import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, VolumeX } from "lucide-react";
import { Background } from "@/components/Background";
import { Timer } from "@/components/Timer";
import { SoundMixer } from "@/components/SoundMixer";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useAudioMixer } from "@/hooks/useAudioMixer";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/")({
  component: FocusSpace,
  head: () => ({
    meta: [
      { title: "Focus Space — Ambient sounds & focus timer" },
      {
        name: "description",
        content:
          "A calm focus space combining an ambient sound mixer and a customizable Pomodoro timer. Mix rain, forest, waves and set your own background.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
});

function FocusSpace() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    durations,
    setDurations,
    bgVariant,
    setBgVariant,
    bgImage,
    setBgImage,
  } = useSettings();
  const { tracks, toggle, setVolume, stopAll } = useAudioMixer();
  const activeCount = tracks.filter((t) => t.enabled).length;

  return (
    <div className="dark relative h-screen w-screen flex flex-col text-foreground">
      <Background variant={bgVariant} image={bgImage} />

      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
          <span className="text-sm tracking-wide">
            <span className="font-display text-base">Focus</span>
            <span className="text-muted-foreground"> Space</span>
          </span>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="h-9 px-4 rounded-full glass text-xs inline-flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Settings size={14} /> Settings
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <h1 className="sr-only">Focus Space — ambient sounds and focus timer</h1>
        <Timer durations={durations} />
      </main>

      <footer className="px-4 sm:px-6 pb-6">
        <div className="mx-auto max-w-5xl glass rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Sound Mixer
              </span>
              {activeCount > 0 && (
                <span className="text-xs text-primary">{activeCount} active</span>
              )}
            </div>
            {activeCount > 0 && (
              <button
                onClick={stopAll}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <VolumeX size={14} /> Mute all
              </button>
            )}
          </div>
          <SoundMixer tracks={tracks} onToggle={toggle} onVolume={setVolume} />
        </div>
      </footer>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        durations={durations}
        setDurations={setDurations}
        bgVariant={bgVariant}
        setBgVariant={setBgVariant}
        bgImage={bgImage}
        setBgImage={setBgImage}
      />
    </div>
  );
}
