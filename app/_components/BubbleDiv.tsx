import Image from "next/image";
import React from "react";

const BubbleDiv = () => {
  return (
    <div className="relative" style={{ width: 226, height: 41.77 }}>
      <span className="typo-16-600 absolute top-1 left-0 z-20 w-full text-center text-black">
        현재 <span className="text-bubble-text-highight">775명 </span>
        참여중이에요!
      </span>
      <Image src="/bubble/bubble.svg" alt="bubble" width={226} height={41.77} />
    </div>
  );
};

export default BubbleDiv;
