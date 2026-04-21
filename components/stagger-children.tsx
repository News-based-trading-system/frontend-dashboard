"use client";

import { useEffect, useRef, useState } from "react";

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ["--stagger-delay" as string]: `${staggerDelay}s`,
      }}
    >
      {isVisible ? (
        <div
          className={className}
          style={{
            display: "contents",
          }}
        >
          {children}
        </div>
      ) : (
        <div style={{ opacity: 0 }}>{children}</div>
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-float-up ${className}`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {children}
    </div>
  );
}
