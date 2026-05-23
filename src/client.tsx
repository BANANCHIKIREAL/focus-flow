import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

startTransition(() => {
  createRoot(rootEl).render(
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
