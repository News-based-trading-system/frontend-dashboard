"use client";

import { useEffect, useRef } from "react";

/* ─── Types ─── */
type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  type: "blue" | "lightblue" | "warm";
};

type Meteor = {
  x: number; y: number;
  vx: number; vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
};

type Ripple = {
  x: number; y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
};

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let tick = 0;
    let particles: Particle[] = [];
    let meteors: Meteor[] = [];
    let ripples: Ripple[] = [];

    /* ─── Canvas size ─── */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    /* ─── Build particles ─── */
    const createParticles = () => {
      const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 14000),
        110
      );
      particles = Array.from({ length: count }, () => {
        const r = Math.random();
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.6 + 0.3,
          opacity: Math.random() * 0.45 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          pulsePhase: Math.random() * Math.PI * 2,
          type: r < 0.65 ? "blue" : r < 0.85 ? "lightblue" : "warm",
        };
      });
    };

    /* ─── Spawn a meteor ─── */
    const spawnMeteor = () => {
      const startX = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
      const startY = -30;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 8 + 5;
      meteors.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 80 + 50,
        opacity: Math.random() * 0.6 + 0.3,
        life: 0,
        maxLife: Math.random() * 40 + 25,
      });
    };

    /* ─── Spawn a ripple ─── */
    const spawnRipple = () => {
      const colors = [
        "86, 130, 177",
        "115, 158, 201",
        "255, 232, 219",
      ];
      ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 150 + 80,
        opacity: Math.random() * 0.15 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    /* ─── Aurora wave ─── */
    const drawAurora = (t: number) => {
      const W = canvas.width;
      const H = canvas.height;

      // Two aurora bands
      const bands = [
        { yBase: H * 0.15, amp: 60, freq: 0.0018, speed: 0.0003, color1: "86,130,177", color2: "115,158,201", alpha: 0.025 },
        { yBase: H * 0.70, amp: 50, freq: 0.0022, speed: 0.00025, color1: "115,158,201", color2: "255,232,219", alpha: 0.018 },
      ];

      for (const band of bands) {
        ctx.save();
        const gradient = ctx.createLinearGradient(0, band.yBase - band.amp * 2, 0, band.yBase + band.amp * 2);
        gradient.addColorStop(0, `rgba(${band.color1}, 0)`);
        gradient.addColorStop(0.4, `rgba(${band.color1}, ${band.alpha})`);
        gradient.addColorStop(0.6, `rgba(${band.color2}, ${band.alpha})`);
        gradient.addColorStop(1, `rgba(${band.color2}, 0)`);

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= W; x += 4) {
          const y =
            band.yBase +
            Math.sin(x * band.freq + t * band.speed) * band.amp +
            Math.sin(x * band.freq * 1.7 + t * band.speed * 0.8 + 1.2) * (band.amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(W, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      }
    };

    /* ─── Main draw loop ─── */
    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Aurora */
      drawAurora(tick);

      /* Ripples */
      ripples = ripples.filter((r) => r.radius < r.maxRadius * 1.05);
      ripples.forEach((r) => {
        r.radius += 0.8;
        const alpha = r.opacity * (1 - r.radius / r.maxRadius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      /* Meteors */
      meteors = meteors.filter((m) => m.life < m.maxLife);
      meteors.forEach((m) => {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        const progress = m.life / m.maxLife;
        const alpha = m.opacity * Math.sin(progress * Math.PI);

        const tailX = m.x - m.vx * (m.length / Math.sqrt(m.vx * m.vx + m.vy * m.vy));
        const tailY = m.y - m.vy * (m.length / Math.sqrt(m.vx * m.vx + m.vy * m.vy));

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, `rgba(255, 232, 219, 0)`);
        grad.addColorStop(0.7, `rgba(115, 158, 201, ${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glowing head
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.fill();
      });

      /* Particles */
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulse opacity
        const pulsed = p.opacity + Math.sin(tick * p.pulseSpeed + p.pulsePhase) * 0.12;

        let r: number, g: number, b: number;
        if (p.type === "warm") {
          r = 255; g = 232; b = 219;
        } else if (p.type === "lightblue") {
          r = 115; g = 158; b = 201;
        } else {
          r = 86; g = 130; b = 177;
        }

        // Draw glow around large particles
        if (p.size > 1.0) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${pulsed * 0.4})`);
          glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pulsed})`;
        ctx.fill();
      });

      /* Connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = 0.08 * (1 - dist / 130);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Warm particles get warm-tinted connections
            if (particles[i].type === "warm" || particles[j].type === "warm") {
              ctx.strokeStyle = `rgba(255, 200, 180, ${alpha * 0.8})`;
            } else {
              ctx.strokeStyle = `rgba(86, 130, 177, ${alpha})`;
            }
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* Periodic events */
      // Meteors: random chance, avg every ~3.5s at 60fps
      if (Math.random() < 0.005) spawnMeteor();

      // Ripples: random chance, avg every ~4s at 60fps
      if (Math.random() < 0.004) spawnRipple();

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    // Seed a few initial ripples
    for (let i = 0; i < 3; i++) spawnRipple();
    draw();

    const handleResize = () => { resize(); createParticles(); };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
