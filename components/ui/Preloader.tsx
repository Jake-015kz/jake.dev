"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Preloader.module.scss";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasCompleted = useRef(false);

  // Монтирование — только в браузере
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Жёсткая разблокировка скролла — вызывается всегда когда isDone = true
  useEffect(() => {
    if (!isDone) return;
    if (typeof document === "undefined") return;
    document.body.style.overflow = "";
    document.body.style.removeProperty("overflow");
  }, [isDone]);

  const handleComplete = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;

    // Сразу разблокируем скролл — не ждём окончания GSAP-анимации
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.removeProperty("overflow");
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete();
      },
    });

    tl.to(topRef.current, {
      y: "-100%",
      duration: 0.8,
      ease: "expo.inOut",
    })
      .to(
        bottomRef.current,
        {
          y: "100%",
          duration: 0.8,
          ease: "expo.inOut",
        },
        "<"
      )
      .to(
        counterRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "<"
      );
  }, [onComplete]);

  // Счётчик — только после монтирования
  useEffect(() => {
    if (!isMounted) return;

    // Блокируем скролл на время прелоадера
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    const duration = 1800;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      const value = Math.round(eased * 100);

      setProgress(value);

      if (value < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(handleComplete, 300);
      }
    };

    const rafId = requestAnimationFrame(tick);

    // Fallback: если rAF не сработал — таймаут через 2.5s
    const fallback = setTimeout(() => {
      setProgress(100);
      handleComplete();
    }, 2500);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallback);
      // При размонтировании — обязательно разблокировать
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.body.style.removeProperty("overflow");
      }
    };
  }, [isMounted, handleComplete]);

  // До монтирования — не рендерим ничего (избегаем гидратации)
  if (!isMounted) return null;

  // После завершения — вообще не рендерим DOM
  if (isDone) return null;

  return (
    <div className={styles.preloader}>
      <div ref={topRef} className={styles.top} />
      <div ref={bottomRef} className={styles.bottom} />

      <div className={styles.counterWrap}>
        <span ref={counterRef} className={styles.counter}>
          {String(progress).padStart(2, "0")}
        </span>
        <span className={styles.percent}>%</span>
      </div>
    </div>
  );
};

export default Preloader;
