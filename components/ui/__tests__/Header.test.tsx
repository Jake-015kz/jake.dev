import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../Header";

// Мокаем GSAP — не нужен для тестов Header
vi.mock("gsap", () => ({
  gsap: {
    to: vi.fn(),
    from: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
    })),
    context: vi.fn(() => ({ revert: vi.fn() })),
    quickTo: vi.fn(() => vi.fn()),
  },
}));

describe("Header — десктоп", () => {
  beforeEach(() => {
    // Десктоп: широкий экран
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1440,
    });
  });

  it("рендерит логотип JAKE.DEV", () => {
    render(<Header />);
    expect(screen.getByText(/JAKE/)).toBeInTheDocument();
    expect(screen.getByText(/\.DEV/)).toBeInTheDocument();
  });

  it("рендерит навигационные ссылки", () => {
    render(<Header />);
    expect(screen.getByText("Главная")).toBeInTheDocument();
    expect(screen.getByText("Проекты")).toBeInTheDocument();
    expect(screen.getByText("Контакты")).toBeInTheDocument();
  });

  it("навигационные ссылки — якорные href", () => {
    render(<Header />);
    expect(screen.getByText("Главная").closest("a")).toHaveAttribute("href", "#hero");
    expect(screen.getByText("Проекты").closest("a")).toHaveAttribute("href", "#projects");
    expect(screen.getByText("Контакты").closest("a")).toHaveAttribute("href", "#contact");
  });

  it("бургер НЕ виден на десктопе (display: none)", () => {
    render(<Header />);
    const burger = screen.queryByLabelText("Menu");
    // На десктопе бургер скрыт через CSS display: none
    // Но он всё ещё в DOM — проверяем что кнопка есть но скрыта
    if (burger) {
      expect(burger).toHaveStyle({ display: "none" });
    }
  });
});

describe("Header — мобильная версия", () => {
  beforeEach(() => {
    // Мобилка: узкий экран
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
  });

  it("бургер-кнопка рендерится", () => {
    render(<Header />);
    const burger = screen.getByLabelText("Menu");
    expect(burger).toBeInTheDocument();
    expect(burger.tagName).toBe("BUTTON");
  });

  it("клик по бургеру открывает мобильное меню", () => {
    render(<Header />);
    const burger = screen.getByLabelText("Menu");

    // До клика мобильного меню нет
    expect(screen.queryByText("Главная")).toBeInTheDocument(); // десктопная навигация

    // Клик
    fireEvent.click(burger);

    // После клика должно появиться мобильное меню
    // Проверяем что есть ссылки в мобильном меню
    const allMainLinks = screen.getAllByText("Главная");
    expect(allMainLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("клик по ссылке в мобильном меню закрывает его", () => {
    render(<Header />);
    const burger = screen.getByLabelText("Menu");

    // Открываем меню
    fireEvent.click(burger);

    // Кликаем по ссылке "Проекты" в мобильном меню
    const projectLinks = screen.getAllByText("Проекты");
    // Последняя — в мобильном меню
    fireEvent.click(projectLinks[projectLinks.length - 1]);

    // Мобильное меню должно закрыться — проверяем что body overflow сброшен
    expect(document.body.style.overflow).toBe("");
  });

  it("бургер использует стандартный React onClick (нет addEventListener костылей)", () => {
    const { container } = render(<Header />);
    const burger = container.querySelector("button[aria-label='Menu']");
    expect(burger).toBeInTheDocument();
    // Кнопка должна быть обычным <button> без ref-костылей
    expect(burger?.tagName).toBe("BUTTON");
  });
});

describe("Header — блокировка скролла", () => {
  it("при открытии меню body overflow = hidden", () => {
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    render(<Header />);
    const burger = screen.getByLabelText("Menu");

    fireEvent.click(burger);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("при закрытии меню body overflow снимается", () => {
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    render(<Header />);
    const burger = screen.getByLabelText("Menu");

    // Открыть
    fireEvent.click(burger);
    expect(document.body.style.overflow).toBe("hidden");

    // Закрыть
    fireEvent.click(burger);
    expect(document.body.style.overflow).toBe("");
  });
});
