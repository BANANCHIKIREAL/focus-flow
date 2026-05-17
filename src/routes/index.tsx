import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings } from "lucide-react";
import { Background } from "@/components/Background";
import { Timer } from "@/components/Timer";
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
    bgBlur,
    setBgBlur,
  } = useSettings();
  const { tracks, toggle, setVolume, stopAll } = useAudioMixer();
  const activeCount = tracks.filter((t) => t.enabled).length;

  return (
    <div className="dark relative min-h-screen w-full flex flex-col text-foreground">
      <Background variant={bgVariant} image={bgImage} blur={bgBlur} />

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
          <Settings size={14} />
          Settings
          {activeCount > 0 && (
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
          )}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <h1 className="sr-only">Focus Space — ambient sounds and focus timer</h1>
        <Timer durations={durations} />
      </main>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        durations={durations}
        setDurations={setDurations}
        bgVariant={bgVariant}
        setBgVariant={setBgVariant}
        bgImage={bgImage}
        setBgImage={setBgImage}
        bgBlur={bgBlur}
        setBgBlur={setBgBlur}
        tracks={tracks}
        onToggleTrack={toggle}
        onVolumeTrack={setVolume}
        onStopAll={stopAll}
      />
    </div>
  );
}
