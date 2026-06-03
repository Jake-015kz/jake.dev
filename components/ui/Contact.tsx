"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./Contact.module.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ContactLink {
  label: string;
  href: string;
  handle: string;
}

const contactLinks: ContactLink[] = [
  { label: "Telegram", href: "https://t.me/Jake_sko", handle: "@Jake_sko" },
  { label: "WhatsApp", href: "https://wa.me/77058576466", handle: "+7 (705) 857-64-66" },
  { label: "Kwork", href: "https://kwork.ru/user/87058576466a", handle: "kwork.ru/user/87058576466a" },
  { label: "GitHub", href: "https://github.com/Jake-015kz", handle: "github.com/Jake-015kz" },
  { label: "Email", href: "mailto:zhegan89@gmail.com", handle: "zhegan89@gmail.com" },
  { label: "Телефон", href: "tel:+77058576466", handle: "+7 (705) 857-64-66" },
];

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleCursorEnter = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cursor-enter", { detail: { label: "" } }));
  }, []);

  const handleCursorLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cursor-leave"));
  }, []);

  useEffect(() => {
    // На мобильных — сразу показываем элементы
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      linkRefs.current.forEach((link) => {
        if (link) {
          link.style.opacity = "1";
          link.style.transform = "none";
        }
      });
      if (titleRef.current) {
        titleRef.current.style.opacity = "1";
        titleRef.current.style.transform = "none";
      }
      return;
    }

    const ctx = gsap.context(() => {
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

      linkRefs.current.forEach((link, i) => {
        if (!link) return;
        gsap.fromTo(
          link,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: link,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.contact} id="contact">
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>02 /</span>
          <h2 ref={titleRef} className={styles.sectionTitle}>
            СВЯЗЬ
          </h2>
        </div>

        <nav className={styles.links}>
          {contactLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => { linkRefs.current[index] = el; }}
              className={styles.linkItem}
              onMouseEnter={handleCursorEnter}
              onMouseLeave={handleCursorLeave}
            >
              <div className={styles.linkLeft}>
                <span className={styles.linkLabel}>{link.label}</span>
                <span className={styles.linkHandle}>{link.handle}</span>
              </div>
              <ArrowUpRight size={18} className={styles.arrow} />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default Contact;
