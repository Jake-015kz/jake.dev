"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Terminal, Bot, Cpu } from "lucide-react";
import styles from "./Projects.module.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  number: string;
  title: string;
  tags: string[];
  description: string;
  icon: React.ReactNode;
}

const projects: Project[] = [
  {
    id: "n8n-bots",
    number: "01",
    title: "Интеллектуальные боты & n8n",
    tags: ["n8n", "Telegram", "GPT-4", "Automation"],
    description:
      "Проектирование и развёртывание мультиагентных систем на базе n8n с интеграцией LLM. Автоматизация бизнес-процессов, интеллектуальная маршрутизация запросов и контекстные диалоговые цепочки.",
    icon: <Bot size={20} />,
  },
  {
    id: "api-scripts",
    number: "02",
    title: "Скрипты автоматизации & API",
    tags: ["Python", "FastAPI", "REST", "Webhooks"],
    description:
      "Разработка высоконадёжных скриптов для автоматизации рутины: парсинг, трансформация данных, интеграция с внешними API и оркестрация асинхронных задач.",
    icon: <Terminal size={20} />,
  },
  {
    id: "parsers",
    number: "03",
    title: "Высокоскоростные парсеры",
    tags: ["Playwright", "Scrapy", "Proxy", "AsyncIO"],
    description:
      "Создание производительных парсеров с обходом защит, распределённой архитектурой и адаптивным скоростным режимом. Миллионы страниц в сутки без блокировок.",
    icon: <Cpu size={20} />,
  },
];

const PlayIcon: React.FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="23" stroke="rgba(0,255,255,0.2)" strokeWidth="1" />
    <circle cx="24" cy="24" r="18" stroke="rgba(0,255,255,0.1)" strokeWidth="1" />
    <path d="M20 16L32 24L20 32V16Z" fill="rgba(0,255,255,0.6)" />
  </svg>
);

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCursorEnter = useCallback((label = "") => {
    window.dispatchEvent(new CustomEvent("cursor-enter", { detail: { label } }));
  }, []);

  const handleCursorLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cursor-leave"));
  }, []);

  // ── 3D Tilt при движении мыши внутри карточки ──
  const handleCardMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3; // макс ±3deg
    const rotateY = ((x - centerX) / centerX) * 3;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  }, []);

  const handleCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    handleCursorLeave();
  }, [handleCursorLeave]);

  useEffect(() => {
    // На мобильных — сразу показываем карточки без GSAP ScrollTrigger
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      // Мобильные: принудительно показываем все карточки
      cardRefs.current.forEach((card) => {
        if (card) {
          card.style.opacity = "1";
          card.style.transform = "none";
        }
      });
      if (titleRef.current) {
        titleRef.current.style.opacity = "1";
        titleRef.current.style.transform = "none";
      }
      return;
    }

    // Десктоп: используем GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      // Заголовок секции
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Карточки — stagger + параллакс при скролле
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.projects} id="projects">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>01 /</span>
        <h2 ref={titleRef} className={styles.sectionTitle}>
          ИЗБРАННЫЕ РЕШЕНИЯ
        </h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { cardRefs.current[index] = el; }}
            className={styles.card}
            onMouseMove={handleCardMove}
            onMouseEnter={() => handleCursorEnter("VIEW")}
            onMouseLeave={handleCardLeave}
          >
            <div className={styles.videoPlaceholder}>
              <div className={styles.playButton}>
                <PlayIcon />
              </div>
              <div className={styles.videoOverlay}>
                <span className={styles.videoLabel}>Скринкаст</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardMeta}>
                <span className={styles.cardNumber}>{project.number}</span>
                <div className={styles.cardIcon}>{project.icon}</div>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>

              <a
                href={`#${project.id}`}
                className={styles.cardLink}
                onMouseEnter={() => handleCursorEnter("")}
                onMouseLeave={handleCursorLeave}
              >
                Подробнее
                <span className={styles.linkArrow}>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
