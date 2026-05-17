import type { SoundTrack } from "@/hooks/useAudioMixer";

interface Props {
  tracks: SoundTrack[];
  onToggle: (id: string) => void;
  onVolume: (id: string, v: number) => void;
}

export function SoundMixer({ tracks, onToggle, onVolume }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {tracks.map((t) => (
        <SoundCard key={t.id} track={t} onToggle={onToggle} onVolume={onVolume} />
      ))}
    </div>
  );
}

function SoundCard({
  track,
  onToggle,
  onVolume,
}: {
  track: SoundTrack;
  onToggle: (id: string) => void;
  onVolume: (id: string, v: number) => void;
}) {
  return (
    <div
      className={`group relative glass rounded-2xl p-4 transition-all duration-500 ${
        track.enabled ? "glow-ring" : "hover:border-foreground/20"
      }`}
    >
      <button
        onClick={() => onToggle(track.id)}
        className="flex items-center gap-3 w-full text-left"
      >
        <div
          className={`relative h-10 w-10 rounded-xl flex items-center justify-center text-xl transition-colors ${
            track.enabled ? "bg-primary/20" : "bg-foreground/5"
          }`}
        >
          <span>{track.emoji}</span>
          {track.enabled && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{track.name}</div>
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
