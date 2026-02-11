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
  const isPrimaryButton = className?.includes("bg-button-primary");

  // 그림자 적용 여부 결정 (prop이 있으면 우선, 없으면 primary일 때 적용)
  const hasShadow = shadow ?? isPrimaryButton;

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
        // 기본 스타일 (기본 높이 h-12, 너비 w-full, 폰트 등 복구)
        "typo-20-600 text-button-primary-text-default bg-button-primary flex h-12 w-full shrink-0 items-center justify-center rounded-[16px] transition-colors duration-100",
        fixed && "fixed z-50 mx-auto",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        // 1. 사용자 className 먼저 적용 (여기서 h-10 등을 넣으면 위 h-12가 덮어씌워짐)
        className,
        // 2. disabled 스타일이 덮어쓰도록(맨 뒤에 배치)
        disabled &&
          "bg-button-background-disabled text-button-primary-text-disabled",
      )}
      style={{
        ...(fixed && {
          bottom: getBottomValue(),
          left: `${sideGap}px`,
          right: `${sideGap}px`,
        }),
        // bg-button-primary일 때 border 자동 추가
        ...(isPrimaryButton &&
          !disabled && {
            border: "0.8px solid rgba(255, 255, 255, 0.3)",
          }),
        // shadow가 true이거나 primary일 때 그림자 추가 (disabled 제외)
        ...(hasShadow &&
          !disabled && {
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
