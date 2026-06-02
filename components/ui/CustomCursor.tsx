"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./CustomCursor.module.scss";
import { gsap } from "gsap";

export const CustomCursor: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [label, setLabel] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Однократная проверка при монтировании в браузере
  useEffect(() => {
    setIsMounted(true);
    const checkDevice = () => {
      // Использовать 1024px, чтобы строго совпадало с брейкпоинтом десктопа в Header
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice, { passive: true });
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Следование за мышью — СТРОГО для десктопа
  useEffect(() => {
    if (!isMounted || !isDesktop) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMounted, isDesktop]);

  // Магнитный ховер
  const handleHover = useCallback((show: boolean, text = "") => {
    setIsHovering(show);
    setLabel(text);
  }, []);

  useEffect(() => {
    if (!isMounted || !isDesktop) return;

    const onEnter = (e: Event) => {
      const detail = (e as CustomEvent).detail as { label?: string };
      handleHover(true, detail?.label ?? "");
    };
    const onLeave = () => handleHover(false, "");

    window.addEventListener("cursor-enter", onEnter);
    window.addEventListener("cursor-leave", onLeave);

    return () => {
      window.removeEventListener("cursor-enter", onEnter);
      window.removeEventListener("cursor-leave", onLeave);
    };
  }, [handleHover, isMounted, isDesktop]);

  // Анимация масштаба
  useEffect(() => {
    if (!isMounted || !isDesktop) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.to(cursor, {
      scale: isHovering ? 2.5 : 1,
      backgroundColor: isHovering ? "rgba(0, 255, 255, 0.15)" : "rgba(0, 255, 255, 0.08)",
      duration: 0.25,
      ease: "power2.out",
    });
  }, [isHovering, isMounted, isDesktop]);

  // Если сервер, не смонтирован или мобилка/планшет — ПОЛНЫЙ ИГНОР ИЗ DOM
  if (!isMounted || !isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${isVisible ? styles.visible : ""}`}
    >
      <span className={styles.label} style={{ opacity: isHovering ? 1 : 0 }}>
        {label}
      </span>
    </div>
  );
};

export default CustomCursor;
