"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const nextIdRef = useRef(0);
  const [mouseGlow, setMouseGlow] = useState<{ x: number; y: number }>(
    { x: 50, y: 35 }
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const particleCount = 30;
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }

      nextIdRef.current = particleCount;
      setParticles(newParticles);
    })();
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const next = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };

      mouseRef.current = next;
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        setMouseGlow(next);
      });
    }

    function onClick(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      const burstCount = 14;
      const burst: Particle[] = Array.from({ length: burstCount }).map(() => {
        const id = nextIdRef.current++;
        const angle = Math.random() * Math.PI * 2;
        const power = Math.random() * 3.5 + 1.5;
        return {
          id,
          x,
          y,
          size: Math.random() * 6 + 3,
          speedX: Math.cos(angle) * power,
          speedY: Math.sin(angle) * power,
          opacity: Math.random() * 0.35 + 0.65,
        };
      });

      setParticles((prev) => {
        const merged = [...prev, ...burst];
        return merged.length > 120 ? merged.slice(merged.length - 120) : merged;
      });
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          const mouse = mouseRef.current;
          const attractionStrength = 0.03;

          let speedX = p.speedX;
          let speedY = p.speedY;

          if (mouse) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            speedX += dx * attractionStrength;
            speedY += dy * attractionStrength;

            // Add a small swirl so the motion is more visually obvious
            speedX += -dy * 0.002;
            speedY += dx * 0.002;
          }

          // Small damping to avoid runaway speeds
          speedX *= 0.985;
          speedY *= 0.985;

          const maxSpeed = 3.2;
          speedX = Math.max(-maxSpeed, Math.min(maxSpeed, speedX));
          speedY = Math.max(-maxSpeed, Math.min(maxSpeed, speedY));

          let newX = p.x + speedX;
          let newY = p.y + speedY;

          if (newX <= 0 || newX >= 100) speedX *= -0.85;
          if (newY <= 0 || newY >= 100) speedY *= -0.85;

          newX = Math.max(0, Math.min(100, newX));
          newY = Math.max(0, Math.min(100, newY));

          return { ...p, x: newX, y: newY, speedX, speedY };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900 opacity-95" />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-3xl"
        style={{
          left: `${mouseGlow.x}%`,
          top: `${mouseGlow.y}%`,
          width: "360px",
          height: "360px",
        }}
      />
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/70 blur-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size * 2.6}px`,
            height: `${p.size * 2.6}px`,
            opacity: p.opacity,
            transition: "none",
          }}
        />
      ))}
    </div>
  );
}
