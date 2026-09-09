"use client";
import React, { useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import RouletteHeader from "../../_components/RouletteHeader";
import Button from "@/components/ui/Button";
import Roulette, {
  RouletteHandle,
  RouletteItem,
} from "../../_components/Roulette";
import RouletteProbabilityBottomSheet from "../../_components/RouletteProbabilityBottomSheet";
import RouletteResultModal from "../../_components/RouletteResultModal";

// TODO: 실제 API 연동 시 대체
const MOCK_REMAINING_CHANCES = 1;

const ScreenRouletteFree = () => {
  const remainingChances = MOCK_REMAINING_CHANCES;
  const hasChances = remainingChances > 0;

  const rouletteRef = useRef<RouletteHandle>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultItem, setResultItem] = useState<RouletteItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProbabilityOpen, setIsProbabilityOpen] = useState(false);

  const handleSpin = () => {
    if (!hasChances || isSpinning) return;
    rouletteRef.current?.spin();
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-between overflow-x-hidden overflow-y-auto px-5 pt-3 pb-6">
      {/* Top Group: Header, Badge, Tagline */}
      <div className="flex w-full flex-col items-center">
        <RouletteHeader
          title="무료 룰렛"
          sidebar={
            <RouletteProbabilityBottomSheet
              defaultTab="free"
              open={isProbabilityOpen}
              onOpenChange={setIsProbabilityOpen}
              trigger={
                <button
                  type="button"
                  className="typo-14-500 text-color-text-caption3 cursor-pointer transition-opacity hover:opacity-80"
                >
                  확률 안내
                </button>
              }
            />
          }
        />

        {/* Remaining chances badge */}
        <div className="border-color-gray-0-a30 bg-color-gray-0-a30 mt-1 flex h-[35px] items-center gap-2 rounded-full border px-3 shadow-[0px_0px_8px_rgba(0,0,0,0.04),0px_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[15px]">
          <span className="typo-14-600 text-color-text-highlight">
            오늘 {remainingChances}회 남음
          </span>
        </div>

        {/* Tagline */}
        <p className="typo-20-600 text-color-text-black mt-4 mb-1 text-center">
          {hasChances ? (
            <>
              매일 한 번,{" "}
              <span className="text-color-text-highlight">행운</span>을
              돌려보세요
            </>
          ) : (
            "오늘 사용 완료! 내일 또 도전해봐요"
          )}
        </p>
      </div>

      {/* Center: Roulette Wheel */}
      <Roulette
        type="free"
        ref={rouletteRef}
        onSpinChange={setIsSpinning}
        onFinish={(item) => {
          setIsProbabilityOpen(false); // 바텀시트 닫기
          setResultItem(item);
          setIsModalOpen(true);
        }}
      />

      {/* Bottom Group: Spin Button + Notice */}
      <div className="flex w-full flex-col items-center gap-3">
        <Button
          disabled={!hasChances || isSpinning}
          onClick={handleSpin}
          className="typo-20-600 bg-button-primary w-full py-4"
        >
          {isSpinning ? "돌아가는 중..." : "무료로 룰렛 돌리기"}
        </Button>

        {/* Participation notice */}
        <div className="text-color-gray-300 typo-14-500 flex items-center gap-2">
          <CircleAlert size={16} />
          <span>1일 1회 참여할 수 있어요</span>
        </div>
      </div>

      <RouletteResultModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          rouletteRef.current?.reset();
        }}
        item={resultItem}
      />
    </div>
  );
};

export default ScreenRouletteFree;
