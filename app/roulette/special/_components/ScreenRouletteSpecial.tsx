"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import RouletteHeader from "../../_components/RouletteHeader";
import Button from "@/components/ui/Button";
import Roulette, {
  RouletteHandle,
  RouletteItem,
} from "../../_components/Roulette";
import RouletteProbabilityBottomSheet from "../../_components/RouletteProbabilityBottomSheet";
import SpecialRouletteChanceCard from "./SpecialRouletteChanceCard";
import RouletteResultModal from "../../_components/RouletteResultModal";

// TODO: 실제 API 연동 시 대체
const MOCK_REMAINING_CHANCES = 1;

const ScreenRouletteSpecial = () => {
  const router = useRouter();
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
          title="스페셜 룰렛"
          sidebar={
            <RouletteProbabilityBottomSheet
              defaultTab="special"
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

        {/* Special Remaining chances card */}
        <div className="mt-1">
          <SpecialRouletteChanceCard />
        </div>
      </div>

      {/* Center: Roulette Wheel */}
      <Roulette
        type="special"
        ref={rouletteRef}
        onSpinChange={setIsSpinning}
        onFinish={(item) => {
          setIsProbabilityOpen(false); // 바텀시트 닫기
          setResultItem(item);

          if (item.label === "1만원권 상품권") {
            router.push("/roulette/special/10000");
          } else if (item.label === "2만원권 상품권") {
            router.push("/roulette/special/20000");
          } else {
            setIsModalOpen(true);
          }
        }}
      />

      {/* Bottom Group: Spin Button + Notice */}
      <div className="flex w-full flex-col items-center gap-3">
        <Button
          disabled={!hasChances || isSpinning}
          onClick={handleSpin}
          className="typo-20-600 bg-button-primary w-full py-4"
        >
          {isSpinning ? "돌아가는 중..." : "룰렛 돌리기"}
        </Button>

        {/* Participation notice */}
        <div className="text-color-gray-300 typo-14-500 flex items-center gap-2">
          <CircleAlert size={16} />
          <span>결제 취소 시 지급된 보상이 회수될 수 있어요</span>
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

export default ScreenRouletteSpecial;
