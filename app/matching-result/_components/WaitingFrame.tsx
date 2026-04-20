import React from "react";

const WaitingFrame = () => {
  return (
    <div className="mt-6 flex h-[200px] w-full flex-col items-center gap-[10px] rounded-[24px] border border-white/30 bg-white/50 p-6 shadow-[0px_0px_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      <div className="flex w-full flex-col self-stretch">
        <p
          className="animate-shimmer typo-16-500 bg-linear-to-r from-[#666666] via-[#B3B3B3] to-[#666666] bg-[length:200%_auto] bg-clip-text text-start leading-[19px] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(91.24deg, #666666 9.51%, #B3B3B3 35.68%, #666666 76.49%)",
          }}
        >
          코매칭 AI가 입력하신 결과를 바탕으로
          <br />
          비슷한 매칭 상대를 찾고 있어요..
        </p>
      </div>
    </div>
  );
};

export default WaitingFrame;
