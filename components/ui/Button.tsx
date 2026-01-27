import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  backgroundColor?: string;
  width?: string;
  height?: string;
  fixed?: boolean;
  bottom?: number; // 하단 여백 (px)
  sideGap?: number; // 좌우 여백 (px)
  maxWidth?: number; // fixed일 때 최대 너비 (px)
  textColor?: string;
  fontSize?: string;
  safeArea?: boolean; // safe-area-inset-bottom 적용 여부
  ref?: React.Ref<HTMLButtonElement>;
}

export default function Button({
  children,
  backgroundColor = "bg-button-primary",
  width = "w-full",
  height = "h-12",
  fixed = false,
  bottom = 0,
  sideGap = 16,
  maxWidth = 430,
  textColor = "text-button-primary-text-default",
  fontSize = "typo-20-600",
  safeArea = true,
  disabled = false,
  className,
  ref,
  ...props
}: ButtonProps) {
  // disabled 상태에 따른 배경색/텍스트색 결정
  const finalBackgroundColor = disabled
    ? "bg-button-background-disabled"
    : backgroundColor;
  const finalTextColor = disabled
    ? "text-button-primary-text-disabled"
    : textColor;

  // bg-button-primary일 때 border와 shadow 추가
  const isPrimaryButton = finalBackgroundColor === "bg-button-primary";

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
      disabled={disabled}
      className={cn(
        // 기본 스타일
        "flex items-center justify-center rounded-[12px] transition-colors duration-100",
        finalBackgroundColor,
        height,
        finalTextColor,
        fontSize,
        // fixed 속성에 따른 분기
        fixed ? "fixed z-50 mx-auto" : width,
        // disabled 상태에 따른 커서
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
      style={{
        ...(fixed
          ? {
              bottom: getBottomValue(),
              left: `${sideGap}px`,
              right: `${sideGap}px`,
              maxWidth: `${maxWidth}px`,
            }
          : undefined),
        ...(isPrimaryButton
          ? {
              border: "0.8px solid rgba(255, 255, 255, 0.3)",
              boxShadow:
                "0px 4px 8px rgba(0, 0, 0, 0.08), 0px 0px 16px rgba(0, 0, 0, 0.16)",
            }
          : undefined),
      }}
      {...props}
    >
      {children}
    </button>
  );
}
