"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  connections: number[];
};

type DataStream = {
  x: number;
  speed: number;
  chars: { char: string; y: number; opacity: number }[];
  length: number;
};

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animId: number;

    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 150;
    const STREAM_COUNT = 12;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      connections: [],
    }));

    const streams: DataStream[] = Array.from({ length: STREAM_COUNT }, () => ({
      x: Math.random() * w,
      speed: Math.random() * 2 + 1,
      length: Math.floor(Math.random() * 15 + 8),
      chars: [],
    }));

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/\\|{}[]!@#$%^&*()";

    let frame = 0;

    function drawStream(stream: DataStream) {
      if (frame % Math.floor(20 / stream.speed) === 0) {
        stream.chars.unshift({
          char: chars[Math.floor(Math.random() * chars.length)],
          y: -20,
          opacity: 1,
        });
        if (stream.chars.length > stream.length) stream.chars.pop();
      }
      for (let i = stream.chars.length - 1; i >= 0; i--) {
        const c = stream.chars[i];
        c.y += stream.speed * 1.2;
        c.opacity = Math.max(0, 1 - i / stream.length);
        if (c.y > h + 20) stream.chars.splice(i, 1);
      }
      ctx.font = "12px monospace";
      for (const c of stream.chars) {
        ctx.fillStyle = `rgba(0, 200, 150, ${c.opacity * 0.15})`;
        ctx.fillText(c.char, stream.x, c.y);
      }
    }

    function drawPulseRings() {
      const now = Date.now() / 1000;
      for (let i = 0; i < 3; i++) {
        const t = (now * 0.15 + i * 0.33) % 1;
        const radius = t * 300;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 200, 150, ${(1 - t) * 0.06})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function drawTerminalLines() {
      ctx.font = "11px monospace";
      const lines = [
        "> INITIALIZING CYBERSCORE ENGINE...",
        "> LOADING AI MODELS...",
        "> READY | SECURE CONNECTION ESTABLISHED",
      ];
      const baseY = h - 80;
      for (let i = 0; i < lines.length; i++) {
        const visible = frame > 30 + i * 40;
        if (!visible) continue;
        const progress = Math.min(1, (frame - 30 - i * 40) / 30);
        const chars = Math.floor(progress * lines[i].length);
        ctx.fillStyle = `rgba(0, 200, 150, ${0.2 + progress * 0.15})`;
        ctx.fillText(lines[i].slice(0, chars) + (progress < 1 ? "█" : ""), 20, baseY + i * 20);
      }
    }

    function animate() {
      frame++;
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const orbit = Math.sin(Date.now() / 5000 + dist * 0.01) * 0.1;
        p.vx += (dx / dist) * orbit * 0.001;
        p.vy += (dy / dist) * orbit * 0.001;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.6) {
          p.vx *= 0.99;
          p.vy *= 0.99;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 200, 150, ${(1 - dist / CONNECTION_DIST) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "#00c896";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 150, ${p.opacity})`;
        ctx.fill();
      }

      for (const s of streams) drawStream(s);
      drawPulseRings();
      drawTerminalLines();

      // Hexagon grid overlay - subtle
      ctx.strokeStyle = "rgba(0, 200, 150, 0.015)";
      ctx.lineWidth = 0.5;
      const hexSize = 60;
      for (let row = -1; row < Math.ceil(h / (hexSize * 1.5)); row++) {
        for (let col = -1; col < Math.ceil(w / (hexSize * 1.73)); col++) {
          const x = col * hexSize * 1.73 + (row % 2) * hexSize * 0.865;
          const y = row * hexSize * 1.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + hexSize * Math.cos(angle);
            const py = y + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "#080c14" }}
    />
  );
}
