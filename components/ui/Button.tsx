import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fixed?: boolean;
  bottom?: number; // 하단 여백 (px)
  sideGap?: number; // 좌우 여백 (px)
  safeArea?: boolean; // safe-area-inset-bottom 적용 여부
  shadow?: boolean; // 그림자 적용 여부 (기본값: false, bg-button-primary일 때 자동 적용)
  ref?: React.Ref<HTMLButtonElement>;
}

export default function Button({
  children,
  fixed = false,
  bottom = 0,
  sideGap = 16,
  safeArea = false,
  disabled = false,
  shadow,
  className,
  ref,
  type = "button",
  ...props
}: ButtonProps) {
  // className에서 bg-button-primary 사용 여부 확인
  const isPrimaryButton =
    className?.includes("bg-button-primary") || !className?.includes("bg-");

  // 그림자 적용 여부 결정 (disabled이면 무조건 포함, 아니면 prop이나 primary 여부에 따라 결정)
  const hasShadow = disabled || (shadow ?? isPrimaryButton);

  // fixed일 때 bottom 계산 (safeArea 적용)
  const getBottomValue = () => {
    if (!fixed) return undefined;

    if (safeArea) {
      return `calc(${bottom}px + env(safe-area-inset-bottom))`;
    }

    return `${bottom}px`;
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        // 기본 스타일
        "flex h-12 w-full shrink-0 items-center justify-center rounded-[16px] transition-colors duration-100",
        // typo- 클래스가 명시되지 않은 경우에만 기본 typo-20-600 적용
        !className?.includes("typo-") && "typo-20-600",
        fixed && "fixed z-50 mx-auto",
        !disabled
          ? "bg-button-primary text-button-primary-text-default cursor-pointer"
          : "bg-button-background-disabled text-button-primary-text-disabled cursor-not-allowed",
        className,
      )}
      style={{
        ...(fixed && {
          bottom: getBottomValue(),
          left: "50%",
          transform: "translateX(-50%)",
          width: `calc(100% - ${sideGap * 2}px)`,
          maxWidth: `${430 - sideGap * 2}px`,
        }),
        ...(isPrimaryButton &&
          !disabled && {
            border: "0.8px solid rgba(255, 255, 255, 0.3)",
          }),
        // shadow가 true이거나 primary일 때 그림자 추가
        ...(hasShadow && {
          boxShadow:
            "0px 4px 8px rgba(0, 0, 0, 0.08), 0px 0px 16px rgba(0, 0, 0, 0.16)",
        }),
      }}
      {...props}
    >
      {children}
    </button>
  );
}
