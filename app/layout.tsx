import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import { ParticleField } from "../components/particle-field";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Harbor — Curated Signal Intelligence",
  description: "Curated analytics for directional conviction across public assets. Discover the strongest moves with premium signal clarity.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="relative min-h-screen">

          {/* ── Layer 0: Ambient large drifting orbs ── */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

            {/* Primary blue orb — top-left, drifts slowly */}
            <div
              className="absolute -left-[20%] -top-[10%] h-[800px] w-[800px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(86,130,177,0.13) 0%, transparent 65%)",
                animation: "orb-drift-1 22s ease-in-out infinite",
              }}
            />

            {/* Secondary blue orb — top-right */}
            <div
              className="absolute -right-[15%] top-[5%] h-[600px] w-[600px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(115,158,201,0.09) 0%, transparent 60%)",
                animation: "orb-drift-2 28s ease-in-out infinite 4s",
              }}
            />

            {/* Warm peach orb — bottom-right, large */}
            <div
              className="absolute -bottom-[15%] -right-[10%] h-[700px] w-[700px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(255,232,219,0.08) 0%, transparent 60%)",
                animation: "orb-drift-3 32s ease-in-out infinite 8s",
              }}
            />

            {/* Mid-screen light-blue drifting orb */}
            <div
              className="absolute left-[35%] top-[40%] h-[550px] w-[550px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(115,158,201,0.06) 0%, transparent 55%)",
                animation: "orb-drift-1 18s ease-in-out infinite 12s",
              }}
            />

            {/* Bottom-left warm accent */}
            <div
              className="absolute -bottom-[5%] -left-[10%] h-[400px] w-[400px] rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(255,232,219,0.06) 0%, transparent 60%)",
                animation: "orb-drift-2 24s ease-in-out infinite 2s",
              }}
            />
          </div>

          {/* ── Layer 1: Conic sweep spotlight (slow rotation) ── */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "60%",
                width: "900px",
                height: "900px",
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(86,130,177,0.03) 40deg, rgba(115,158,201,0.04) 80deg, transparent 120deg, transparent 360deg)",
                animation: "conic-spin 40s linear infinite",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "70%",
                left: "25%",
                width: "600px",
                height: "600px",
                background:
                  "conic-gradient(from 180deg, transparent 0deg, rgba(255,232,219,0.025) 50deg, rgba(115,158,201,0.02) 90deg, transparent 130deg, transparent 360deg)",
                animation: "conic-spin 55s linear infinite reverse",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* ── Layer 2: Vignette inner glow edges ── */}
          <div
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(86,130,177,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(115,158,201,0.05) 0%, transparent 70%)",
            }}
          />

          {/* ── Layer 3: Canvas particle field (meteors, aurora, particles) ── */}
          <ParticleField />

          {/* ── Layer 4: Subtle line grid ── */}
          <div className="line-grid pointer-events-none fixed inset-0 z-0 opacity-[0.28]" />

          {/* ── Content ── */}
          <div className="relative z-10">
            <SiteHeader />
            <main className="relative mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-12">
              {children}
            </main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
