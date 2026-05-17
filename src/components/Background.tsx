export type BackgroundVariant = "aurora" | "dusk" | "forest" | "waves";

export const BACKGROUNDS: { id: BackgroundVariant; label: string }[] = [
  { id: "aurora", label: "Aurora" },
  { id: "dusk", label: "Dusk" },
  { id: "forest", label: "Forest" },
  { id: "waves", label: "Waves" },
];

export function Background({ variant }: { variant: BackgroundVariant }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* base layer cross-fades between variants */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "aurora" ? "opacity-100" : "opacity-0"
        } bg-aurora`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "dusk" ? "opacity-100" : "opacity-0"
        } bg-dusk`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "forest" ? "opacity-100" : "opacity-0"
        } bg-forest`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "waves" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, oklch(0.4 0.1 220 / 0.7), transparent 60%), linear-gradient(180deg, oklch(0.15 0.04 240), oklch(0.2 0.06 220))",
        }}
      >
        <div className="absolute inset-0 animate-wave opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 70%, oklch(0.6 0.15 200 / 0.4), transparent 70%)",
          }}
        />
      </div>

      {/* film grain / vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0 0 0 / 0.5) 100%)",
        }}
      />
    </div>
  );
}
