import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Harbor",
  description: "Curated analytics for directional conviction across public assets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_24%)]" />
          <SiteHeader />
          <main className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
