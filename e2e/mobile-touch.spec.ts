import { test, expect, Page } from "@playwright/test";

test.describe("Мобильная версия — тач и навигация", () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
  });

  test.afterEach(async () => {
    const criticalErrors = consoleErrors.filter(
      (e) =>
        e.includes("scrollTo") ||
        e.includes("hydrat") ||
        e.includes("Minified React error")
    );
    expect(
      criticalErrors,
      `Критические ошибки в консоли: ${criticalErrors.join("\n")}`
    ).toHaveLength(0);
  });

  test("1. Прелоадер исчезает и не блокирует тач", async ({ page }) => {
    await page.waitForTimeout(5000);

    const bodyOverflow = await page.evaluate(() => {
      return document.body.style.overflow;
    });
    expect(bodyOverflow === "" || bodyOverflow === "unset" || bodyOverflow === "auto").toBeTruthy();
  });

  test("2. Бургер кликабелен через тач", async ({ page }) => {
    await page.waitForTimeout(5000);

    const burger = page.locator("button[aria-label='Menu']");
    await expect(burger).toBeVisible();

    await burger.tap();

    // Проверяем что мобильные ссылки видны (последний nav в header — мобильное меню)
    const mobileLinks = page.locator("header nav").last().locator("a");
    await expect(mobileLinks.first()).toBeVisible();

    // Проверяем что body overflow = hidden
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe("hidden");

    // Проверяем что класс isOpen применился к бургеру
    const burgerClasses = await burger.getAttribute("class");
    expect(burgerClasses).toContain("isOpen");
  });

  test("3. Клик по ссылке в мобильном меню закрывает его и скроллит", async ({ page }) => {
    await page.waitForTimeout(5000);

    // Открываем бургер
    const burger = page.locator("button[aria-label='Menu']");
    await burger.tap();

    // Мобильные ссылки — в последнем nav внутри header
    const mobileNav = page.locator("header nav").last();
    const mobileLinks = mobileNav.locator("a");
    await expect(mobileLinks.first()).toBeVisible();

    // Кликаем по ссылке "Проекты" в мобильном меню
    const projectsLink = mobileLinks.filter({ hasText: "Проекты" });
    await projectsLink.click();

    // Проверяем что скролл разблокирован
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow === "" || bodyOverflow === "unset" || bodyOverflow === "auto").toBeTruthy();

    // Ждём плавный скролл
    await page.waitForTimeout(1500);

    // Проверяем что страница проскроллилась к секции #projects
    const projectsSection = page.locator("#projects");
    const isInViewport = await projectsSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= -100 && rect.top < window.innerHeight;
    });
    expect(isInViewport).toBeTruthy();
  });

  test("4. Нет ошибок Window.scrollTo в консоли", async ({ page }) => {
    await page.waitForTimeout(5000);

    const burger = page.locator("button[aria-label='Menu']");
    if (await burger.isVisible()) {
      await burger.tap();
      const mobileNav = page.locator("header nav").last();
      const contactLink = mobileNav.locator("a").filter({ hasText: "Контакты" });
      await contactLink.click();
    }

    await page.waitForTimeout(1500);

    const scrollToErrors = consoleErrors.filter(
      (e) => e.includes("scrollTo") || e.includes("Value can't be converted")
    );
    expect(
      scrollToErrors,
      `Ошибки scrollTo: ${scrollToErrors.join("\n")}`
    ).toHaveLength(0);
  });

  test("5. CustomCursor не рендерится на мобилке", async ({ page }) => {
    await page.waitForTimeout(5000);

    const cursorExists = await page.evaluate(() => {
      const all = document.querySelectorAll("div");
      for (const el of all) {
        const style = window.getComputedStyle(el);
        if (
          style.position === "fixed" &&
          style.borderRadius === "50%" &&
          style.width === "14px" &&
          style.pointerEvents === "none"
        ) {
          return true;
        }
      }
      return false;
    });
    expect(cursorExists).toBe(false);
  });

  test("6. Overlay-компоненты не блокируют тач", async ({ page }) => {
    await page.waitForTimeout(5000);

    const blockingElements = await page.evaluate(() => {
      const all = document.querySelectorAll("*");
      const blockers: string[] = [];
      for (const el of all) {
        const style = window.getComputedStyle(el);
        if (
          style.position === "fixed" &&
          style.pointerEvents !== "none" &&
          style.zIndex !== "auto" &&
          parseInt(style.zIndex) > 100
        ) {
          if (el.tagName !== "HEADER" && el.tagName !== "BUTTON") {
            blockers.push(`${el.tagName}.${el.className} (z:${style.zIndex}, pe:${style.pointerEvents})`);
          }
        }
      }
      return blockers;
    });

    expect(
      blockingElements,
      `Блокирующие элементы: ${blockingElements.join("\n")}`
    ).toHaveLength(0);
  });
});
