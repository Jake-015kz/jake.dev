"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./Header.module.scss";

const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Проекты", href: "#projects" },
  { label: "Контакты", href: "#contact" },
];

const scrollToSection = (href: string) => {
  const id = href.replace("#", "");
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

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

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      scrollToSection(href);
    },
    []
  );

  const handleMobileNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      // Небольшая задержка, чтобы меню закрылось перед скроллом
      setTimeout(() => scrollToSection(href), 100);
    },
    []
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <a
            href="#hero"
            className={styles.logo}
            onClick={(e) => handleNavClick(e, "#hero")}
          >
            JAKE<span className={styles.dot}>.</span>DEV
          </a>

          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.navLink}
                onClick={(e) => handleNavClick(e, link.href)}
              >
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
            onTouchEnd={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Menu"
            type="button"
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.mobileLink}
                onClick={(e) => handleMobileNavClick(e, link.href)}
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
    </>
  );
};

export default Header;
