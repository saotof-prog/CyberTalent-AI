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

    const particles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.3 + 0.1,
    }));

    const chars = "01";
    const streams = Array.from({ length: 8 }, () => ({
      x: Math.random() * w, speed: Math.random() * 1.5 + 0.5,
      chars: [] as { char: string; y: number; opacity: number }[],
      length: Math.floor(Math.random() * 10 + 5),
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

      ctx.fillStyle = "#00c896";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 150, ${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 200, 150, ${(1 - dist / 120) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const s of streams) {
        if (frame % Math.floor(20 / s.speed) === 0) {
          s.chars.unshift({ char: chars[Math.floor(Math.random() * chars.length)], y: -20, opacity: 1 });
          if (s.chars.length > s.length) s.chars.pop();
        }
        ctx.font = "10px monospace";
        for (let i = s.chars.length - 1; i >= 0; i--) {
          const c = s.chars[i];
          c.y += s.speed * 1.2;
          c.opacity = Math.max(0, 1 - i / s.length);
          if (c.y > h + 20) s.chars.splice(i, 1);
          ctx.fillStyle = `rgba(0, 200, 150, ${c.opacity * 0.12})`;
          ctx.fillText(c.char, s.x, c.y);
        }
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
    <div className="relative min-h-screen flex flex-col bg-[#080c14] overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-4 md:px-8 py-5 border-b border-[#00c896]/10 bg-[#080c14]/70 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00c896] animate-pulse" />
          <span className="font-mono text-[#00c896] font-bold text-sm">CYBERTALENT_AI</span>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="border border-[#00c896]/15 rounded-xl bg-[#080c14]/60 backdrop-blur-sm p-8 shadow-2xl shadow-[#00c896]/5">
            {children}
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center pb-6">
        <p className="font-mono text-[10px] text-gray-600">
          <span className="text-[#00c896]/40">© 2026</span> CYBERTALENT_AI
          <span className="text-[#00c896]/40 mx-2">//</span>
          <span className="text-gray-600">SECURE_CONNECTION_ESTABLISHED</span>
        </p>
      </footer>
    </div>
  );
}
