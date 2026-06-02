import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomCursor } from "../CustomCursor";

// Мокаем GSAP
vi.mock("gsap", () => ({
  gsap: {
    to: vi.fn(),
    from: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
    })),
    context: vi.fn(() => ({ revert: vi.fn() })),
    quickTo: vi.fn(() => vi.fn()),
  },
}));

describe("CustomCursor — мобильная версия", () => {
  beforeEach(() => {
    // Мобилка
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
  });

  it("НЕ рендерит курсор на мобилке (return null)", () => {
    const { container } = render(<CustomCursor />);
    // На мобилке isDesktop = false, компонент возвращает null
    expect(container.firstChild).toBeNull();
  });

  it("не вешает слушателей mousemove на мобилке", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(<CustomCursor />);

    // Не должно быть mousemove слушателя
    const mousemoveCalls = addEventListenerSpy.mock.calls.filter(
      (call) => call[0] === "mousemove"
    );
    expect(mousemoveCalls.length).toBe(0);

    addEventListenerSpy.mockRestore();
  });
});

describe("CustomCursor — десктоп", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1440,
    });
  });

  it("рендерит курсор на десктопе", () => {
    const { container } = render(<CustomCursor />);
    // На десктопе isDesktop = true, компонент рендерит div
    expect(container.firstChild).not.toBeNull();
  });

  it("курсор имеет pointer-events: none", () => {
    const { container } = render(<CustomCursor />);
    const cursor = container.firstChild as HTMLElement;
    const computedStyle = window.getComputedStyle(cursor);
    expect(computedStyle.pointerEvents).toBe("none");
  });
});
