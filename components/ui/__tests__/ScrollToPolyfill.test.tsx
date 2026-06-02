import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { ScrollToPolyfill } from "../ScrollToPolyfill";

describe("ScrollToPolyfill", () => {
  let originalScrollTo: typeof window.scrollTo;

  beforeEach(() => {
    originalScrollTo = window.scrollTo.bind(window);
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  it("патчит window.scrollTo для объектных аргументов", () => {
    render(<ScrollToPolyfill />);

    const scrollToSpy = vi.fn();
    const orig = window.scrollTo;
    window.scrollTo = scrollToSpy;

    // Вызываем с объектным аргументом (как GSAP)
    window.scrollTo({ left: 100, top: 200, behavior: "smooth" } as any);

    // Полифилл должен был развернуть объект в два числа
    expect(scrollToSpy).toHaveBeenCalledWith(100, 200);

    window.scrollTo = orig;
  });

  it("пропускает числовые аргументы без изменений", () => {
    render(<ScrollToPolyfill />);

    const scrollToSpy = vi.fn();
    const orig = window.scrollTo;
    window.scrollTo = scrollToSpy;

    window.scrollTo(0, 100);

    expect(scrollToSpy).toHaveBeenCalledWith(0, 100);

    window.scrollTo = orig;
  });

  it("обрабатывает объект без left/top (defaults to 0)", () => {
    render(<ScrollToPolyfill />);

    const scrollToSpy = vi.fn();
    const orig = window.scrollTo;
    window.scrollTo = scrollToSpy;

    window.scrollTo({} as any);

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

    window.scrollTo = orig;
  });

  it("восстанавливает оригинальный scrollTo при размонтировании", () => {
    const { unmount } = render(<ScrollToPolyfill />);

    // После монтирования scrollTo должен быть патчен
    expect(window.scrollTo).not.toBe(originalScrollTo);

    unmount();

    // После размонтирования — восстановлен
    expect(window.scrollTo).toBe(originalScrollTo);
  });
});
