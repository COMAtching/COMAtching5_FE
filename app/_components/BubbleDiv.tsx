import Image from "next/image";
import React from "react";

const BubbleDiv = ({
  children,
  w = 226,
  h = 41.77,
  typo = "typo-16-600",
  top = 1,
}: {
  children?: React.ReactNode;
  w?: number;
  h?: number;
  typo?: string;
  top?: number;
}) => {
  return (
    <div className="relative" style={{ width: `${w}px`, height: `${h}px` }}>
      <span
        className={`${typo} absolute left-0 z-20 w-full text-center text-black`}
        style={{ top: `${top}px` }}
      >
        {children || (
          <>
            현재 <span className="text-bubble-text-highight">775명 </span>
            참여중이에요!
          </>
        )}
      </span>
      <Image src="/bubble/bubble.svg" alt="bubble" width={w} height={h} />
    </div>
  );
};

export default BubbleDiv;
