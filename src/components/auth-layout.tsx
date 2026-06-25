"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let animId: number;

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.4 + 0.1,
    }));

    const chars = "01アイウエオ";
    const streams = Array.from({ length: 10 }, () => ({
      x: Math.random() * w, speed: Math.random() * 2 + 0.5,
      chars: [] as { char: string; y: number; opacity: number }[],
      length: Math.floor(Math.random() * 12 + 6),
    }));

    let frame = 0;
    function animate() {
      frame++;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 65, ${(1 - dist / 130) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const s of streams) {
        if (frame % Math.floor(18 / s.speed) === 0) {
          s.chars.unshift({ char: chars[Math.floor(Math.random() * chars.length)], y: -20, opacity: 1 });
          if (s.chars.length > s.length) s.chars.pop();
        }
        ctx.font = "11px monospace";
        for (let i = s.chars.length - 1; i >= 0; i--) {
          const c = s.chars[i];
          c.y += s.speed * 1.5;
          c.opacity = Math.max(0, 1 - i / s.length);
          if (c.y > h + 20) s.chars.splice(i, 1);
          ctx.fillStyle = `rgba(0, 255, 65, ${c.opacity * 0.15})`;
          ctx.fillText(c.char, s.x, c.y);
        }
      }

      const now = Date.now() / 1000;
      for (let i = 0; i < 2; i++) {
        const t = (now * 0.1 + i * 0.5) % 1;
        const radius = t * 200;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 65, ${(1 - t) * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
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
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Scanlines overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.015) 2px, rgba(0, 255, 65, 0.015) 4px)"
        }}
      />

      {/* Vignette */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)"
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-4 md:px-8 py-5 border-b border-[#00FF41]/10 bg-black/70 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41] animate-pulse" />
          <span className="font-mono text-[#00FF41] font-bold text-sm tracking-wider">
            CYBERTALENT_AI
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#00FF41]/30 ml-2">
            v2.4.1 // SECURE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#00FF41]/20">
            {new Date().toLocaleDateString("fr-FR", {
              year: "numeric", month: "2-digit", day: "2-digit"
            })}
          </span>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Neon border glow */}
            <div className="absolute -inset-[1px] rounded-xl bg-[#00FF41]/5 blur-sm" />
            <div className="relative border border-[#00FF41]/20 rounded-xl bg-black/80 backdrop-blur-sm p-8 shadow-[0_0_40px_rgba(0,255,65,0.05)]">
              {children}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center pb-6">
        <p className="font-mono text-[10px]">
          <span className="text-[#00FF41]/30">© 2026</span>
          <span className="text-gray-600 mx-2">//</span>
          <span className="text-[#00FF41]/20">SECURE_CONNECTION_ESTABLISHED</span>
          <span className="text-gray-600 mx-2">//</span>
          <span className="text-[#00FF41]/30">UPTIME_100%</span>
        </p>
      </footer>
    </div>
  );
}
