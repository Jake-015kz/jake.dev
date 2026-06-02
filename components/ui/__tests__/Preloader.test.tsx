import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Preloader } from "../Preloader";

// Мокаем GSAP
const mockTimelineOnComplete = vi.fn();
vi.mock("gsap", () => ({
  gsap: {
    to: vi.fn(),
    from: vi.fn(),
    timeline: vi.fn(() => {
      const tl = {
        to: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        _onComplete: null,
      };
      return tl;
    }),
    context: vi.fn(() => ({ revert: vi.fn() })),
    quickTo: vi.fn(() => vi.fn()),
  },
}));

describe("Preloader — блокировка и разблокировка", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.style.overflow = "";
  });

  it("блокирует скролл при монтировании (overflow: hidden)", () => {
    const onComplete = vi.fn();
    render(<Preloader onComplete={onComplete} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("после завершения вызывает onComplete", () => {
    const onComplete = vi.fn();
    render(<Preloader onComplete={onComplete} />);

    // Прелоадер должен вызвать onComplete после таймаута
    // Fallback таймаут — 2500ms
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it("после завершения разблокирует скролл", () => {
    const onComplete = vi.fn();
    render(<Preloader onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // После завершения overflow должен быть снят
    expect(document.body.style.overflow).toBe("");
  });
});

describe("Preloader — pointer-events", () => {
  it("прелоадер имеет pointer-events: none в CSS", () => {
    const onComplete = vi.fn();
    const { container } = render(<Preloader onComplete={onComplete} />);

    const preloader = container.firstChild as HTMLElement;
    expect(preloader).toBeInTheDocument();

    // Проверяем что CSS класс применён
    // pointer-events: none задан в Preloader.module.scss
    const computedStyle = window.getComputedStyle(preloader);
    expect(computedStyle.pointerEvents).toBe("none");
  });
});
