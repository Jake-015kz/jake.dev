"use client";

import { useEffect } from "react";

/**
 * Полифилл-заглушка для window.scrollTo.
 * GSAP ScrollTrigger/ScrollToPlugin вызывает window.scrollTo с объектным аргументом
 * {left, top, behavior}, что крашит старые мобильные браузеры
 * с ошибкой "Window.scrollTo: Value can't be converted to a dictionary".
 * Этот компонент патчит window.scrollTo, чтобы он разворачивал объектный аргумент
 * в два числовых.
 */
export const ScrollToPolyfill: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalScrollTo = window.scrollTo.bind(window);

    window.scrollTo = function (x: any, y?: any) {
      if (typeof x === "object" && x !== null) {
        const left = (x as any).left ?? 0;
        const top = (x as any).top ?? 0;
        originalScrollTo(left, top);
      } else {
        originalScrollTo(x as number, y as number);
      }
    } as typeof window.scrollTo;

    return () => {
      window.scrollTo = originalScrollTo;
    };
  }, []);

  return null;
};

export default ScrollToPolyfill;
