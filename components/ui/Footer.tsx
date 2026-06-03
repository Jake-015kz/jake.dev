"use client";

import React, { useEffect, useState } from "react";
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
          <a href="https://t.me/Jake_sko" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <a href="https://wa.me/77058576466" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href="https://kwork.ru/user/87058576466a" target="_blank" rel="noopener noreferrer">
            Kwork
          </a>
          <a href="https://github.com/Jake-015kz" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="mailto:zhegan89@gmail.com">
            Email
          </a>
        </div>

        <a href="#hero" className={styles.backToTop} onClick={scrollToTop}>
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
