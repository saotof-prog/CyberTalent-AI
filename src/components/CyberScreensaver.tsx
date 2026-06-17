"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { playAmbient, setVolume, stopAmbient } from "@/lib/ambient-sound";

const COLUMNS = 60;
const FONT_SIZE = 14;
const FALL_SPEED = 0.6;

const SOUND_MODES = [
  { id: "drone", label: "CYBER_DRONE", icon: "〰️" },
  { id: "rain", label: "NUMB_RAIN", icon: "🌧️" },
  { id: "lofi", label: "LOFI_PAD", icon: "🎧" },
  { id: "off", label: "SILENCE", icon: "🔇" },
] as const;

export default function CyberScreensaver({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [soundMode, setSoundMode] = useState<string>("drone");
  const [volume, setVol] = useState(0.6);
  const dropsRef = useRef<number[]>([]);
  const animRef = useRef<number>(0);
  const chars =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]|&^%$#@!CYBERTALENT_AI";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / FONT_SIZE);
    dropsRef.current = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * -canvas.height / FONT_SIZE)
    );

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(8, 12, 20, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * FONT_SIZE;
        const y = dropsRef.current[i] * FONT_SIZE;

        const brightness = Math.random();
        if (brightness > 0.98) {
          ctx.fillStyle = "#ffffff";
        } else if (brightness > 0.85) {
          ctx.fillStyle = "#00ffc8";
        } else {
          ctx.fillStyle = "#00664a";
        }

        ctx.fillText(char, x, y);

        dropsRef.current[i] += FALL_SPEED;

        if (y > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleExit = useCallback(() => {
    onExit();
  }, [onExit]);

  useEffect(() => {
    playAmbient(soundMode as "drone" | "rain" | "lofi" | "off");
    return () => stopAmbient();
  }, [soundMode]);

  useEffect(() => {
    setVolume(volume);
  }, [volume]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleExit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleExit]);

  const cycleSound = useCallback(() => {
    setSoundMode((prev) => {
      const idx = SOUND_MODES.findIndex((m) => m.id === prev);
      return SOUND_MODES[(idx + 1) % SOUND_MODES.length].id;
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-[99999] cursor-pointer"
      onClick={handleExit}
      style={{ backgroundColor: "rgba(8, 12, 20, 0.92)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Branding central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="text-center">
          <div className="relative inline-block">
            <div
              className="text-2xl md:text-5xl font-mono font-bold tracking-[0.3em] animate-pulse"
              style={{
                color: "#00c896",
                textShadow: "0 0 40px #00c89644, 0 0 80px #00c89622",
              }}
            >
              CYBERTALENT_AI
            </div>
            <div
              className="mt-3 md:mt-4 font-mono text-xs md:text-sm tracking-[0.5em] opacity-60"
              style={{ color: "#00c896" }}
            >
              SYSTÈME VERROUILLÉ — <span className="opacity-40">APPUYEZ SUR ESC</span>
            </div>
          </div>

          {/* Lignes horizontales défilantes */}
          <div className="mt-8 md:mt-12 flex justify-center gap-2 md:gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[1px] rounded-full animate-pulse"
                style={{
                  width: `${20 + i * 15}px`,
                  backgroundColor: "#00c896",
                  opacity: 0.2 + i * 0.12,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sound controls — bas à gauche */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 pointer-events-auto select-none">
        <button
          onClick={(e) => { e.stopPropagation(); cycleSound(); }}
          className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded border border-[#00c896]/20 hover:bg-[#00c896]/10 transition flex items-center gap-2"
          style={{ color: "#00c896", opacity: 0.6 }}
        >
          <span>
            {SOUND_MODES.find((m) => m.id === soundMode)?.icon}
          </span>
          <span>
            {SOUND_MODES.find((m) => m.id === soundMode)?.label}
          </span>
          <span className="opacity-40">[CLICK]</span>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setVol(parseFloat(e.target.value))}
          className="w-20 h-[2px] accent-[#00c896] opacity-50 hover:opacity-100 transition cursor-pointer"
        />
      </div>

      {/* Bit counter en bas à droite */}
      <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest pointer-events-none select-none opacity-30">
        <span style={{ color: "#00c896" }}>
          {">"} SYS_IDLE{" "}
          <span className="animate-pulse">_</span>
        </span>
      </div>
    </div>
  );
}
