"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import Button from "./Button";
import styles from "./Hero.module.scss";
import { gsap } from "gsap";

const scrollToSection = (href: string) => {
  const id = href.replace("#", "");
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/**
 * Hero — строгий швейцарский минимализм.
 * Заголовок статичен и монолитен.
 * Правая колонка появляется через CSS-transition после монтирования.
 */
export const Hero: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);

  // Монтирование
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Правая колонка появляется через 1.5s после монтирования
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => setRightVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [isMounted]);

  // Cursor-события — только на десктопе
  const handleCursorEnter = useCallback((label = "") => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    window.dispatchEvent(new CustomEvent("cursor-enter", { detail: { label } }));
  }, []);

  const handleCursorLeave = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    window.dispatchEvent(new CustomEvent("cursor-leave"));
  }, []);

  // Обработчик клика для кнопок с плавным скроллом
  const handleButtonClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      scrollToSection(href);
    },
    []
  );

  // Магнитный эффект для кнопок — только на десктопе
  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      buttonRefs.current.forEach((btn) => {
        if (!btn) return;

        const onEnter = () => {
          gsap.to(btn, { scale: 1.03, duration: 0.3, ease: "power2.out" });
          handleCursorEnter();
        };

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 50;

          if (dist < radius && dist > 0) {
            const force = (1 - dist / radius) * 10;
            gsap.to(btn, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          }
        };

        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          handleCursorLeave();
        };

        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mousemove", onMove as EventListener);
        btn.addEventListener("mouseleave", onLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [handleCursorEnter, handleCursorLeave, isMounted]);

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      <div className={styles.grid}>
        {/* Заголовок — всегда видим */}
        <div className={styles.leftCol}>
          <h1 className={styles.title}>
            <span>Разработка</span>{" "}
            <span>ИИ-Агентов &</span>{" "}
            <span className={styles.accent}>Web-систем</span>
          </h1>
        </div>

        {/* Правая колонка — появляется через CSS-transition */}
        <div
          ref={rightColRef}
          className={`${styles.rightCol} ${rightVisible ? styles.rightColVisible : ""}`}
        >
          <p className={styles.description}>
            <strong>Fullstack разработчик</strong> со специализацией на
            автоматизации процессов, проектировании интеллектуальных агентов и
            создании высоконагруженных веб-приложений. Швейцарский подход к
            архитектуре: максимальная надёжность и отсутствие лишнего шума.
          </p>
          <div className={styles.actions}>
            <Button
              as="a"
              href="#projects"
              variant="primary"
              className={styles.ctaButton}
              ref={(el) => { buttonRefs.current[0] = el; }}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleButtonClick(e, "#projects")}
            >
              Смотреть работы
            </Button>
            <Button
              as="a"
              href="#contact"
              variant="secondary"
              className={styles.ctaButton}
              ref={(el) => { buttonRefs.current[1] = el; }}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleButtonClick(e, "#contact")}
            >
              Обсудить проект
            </Button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.metaItem}>
          Локация: <strong>Алматы (UTC+5)</strong>
        </span>
        <span className={styles.metaItem}>
          Стек:{" "}
          <strong>Next.js · TypeScript · Node.js · Python · AI Agents</strong>
        </span>
        <span className={styles.metaItem}>
          © {new Date().getFullYear()} — portfolio
        </span>
      </footer>
    </section>
  );
};

export default Hero;
