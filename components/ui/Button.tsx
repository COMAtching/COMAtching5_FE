import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  backgroundColor?: string;
  width?: string;
  height?: string;
  fixed?: boolean;
  bottom?: string; // px 단위 문자열 (예: "20px", "0px")
  sideGap?: string; // px 단위 문자열 (예: "16px")
  maxWidth?: string; // fixed일 때 최대 너비 (예: "430px")
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
  bottom = "0px",
  sideGap = "16px",
  maxWidth = "max-w-[430px]",
  textColor = "text-button-primary-text-default",
  fontSize = "typo-20-600",
  safeArea = true,
  disabled = false,
  className,
  ref,
  ...props
}: ButtonProps) {
  // Tailwind 클래스인지 확인 (bg-, text- 등으로 시작)
  const isTailwindClass = (value: string) => {
    return /^(bg-|text-|border-)/.test(value);
  };

  // disabled 상태에 따른 배경색/텍스트색 결정
  const finalBackgroundColor = disabled
    ? "bg-button-background-disabled"
    : backgroundColor;
  const finalTextColor = disabled
    ? "text-button-primary-text-disabled"
    : textColor;

  // bg-button-primary일 때 border와 shadow 추가
  const isPrimaryButton = finalBackgroundColor === "bg-button-primary";

  // 색상 값을 className과 style로 분리
  const bgClass = isTailwindClass(finalBackgroundColor)
    ? finalBackgroundColor
    : undefined;
  const bgStyle = !isTailwindClass(finalBackgroundColor)
    ? finalBackgroundColor
    : undefined;

  const textClass = isTailwindClass(finalTextColor)
    ? finalTextColor
    : undefined;
  const textStyle = !isTailwindClass(finalTextColor)
    ? finalTextColor
    : undefined;

  // fixed일 때 bottom 계산 (safeArea 적용)
  const getBottomValue = () => {
    if (!fixed) return undefined;

    if (safeArea) {
      return `calc(${bottom} + env(safe-area-inset-bottom))`;
    }

    return bottom;
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        // 기본 스타일
        "flex items-center justify-center rounded-[12px] transition-colors duration-100",
        bgClass,
        height,
        textClass,
        fontSize,
        // fixed 속성에 따른 분기
        fixed ? `fixed z-50 mx-auto ${maxWidth}` : width,
        // disabled 상태에 따른 커서
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
      style={{
        ...(fixed
          ? {
              bottom: getBottomValue(),
              left: sideGap,
              right: sideGap,
            }
          : undefined),
        ...(bgStyle ? { backgroundColor: bgStyle } : undefined),
        ...(textStyle ? { color: textStyle } : undefined),
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
