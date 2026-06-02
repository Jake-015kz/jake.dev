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
          © {new Date().getFullYear()} JAKE.DEV / ALL RIGHTS RESERVED
        </span>

        <span className={styles.meta}>
          ЛОКАЦИЯ: ПЕТРОПАВЛОВСК, КАЗАХСТАН (UTC+5) —{" "}
          <span className={styles.time}>{time}</span>
        </span>

        <a href="#hero" className={styles.backToTop}>
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
