import { VolumeX } from "lucide-react";
import { SoundMixer } from "./SoundMixer";
import type { SoundTrack } from "@/hooks/useAudioMixer";
import type { translations } from "@/lib/i18n";

interface Props {
  activeCount: number;
  tracks: SoundTrack[];
  onToggleTrack: (id: string) => void;
  onVolumeTrack: (id: string, volume: number) => void;
  onStopAll: () => void;
  copy: typeof translations.en;
}

export function SoundDock({
  activeCount,
  tracks,
  onToggleTrack,
  onVolumeTrack,
  onStopAll,
  copy,
}: Props) {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-5xl glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {copy.soundMixer}
            </div>
            <div className="text-sm">
              {activeCount > 0 ? `${activeCount} ${copy.active}` : copy.ready}
            </div>
          </div>
          {activeCount > 0 && (
            <button
              onClick={onStopAll}
              className="h-9 px-3 rounded-full glass text-xs inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <VolumeX size={14} />
              {copy.mute}
            </button>
          )}
        </div>
        <div className="border-t border-border p-3 md:p-4">
          <SoundMixer
            tracks={tracks}
            onToggle={onToggleTrack}
            onVolume={onVolumeTrack}
            compact
          />
        </div>
      </div>
    </section>
  );
}
