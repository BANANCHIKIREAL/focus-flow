import { BACKGROUNDS, type BackgroundVariant } from "./Background";

export function BackgroundPicker({
  value,
  onChange,
}: {
  value: BackgroundVariant;
  onChange: (v: BackgroundVariant) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-1">
        Atmosphere
      </div>
      <div className="flex gap-2">
        {BACKGROUNDS.map((b) => (
          <button
            key={b.id}
            onClick={() => onChange(b.id)}
            className={`h-9 px-3 rounded-full text-xs glass transition-all ${
              value === b.id ? "text-foreground glow-ring" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
