import React from "react";
import Link from "next/link";
import styles from "./Button.module.scss";

// Собственные свойства компонента Button
type ButtonOwnProps<T extends React.ElementType> = {
  as?: T;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

// Полные свойства, объединяющие собственные свойства и свойства базового HTML-элемента/компонента T (включая ref)
export type ButtonProps<T extends React.ElementType = "button"> = ButtonOwnProps<T> &
  Omit<React.ComponentPropsWithRef<T>, keyof ButtonOwnProps<any>>;

/**
 * Полиморфный компонент Button.
 * Поддерживает рендеринг как обычной кнопки `<button>`, так и ссылок (HTML `<a>` или Next.js `<Link>`).
 * Полностью совместим с React 19 (реф передается как обычный проп без необходимости в `forwardRef`).
 */
export const Button = <T extends React.ElementType = "button">({
  as,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  children,
  ...rest
}: ButtonProps<T>) => {
  const Component = as || "button";

  // Сборка классов с фильтрацией пустых и ложных значений
  const combinedClass = [
    styles.button,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isLink = (Component as any) === Link;
  const isAnchor = Component === "a";
  const isInteractiveLink = isLink || isAnchor;

  // Формируем свойства компонента динамически, чтобы исключить дублирование JSX
  const componentProps: Record<string, any> = {
    className: combinedClass,
    ...rest,
  };

  if (isInteractiveLink) {
    // Для ссылок всегда указываем href (хотя бы заглушку), чтобы сохранить валидную разметку и доступность
    componentProps.href = href || "#";
    
    // Обработка состояния disabled для ссылок (ссылки не имеют встроенного атрибута disabled)
    if (disabled) {
      componentProps["aria-disabled"] = true;
      componentProps.tabIndex = -1; // Убираем из фокуса клавиатуры
      componentProps.onClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
      };
    }
  } else {
    // Для кнопок используем стандартный атрибут disabled
    componentProps.disabled = disabled;
    if (disabled) {
      componentProps["aria-disabled"] = true; // Для улучшения доступности скринридеров
    }
  }

  return <Component {...componentProps}>{children}</Component>;
};

// Алиас для обратной совместимости, если потребуется в будущем
export const ForwardedButton = Button;

export default Button;
