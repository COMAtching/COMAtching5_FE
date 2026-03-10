import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

const BubbleDiv = ({
  children,
  w = 226,
  h = 42,
  typo = "typo-16-600",
  top = -4,
  shadow = false,
  className = "",
}: {
  children?: React.ReactNode;
  w?: number;
  h?: number;
  typo?: string;
  top?: number;
  shadow?: boolean;
  className?: string;
}) => {
  const shadowClass = shadow ? "drop-shadow-md" : "";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        shadowClass,
        className,
      )}
      style={{ width: `${w}px`, height: `${h}px` }}
    >
      <div
        className={cn(
          typo,
          "absolute inset-0 z-20 flex items-center justify-center text-center text-black",
        )}
        style={{ transform: `translateY(${top}px)` }}
      >
        <div>
          {children || (
            <>
              현재 <span className="text-bubble-text-highight">775명</span> 참여중이에요!
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
