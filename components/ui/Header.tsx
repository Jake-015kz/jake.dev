"use client";

import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";

const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contact" },
];

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo}>
          JAKE<span className={styles.dot}>.</span>DEV
        </a>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>ДОСТУПЕН ДЛЯ ПРОЕКТОВ</span>
        </div>

        <button
          className={`${styles.burger} ${menuOpen ? styles.isOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          type="button"
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className={styles.mobileStatus}>
              <span className={styles.statusDot} />
              <span className={styles.mobileStatusText}>
                ДОСТУПЕН ДЛЯ ПРОЕКТОВ
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
