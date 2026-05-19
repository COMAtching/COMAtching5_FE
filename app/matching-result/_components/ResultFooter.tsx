import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useMatching } from "@/hooks/useMatching";
import { MatchingRequest } from "@/lib/types/matching";
import { useRouter } from "next/navigation";
import { useItems } from "@/hooks/useItems";
import { useMatchingStore } from "@/stores/matching-store";
import { alertIfBlocked } from "@/lib/constants/date";

interface ResultFooterProps {
  lastPayload: MatchingRequest | null;
}

const ResultFooter = ({ lastPayload }: ResultFooterProps) => {
  const result = useMatchingStore((s) => s.result);
  const [timeLeft, setTimeLeft] = useState(3);
  const [isHolding, setIsHolding] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { mutate: match, isPending } = useMatching();
  const { data: itemData } = useItems();
  const router = useRouter();

  const matchingTicketCountOwned = itemData?.data.matchingTicketCount ?? 0;
  const optionTicketCountOwned = itemData?.data.optionTicketCount ?? 0;

  // 옵션 티켓 필요 개수 계산
  // - 같은 전공 제외: 1개
  // - 중요 옵션: 1개
  // - 커스텀 나이 구간 (ageOption 없이 min/maxAgeOffset 설정): 1개
  const optionTicketCount = lastPayload
    ? (lastPayload.sameMajorOption ? 1 : 0) +
      (lastPayload.importantOption ? 1 : 0) +
      (!lastPayload.ageOption &&
      lastPayload.minAgeOffset != null &&
      lastPayload.maxAgeOffset != null
        ? 1
        : 0)
    : 0;

  const handleHoldStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (alertIfBlocked()) {
      router.push("/main");
      return;
    }

    // 롱프레스 시 브라우저 기본 컨텍스트 메뉴 등이 뜨지 않도록 방지 (모바일 대응)
    if ("button" in e && e.button !== 0) return; // 마우스 왼쪽 클릭만 허용

    // 모바일에서 touchstart 후에 mousedown이 또 발생하는 것 방지
    if (e.type === "touchstart") {
      // e.preventDefault(); // 필요 시 추가 (단, 스크롤 방해 가능성 있음)
    }

    if (isHolding || isPending) return; // 이미 누르는 중이거나 요청 중이면 무시

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

              // 같은 조건으로 재매칭 실행
              if (lastPayload) {
                if (alertIfBlocked()) {
                  router.push("/main");
                  setIsHolding(false);
                  return true;
                }
                match(lastPayload);
              }

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
  }, [isHolding, lastPayload, match, router]);

  const handleHome = () => {
    // 메인 홈으로 이동
    router.push("/main");
  };

  const handleMailClick = () => {
    if (result?.chatRoomId) {
      router.push(`/chat/${result.chatRoomId}`);
    } else {
      router.push("/chat-list");
    }
  };

  return (
    <div className="mt-6 flex w-full flex-col gap-3">
      {/* Top Row: Home & Mail Buttons */}
      <div className="flex w-full flex-row gap-[10px]">
        {/* Home Button */}
        <button
          onClick={handleHome}
          className="flex h-[53px] flex-1 flex-col items-center justify-center rounded-[15px] bg-white px-[22px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px]"
        >
          <span className="typo-18-700 text-[#4E4E4E]">홈으로</span>
        </button>

        {/* Mail Button */}
        <button
          onClick={handleMailClick}
          className="bg-milky-pink flex h-[53px] flex-1 flex-col items-center justify-center rounded-[15px] px-[22px] text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px]"
        >
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
        disabled={
          isPending ||
          !lastPayload ||
          matchingTicketCountOwned < 1 ||
          optionTicketCountOwned < optionTicketCount
        }
        aria-label="같은 조건으로 한 번 더 뽑기. 3초간 길게 누르면 실행됩니다."
        className="flex w-full flex-row items-center justify-center gap-2 rounded-[15px] bg-linear-to-r from-[#FF4D61] to-[#FF775E] px-[22px] py-4 text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px] transition-all select-none active:scale-[0.98] disabled:opacity-50"
      >
        {!isHolding && !isTriggered && !isPending && (
          <div
            className="flex h-6 flex-row items-center gap-[10px] rounded-[36px] px-2 py-1 shadow-[0px_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-[50px]"
            style={{
              background:
                "radial-gradient(100% 99.65% at 0% -4.11%, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 100%)",
            }}
          >
            <div className="flex flex-row items-center gap-1">
              <Image
                src="/main/ticket.png"
                alt="coin"
                width={16}
                height={16}
                className="scale-x-[-1]"
              />
              <span className="typo-12-700 text-black">1</span>
            </div>
            {optionTicketCount > 0 && (
              <div className="flex flex-row items-center gap-1">
                <Image
                  src="/main/option.png"
                  alt="bulb"
                  width={16}
                  height={16}
                />
                <span className="typo-12-700 text-black">
                  {optionTicketCount}
                </span>
              </div>
            )}
          </div>
        )}
        <span className="typo-16-700">
          {isPending
            ? "매칭 중..."
            : isHolding
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
