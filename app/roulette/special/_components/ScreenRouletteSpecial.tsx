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
import { useRouletteStatus } from "@/hooks/useRouletteStatus";
import { useSpinRoulette } from "@/hooks/useSpinRoulette";

// 스페셜 룰렛 참여 기준 금액 (누적 결제 3,500원 이상)
const SPECIAL_TARGET_AMOUNT = 3500;

const ScreenRouletteSpecial = () => {
  const router = useRouter();
  const { data: rouletteStatus, isLoading } = useRouletteStatus();
  const { mutate: spinRoulette, isPending } = useSpinRoulette("SPECIAL");

  // 오늘 이미 참여했으면(true) 더 이상 돌릴 수 없음
  // 스페셜 룰렛은 isSpecialParticipated가 false이고 누적 결제금이 기준 이상이어야 참여 가능
  const totalPay = rouletteStatus?.totalPay ?? 0;
  const isSpecialParticipated = rouletteStatus?.isSpecialParticipated ?? true;
  const hasChances =
    !isSpecialParticipated && totalPay >= SPECIAL_TARGET_AMOUNT;

  const rouletteRef = useRef<RouletteHandle>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultItem, setResultItem] = useState<RouletteItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProbabilityOpen, setIsProbabilityOpen] = useState(false);

  const handleSpin = () => {
    if (!hasChances || isSpinning || isPending) return;

    spinRoulette(undefined, {
      onSuccess: (res) => {
        // 서버에서 성공 응답이 오면 반환된 rewardName을 타겟으로 룰렛 회전 시작
        rouletteRef.current?.spin(res.rewardName);
      },
    });
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
          <SpecialRouletteChanceCard
            currentAmount={totalPay}
            targetAmount={SPECIAL_TARGET_AMOUNT}
          />
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
          disabled={isLoading || !hasChances || isSpinning || isPending}
          onClick={handleSpin}
          className="typo-20-600 bg-button-primary w-full py-4"
        >
          {isLoading || isPending
            ? "확인 중..."
            : isSpinning
              ? "돌아가는 중..."
              : isSpecialParticipated
                ? "오늘은 이미 참여했어요"
                : !hasChances
                  ? `${(SPECIAL_TARGET_AMOUNT - totalPay).toLocaleString()}원 더 결제하면 참여 가능`
                  : "룰렛 돌리기"}
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
