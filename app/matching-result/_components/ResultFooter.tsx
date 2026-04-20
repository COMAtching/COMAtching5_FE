import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const ResultFooter = () => {
  const [timeLeft, setTimeLeft] = useState(3);
  const [isHolding, setIsHolding] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoldStart = (e: React.MouseEvent | React.TouchEvent) => {
    // 롱프레스 시 브라우저 기본 컨텍스트 메뉴 등이 뜨지 않도록 방지 (모바일 대응)
    if ("button" in e && e.button !== 0) return; // 마우스 왼쪽 클릭만 허용

    // 모바일에서 touchstart 후에 mousedown이 또 발생하는 것 방지
    if (e.type === "touchstart") {
      // e.preventDefault(); // 필요 시 추가 (단, 스크롤 방해 가능성 있음)
    }

    if (isHolding) return; // 이미 누르는 중이면 무시

    setIsHolding(true);
    setTimeLeft(3);
    setIsTriggered(false);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // 성공적으로 트리거된 경우가 아니라면 시간 초기화
    if (!isTriggered) {
      setTimeLeft(3);
    }
  };

  useEffect(() => {
    if (isHolding) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTriggered((prevTriggered) => {
              if (prevTriggered) return prevTriggered;
              alert("한 번 더 뽑기 로직 실행!"); // 로직 실행 위치
              return true;
            });
            setIsHolding(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding]);

  return (
    <div className="mt-6 flex w-full flex-col gap-3">
      {/* Top Row: Retry & Mail Buttons */}
      <div className="flex w-full flex-row gap-[10px]">
        {/* Retry Button */}
        <button className="flex flex-1 flex-col items-center justify-center rounded-[15px] bg-white px-[22px] py-4 shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px]">
          <span className="typo-18-700 text-[#4E4E4E]">다시 뽑기</span>
        </button>

        {/* Mail Button */}
        <button className="bg-milky-pink flex flex-1 flex-col items-center justify-center rounded-[15px] px-[22px] py-4 text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px]">
          <span className="typo-18-700 text-white">쪽지 보내기</span>
        </button>
      </div>

      {/* Bottom Row: One More Button with Long Press */}
      <button
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        aria-label="같은 조건으로 한 번 더 뽑기. 3초간 길게 누르면 실행됩니다."
        className="flex w-full flex-row items-center justify-center gap-2 rounded-[15px] bg-linear-to-r from-[#FF4D61] to-[#FF775E] px-[22px] py-4 text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px] transition-all select-none active:scale-[0.98]"
      >
        {!isHolding && !isTriggered && (
          <div
            className="flex h-6 flex-row items-center gap-[10px] rounded-[36px] px-2 py-1 shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px]"
            style={{
              background:
                "radial-gradient(100% 99.65% at 0% -4.11%, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 100%)",
            }}
          >
            <div className="flex flex-row items-center gap-1">
              <Image
                src="/main/coin.png"
                alt="coin"
                width={16}
                height={16}
                className="scale-x-[-1]"
              />
              <span className="typo-12-700 text-black">1</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Image
                src="/main/elec-bulb.png"
                alt="bulb"
                width={16}
                height={16}
              />
              <span className="typo-12-700 text-black">1</span>
            </div>
          </div>
        )}
        <span className="typo-18-700">
          {isHolding
            ? `${timeLeft}초간 길게 누르세요 ...`
            : isTriggered
              ? "처리 중..."
              : "같은 조건으로 한번 더 뽑기"}
        </span>
      </button>
    </div>
  );
};

export default ResultFooter;
