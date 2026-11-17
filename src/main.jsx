import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/figtree/wght.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./pwa";
createRoot(document.getElementById("root")).render(<App />);

// Offline support. Only in the built site, so `npm run dev` never serves stale files.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
