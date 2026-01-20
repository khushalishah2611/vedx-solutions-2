import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ColorModeProvider from "./contexts/ColorModeContext.jsx";

/**
 * Blocks basic copy actions (note: users can still bypass via devtools).
 */
const registerCopyPrevention = () => {
  // Right click
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  // Selection + Drag
  const blockDefaultAction = (event) => event.preventDefault();
  document.addEventListener("selectstart", blockDefaultAction);
  document.addEventListener("dragstart", blockDefaultAction);

  // Ctrl/Cmd shortcuts: copy, cut, save, print
  document.addEventListener("keydown", (event) => {
    const key = (event.key || "").toLowerCase();
    if ((event.ctrlKey || event.metaKey) && ["c", "x", "s", "p"].includes(key)) {
      event.preventDefault();
    }
  });
};

/**
 * Desktop-ish screenshot deterrent.
 * - PrintScreen key (mostly Windows)
 * - visibilitychange overlay fallback
 */
const registerScreenshotPrevention = () => {
  const overlay = document.getElementById("privacy-overlay");
  if (!overlay) return;

  const showOverlay = () => {
    overlay.style.display = "flex";
  };

  const hideOverlay = () => {
    overlay.style.display = "none";
  };

  // PrintScreen (Windows)
  document.addEventListener("keydown", async (event) => {
    if (event.key === "PrintScreen") {
      showOverlay();
      try {
        await navigator.clipboard.writeText("Screenshots are blocked on this site.");
      } catch (error) {
        // ignore clipboard permission errors
      }
      setTimeout(hideOverlay, 1800);
    }
  });

  // General fallback
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") showOverlay();
    else hideOverlay();
  });
};

/**
 * iOS Safari deterrent:
 * Uses lifecycle events that often fire during app-switch / screenshot / recent-apps.
 * Not a true block (web cannot fully block iOS screenshots), but best effort overlay.
 */
const registerIosPrivacyOverlay = () => {
  const overlay = document.getElementById("privacy-overlay");
  if (!overlay) return;

  const show = () => {
    overlay.style.display = "flex";
  };
  const hide = () => {
    overlay.style.display = "none";
  };

  const onHide = () => show();
  const onShow = () => hide();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") onHide();
    else onShow();
  });

  window.addEventListener("pagehide", onHide);
  window.addEventListener("blur", onHide);

  window.addEventListener("pageshow", onShow);
  window.addEventListener("focus", onShow);
};

const hideSplashScreen = () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.remove();
    }, 2000);
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </React.StrictMode>
);

// Register protections AFTER mount
registerCopyPrevention();
registerScreenshotPrevention();
registerIosPrivacyOverlay();
hideSplashScreen();
