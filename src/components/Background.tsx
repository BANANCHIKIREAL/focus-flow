export type BackgroundVariant = "aurora" | "dusk" | "forest" | "waves";

export const BACKGROUNDS: { id: BackgroundVariant; label: string }[] = [
  { id: "aurora", label: "Aurora" },
  { id: "dusk", label: "Dusk" },
  { id: "forest", label: "Forest" },
  { id: "waves", label: "Waves" },
];

interface Props {
  variant: BackgroundVariant;
  image?: string | null;
}

export function Background({ variant, image }: Props) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "aurora" && !image ? "opacity-100" : "opacity-0"
        } bg-aurora`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "dusk" && !image ? "opacity-100" : "opacity-0"
        } bg-dusk`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "forest" && !image ? "opacity-100" : "opacity-0"
        } bg-forest`}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          variant === "waves" && !image ? "opacity-100" : "opacity-0"
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

      {/* Custom image layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          image ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Readability overlay (stronger when custom image is set) */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: image
            ? "linear-gradient(180deg, oklch(0 0 0 / 0.45), oklch(0 0 0 / 0.65))"
            : "radial-gradient(ellipse at center, transparent 40%, oklch(0 0 0 / 0.5) 100%)",
          backdropFilter: image ? "blur(2px)" : undefined,
          WebkitBackdropFilter: image ? "blur(2px)" : undefined,
        }}
      />
    </div>
  );
}
