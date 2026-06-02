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
  { label: "Telegram", href: "https://t.me/jake_dev", handle: "@jake_dev" },
  { label: "Kwork", href: "https://kwork.ru/user/jake", handle: "kwork.ru/user/jake" },
  { label: "Email", href: "mailto:hello@jake.dev", handle: "hello@jake.dev" },
  { label: "GitHub", href: "https://github.com/jake-dev", handle: "github.com/jake-dev" },
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
