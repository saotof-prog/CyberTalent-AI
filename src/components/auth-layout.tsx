"use client";

import { useEffect, useRef } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Base gradient — deep purple to dark blue to black */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f0c29] via-[#1a1a3e] to-[#000000] z-0" />

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-orb" />
        <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-[#00FF41]/8 rounded-full blur-[110px] animate-orb2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-800/10 rounded-full blur-[160px] animate-orb3" />
      </div>

      <CanvasBackground />
      <ScanlinesOverlay />
      <VignetteOverlay />
      <NavBar />
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="relative group">
            {/* Hover-glow border gradient */}
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-[#00FF41]/30 via-purple-500/20 to-purple-900/20 opacity-60 group-hover:opacity-100 blur-[2px] group-hover:blur-md transition-all duration-700" />
            <div className="relative border border-white/10 rounded-xl bg-black/60 backdrop-blur-xl p-8 shadow-[0_0_80px_rgba(0,255,65,0.04)]">
              {children}
            </div>
          </div>
        </div>
      </main>
      <footer className="relative z-10 text-center pb-6">
        <p className="font-mono text-[10px]">
          <span className="text-purple-400/30">© 2026</span>
          <span className="text-gray-600 mx-2">//</span>
          <span className="text-[#00FF41]/20">SECURE_CONNECTION_ESTABLISHED</span>
          <span className="text-gray-600 mx-2">//</span>
          <span className="text-purple-400/30">UPTIME_100%</span>
        </p>
      </footer>
    </div>
  );
}

function ScanlinesOverlay() {
  return (
    <div
      className="fixed inset-0 z-[2] pointer-events-none"
      style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.012) 2px, rgba(0, 255, 65, 0.012) 4px)" }}
    />
  );
}

function VignetteOverlay() {
  return (
    <div
      className="fixed inset-0 z-[2] pointer-events-none"
      style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.8) 100%)" }}
    />
  );
}

function NavBar() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-4 md:px-8 py-5 border-b border-white/5 bg-black/50 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41] animate-pulse" />
        <span className="font-mono text-[#00FF41] font-bold text-sm tracking-wider">
          CYBERTALENT_AI
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-purple-400/30 ml-2">
          v2.4.1 // SECURE
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-white/15">
          {new Date().toLocaleDateString("fr-FR", {
            year: "numeric", month: "2-digit", day: "2-digit"
          })}
        </span>
      </div>
    </nav>
  );
}

function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let animId: number;
    let mounted = true;

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.2 + 0.05,
      hue: Math.random() > 0.5 ? 120 : 270,
    }));

    function animate() {
      if (!mounted) return;
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 50%, ${p.opacity})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      const c = canvasRef.current!;
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
