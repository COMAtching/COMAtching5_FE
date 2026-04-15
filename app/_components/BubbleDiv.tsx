import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

const BubbleDiv = ({
  children,
  w,
  h = 42,
  typo = "typo-16-600",
  textColor = "text-black",
  top = -4,
  shadow = false,
  className = "",
}: {
  children?: React.ReactNode;
  w?: number | "fit";
  h?: number;
  typo?: string;
  top?: number;
  shadow?: boolean;
  textColor?: string;
  className?: string;
}) => {
  const shadowClass = shadow ? "drop-shadow-md" : "";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center px-6",
        w === "fit" || !w ? "w-fit" : "",
        shadowClass,
        className,
      )}
      style={{
        width: w && w !== "fit" ? `${w}px` : undefined,
        height: `${h}px`,
      }}
    >
      <div
        className={cn(
          typo,
          textColor,
          "relative z-20 flex items-center justify-center text-center whitespace-nowrap",
        )}
        style={{ transform: `translateY(${top}px)` }}
      >
        <div>
          {children || (
            <>
              현재 <span className="text-bubble-text-highight">775명</span>{" "}
              참여중이에요!
            </>
          )}
        </div>
      </div>
      <Image
        src="/bubble/bubble.svg"
        alt="말풍선"
        fill
        sizes={`${w}px`}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-fill"
      />
    </div>
  );
};

export default BubbleDiv;
