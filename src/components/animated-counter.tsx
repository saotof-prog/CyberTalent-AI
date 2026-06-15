"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(value / 30);
          const interval = setInterval(() => {
            start += step;
            if (start >= value) {
              setDisplay(value);
              clearInterval(interval);
            } else {
              setDisplay(start);
            }
          }, duration / 30);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={className}>
      {display}{suffix}
    </div>
  );
}
