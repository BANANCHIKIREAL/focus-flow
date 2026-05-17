import type { SoundTrack } from "@/hooks/useAudioMixer";

interface Props {
  tracks: SoundTrack[];
  onToggle: (id: string) => void;
  onVolume: (id: string, v: number) => void;
  compact?: boolean;
}

export function SoundMixer({ tracks, onToggle, onVolume, compact = false }: Props) {
  return (
    <div
      className={`grid gap-3 ${
        compact
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          : "grid-cols-1 min-[420px]:grid-cols-2"
      }`}
    >
      {tracks.map((t) => (
        <SoundCard
          key={t.id}
          track={t}
          onToggle={onToggle}
          onVolume={onVolume}
          compact={compact}
        />
      ))}
    </div>
  );
}

function SoundCard({
  track,
  onToggle,
  onVolume,
  compact,
}: {
  track: SoundTrack;
  onToggle: (id: string) => void;
  onVolume: (id: string, v: number) => void;
  compact: boolean;
}) {
  return (
    <div
      className={`group relative glass rounded-2xl transition-all duration-500 ${
        compact ? "p-3 min-h-24" : "p-4 min-h-28"
      } ${
        track.enabled ? "glow-ring" : "hover:border-foreground/20"
      }`}
    >
      <button
        onClick={() => onToggle(track.id)}
        className={`flex w-full text-left ${compact ? "items-center gap-2" : "items-center gap-3"}`}
      >
        <div
          className={`relative rounded-xl flex items-center justify-center transition-colors ${
            compact ? "h-9 w-9 text-lg" : "h-10 w-10 text-xl"
          } ${
            track.enabled ? "bg-primary/20" : "bg-foreground/5"
          }`}
        >
          <span>{track.emoji}</span>
          {track.enabled && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`${compact ? "text-xs" : "text-sm"} font-medium truncate`}>
            {track.name}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {track.enabled ? "Playing" : "Idle"}
          </div>
        </div>
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={track.volume}
        onChange={(e) => onVolume(track.id, parseFloat(e.target.value))}
        className="mt-3 w-full accent-primary cursor-pointer"
        aria-label={`${track.name} volume`}
      />
    </div>
  );
}
