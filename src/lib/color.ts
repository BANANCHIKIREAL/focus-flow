const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** `<input type="color">` only accepts #rrggbb; convert oklch and other CSS colors when needed. */
export function toColorInputValue(color: string, fallback = "#7dd3fc"): string {
  if (HEX_COLOR.test(color)) return color;
  if (typeof document === "undefined") return fallback;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return fallback;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
