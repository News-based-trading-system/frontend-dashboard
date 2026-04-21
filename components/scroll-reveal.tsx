"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  animation?: "float-up" | "float-down" | "slide-left" | "slide-right" | "scale-in" | "blur-in";
  delay?: number;
  threshold?: number;
  once?: boolean;
};

export function ScrollReveal({
  children,
  className = "",
  animation = "float-up",
  delay = 0,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.animationDelay = `${delay}s`;
          element.classList.add(`animate-${animation}`);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          element.classList.remove(`animate-${animation}`);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [animation, delay, threshold, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
}
