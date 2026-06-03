"use client";

import React, { useEffect, useState } from "react";
import { Send, Mail, Phone, Briefcase } from "lucide-react";
import styles from "./Footer.module.scss";

const formatTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const AI_STATUSES = [
  "[SYS: READY]",
  "[LLM: ONLINE]",
  "[PING: 14MS]",
  "[CONTEXT: STABLE]",
  "[TOKENS: 4096]",
  "[AGENTS: IDLE]",
  "[MEMORY: OK]",
  "[INFERENCE: FAST]",
];

const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// SVG иконка GitHub
const GitHubIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const socialLinks: SocialLink[] = [
  { href: "https://t.me/Jake_sko", icon: <Send size={18} />, label: "Telegram" },
  { href: "https://wa.me/77058576466", icon: <Phone size={18} />, label: "WhatsApp" },
  { href: "https://kwork.ru/user/87058576466a", icon: <Briefcase size={18} />, label: "Kwork" },
  { href: "https://github.com/Jake-015kz", icon: <GitHubIcon size={18} />, label: "GitHub" },
  { href: "mailto:zhegan89@gmail.com", icon: <Mail size={18} />, label: "Email" },
];

export const Footer: React.FC = () => {
  const [time, setTime] = useState<string>("");
  const [statusIndex, setStatusIndex] = useState(0);
  const [displayedStatus, setDisplayedStatus] = useState(AI_STATUSES[0]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setTime(formatTime(new Date()));
    const id = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % AI_STATUSES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setIsTyping(true);
    const timeout = setTimeout(() => {
      setDisplayedStatus(AI_STATUSES[statusIndex]);
      setIsTyping(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [statusIndex]);

  return (
    <footer className={styles.footer}>
      <div className={styles.aiStatus}>
        <span className={styles.aiDot} />
        <span className={`${styles.aiText} ${isTyping ? styles.aiTextFading : ""}`}>
          {displayedStatus}
        </span>
      </div>

      <div className={styles.inner}>
        <span className={styles.meta}>
          © {new Date().getFullYear()} Evgeny (Jeka) / Jake — ALL RIGHTS RESERVED
        </span>

        <span className={styles.meta}>
          ЛОКАЦИЯ: АЛМАТЫ, КАЗАХСТАН (UTC+5) —{" "}
          <span className={styles.time}>{time}</span>
        </span>

        <div className={styles.socialLinks}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <a href="#hero" className={styles.backToTop} onClick={scrollToTop}>
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
