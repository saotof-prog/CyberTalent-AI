"use client";
import { useEffect, useState } from "react";
import { stopAmbient } from "@/lib/ambient-sound";
import CyberScreensaver from "./CyberScreensaver";

export default function FocusTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [visible, setVisible] = useState(false);
  const [screensaver, setScreensaver] = useState(false);

  useEffect(() => {
    function check() {
      const on = document.body.classList.contains("cyber-focus");
      setVisible(on);
      if (!on) setElapsed(0);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && document.body.classList.contains("cyber-focus")) {
        document.body.classList.remove("cyber-focus");
        localStorage.setItem("cyber-focus", "false");
        stopAmbient();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        const next = !document.body.classList.contains("cyber-focus");
        document.body.classList.toggle("cyber-focus", next);
        localStorage.setItem("cyber-focus", String(next));
        if (!next) stopAmbient();
      }
      if (e.key === "Escape" && screensaver) {
        setScreensaver(false);
        stopAmbient();
      }
    }

    function onScreensaverEvent() {
      setScreensaver(true);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("cyber:screensaver", onScreensaverEvent);
    const obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    check();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cyber:screensaver", onScreensaverEvent);
      obs.disconnect();
    };
  }, [screensaver]);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, [visible]);

  if (screensaver) {
    return <CyberScreensaver onExit={() => { setScreensaver(false); stopAmbient(); }} />;
  }

  if (!visible) return null;

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none">
      <div
        className="font-mono text-[11px] tracking-[0.2em] flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm"
        style={{
          color: "#00FF41",
          borderColor: "#00FF4122",
          backgroundColor: "rgba(8, 12, 20, 0.6)",
          boxShadow: "0 0 30px rgba(0, 200, 150, 0.06)",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
        <span>FOCUS</span>
        <span className="opacity-60">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
        <span className="opacity-30 text-[9px]">⎋ EXIT</span>
      </div>
    </div>
  );
}
