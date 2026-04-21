"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: string;
  className?: string;
};

export function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          // Try to parse a numeric portion
          const numericMatch = value.match(/^([^0-9]*)([\d,.]+)(.*)/);
          if (numericMatch) {
            const [, prefix, numStr, suffix] = numericMatch;
            const target = parseFloat(numStr.replace(/,/g, ""));
            const isDecimal = numStr.includes(".");
            const decimalPlaces = isDecimal ? (numStr.split(".")[1]?.length ?? 0) : 0;
            const hasCommas = numStr.includes(",");

            let start = 0;
            const duration = 1200;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = start + (target - start) * eased;

              let formatted = isDecimal
                ? current.toFixed(decimalPlaces)
                : Math.round(current).toString();

              if (hasCommas) {
                const parts = formatted.split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                formatted = parts.join(".");
              }

              setDisplayValue(`${prefix}${formatted}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplayValue(value);
              }
            };

            requestAnimationFrame(animate);
          }

          observer.unobserve(element);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  return (
    <span ref={ref} className={`stat-value ${className}`}>
      {displayValue}
    </span>
  );
}
