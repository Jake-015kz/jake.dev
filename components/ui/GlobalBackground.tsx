"use client";

import React, { useEffect, useRef } from "react";
import styles from "./GlobalBackground.module.scss";
import { gsap } from "gsap";

export const GlobalBackground: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Защита от SSR
    if (typeof window === "undefined") return;

    // На мобильных не инициализируем cursor glow — нет мыши
    if (window.innerWidth < 768) return;

    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let raf: number | null = null;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!raf) {
        raf = requestAnimationFrame(() => {
          gsap.to(glow, {
            x: mouseX,
            y: mouseY,
            duration: 0.85,
            ease: "power2.out",
            overwrite: "auto",
          });
          raf = null;
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.globalBg} aria-hidden="true">
      <div className={styles.grid} />
      <div ref={glowRef} className={styles.glow} />
    </div>
  );
};

export default GlobalBackground;
