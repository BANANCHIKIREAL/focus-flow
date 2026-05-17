import { Pause, Play, RotateCcw } from "lucide-react";
import { useTimer, type TimerMode, type TimerDurations } from "@/hooks/useTimer";

function format(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function Timer({ durations }: { durations: TimerDurations }) {
  const { mode, remaining, running, total, start, pause, reset, switchMode } = useTimer(durations);
  const progress = total > 0 ? 1 - remaining / total : 0;
  const size = 360;
  const stroke = 3;
  const r = size / 2 - stroke * 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-8 select-none">
      <div className="flex gap-1 p-1 rounded-full glass">
        {(["focus", "break"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-5 py-1.5 text-sm rounded-full transition-colors capitalize ${
              mode === m
                ? "bg-foreground/90 text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
            style={{ filter: "drop-shadow(0 0 12px var(--color-glow))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            {mode === "focus" ? "Deep focus" : "Take a breath"}
          </div>
          <div className="font-display text-[7rem] leading-none tabular-nums">
            {format(remaining)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="h-12 w-12 rounded-full glass flex items-center justify-center hover:text-primary transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={running ? pause : start}
          className="h-16 w-16 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform glow-ring"
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
        </button>
        <div className="h-12 w-12" />
      </div>
    </div>
  );
}
