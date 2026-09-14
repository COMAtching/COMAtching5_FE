"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { RouletteItem } from "@/app/roulette/_components/Roulette";

// ==========================================
// 당첨 아이템 → 이미지 경로 매핑
// ==========================================
const ITEM_IMAGE_MAP: Record<string, string> = {
  "옵션권 1장": "/roulette/item/option_ticket_1.png",
  "옵션권 2장": "/roulette/item/option_ticket_2.png",
  "옵션권 5장": "/roulette/item/option_ticket_5.png",
  꽝: "/roulette/item/no-luck.png",
  "뽑기권 1장": "/roulette/item/draw_ticket_1.png",
  "뽑기권 5장": "/roulette/item/draw_ticket_5.png",
  "뽑기권 10장": "/roulette/item/draw_ticket_10.png",
  풀세트: "/roulette/item/full_set.png",
  "1만원권 상품권": "/roulette/item/gift_card_10000.png",
  "2만원권 상품권": "/roulette/item/gift_card_20000.png",
};

// ==========================================
// 컨페티 조각 (장식용)
// ==========================================
const ConfettiLeft = () => (
  <div className="pointer-events-none absolute top-[59px] left-[25px] h-[153px] w-[70.87px]">
    <div className="absolute top-0 left-[1.5px] h-[5px] w-[5px] bg-[#FE4F80]" />
    <div className="absolute top-[29px] left-[35.5px] h-1 w-[6.5px] bg-[#FDD087]" />
    <div className="absolute top-[14.63px] left-[64.13px] h-[5px] w-[5px] rotate-[-62.51deg] bg-[#FF5380]" />
    <div className="absolute top-[69px] left-[60px] h-[8.53px] w-[10.5px] bg-[#FDC36C]" />
    <div className="absolute top-[77.5px] left-7 h-[5px] w-[4.5px] bg-[#FD66A5]" />
    <div className="absolute top-[97.5px] left-0 h-[5.5px] w-[4.5px] bg-[#FE489F]" />
    <div className="absolute top-[123.5px] left-[13.5px] h-[5.5px] w-[4.5px] bg-[#E26DF7]" />
    <div className="absolute top-[148.5px] left-[51.5px] h-[4.5px] w-[4.5px] bg-[#A7DFB2]" />
  </div>
);

const ConfettiRight = () => (
  <div className="pointer-events-none absolute top-[53px] right-[26px] h-[144.55px] w-[67.5px]">
    <div className="absolute top-0 left-[18px] h-[4.5px] w-[5px] bg-[#FB87D2]" />
    <div className="absolute top-[26.93px] left-3.5 h-[6.98px] w-1.5 bg-[#B0E6EF]" />
    <div className="absolute top-16 left-0 h-[3.5px] w-[3.5px] bg-[#FE939A]" />
    <div className="absolute top-[56.5px] left-6 h-[4.5px] w-[3.5px] bg-[#9D8CFB]" />
    <div className="absolute top-[51px] left-[59px] h-[6.41px] w-[8.5px] bg-[#92E595]" />
    <div className="absolute top-[135.5px] left-[39.5px] h-[6.41px] w-[8.5px] rotate-[95.26deg] bg-[#FB87D2]" />
  </div>
);

// ==========================================
// 당첨 결과 모달
// ==========================================
interface RouletteResultModalProps {
  open: boolean;
  onClose: () => void;
  item: RouletteItem | null;
}

export default function RouletteResultModal({
  open,
  onClose,
  item,
}: RouletteResultModalProps) {
  if (!item) return null;

  const imageSrc = ITEM_IMAGE_MAP[item.label] ?? "/roulette/item/no-luck.png";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center border-none bg-transparent p-0 shadow-none outline-none focus:ring-0"
      >
        <DialogTitle className="sr-only">룰렛 당첨 결과</DialogTitle>
        <DialogDescription className="sr-only">
          당첨된 보상을 확인하세요
        </DialogDescription>

        {/* 모달 본체 */}
        <div className="relative flex w-full max-w-[343px] flex-col items-center overflow-hidden rounded-2xl bg-white px-4 pt-10 pb-6 shadow-[0px_8px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)]">
          {/* 컨페티 (장식이므로 부모는 absolute 아님) */}
          {item.label !== "꽝" && (
            <>
              <ConfettiLeft />
              <ConfettiRight />
            </>
          )}

          {/* 상단 텍스트 영역 */}
          <div className="flex w-full flex-col items-center justify-center">
            <span className="typo-24-600 text-color-text-highlight">
              {item.label === "꽝" ? "아쉬워요!" : "축하해요!"}
            </span>
          </div>

          {/* 중앙 이미지 영역 (유동적 여백) */}
          <div className="relative mt-8 flex flex-col items-center justify-center">
            <div className="relative h-[150px] w-[150px]">
              <Image
                src={imageSrc}
                alt={item.label}
                fill
                priority
                className="object-contain drop-shadow-[0px_6.25px_25px_rgba(0,0,0,0.14)]"
              />
            </div>
            {/* 바닥 그림자 */}
            <div className="absolute bottom-[-10px] h-5 w-[100px] rounded-full bg-black/30 blur-[17px]" />
          </div>

          {/* 하단 텍스트 영역 */}
          <div className="mt-4 flex w-full flex-col items-center gap-2">
            <span className="typo-24-600 text-color-text-black">
              {item.label === "꽝" ? "이번엔 꽝이에요" : `${item.label} 당첨`}
            </span>
            <span className="typo-14-500 text-color-gray-400">
              {item.label === "꽝"
                ? "내일 다시 도전해 보세요!"
                : "보상이 바로 지급되었어요."}
            </span>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="mt-6 flex w-full flex-col items-center gap-6">
            <Button onClick={onClose}>확인</Button>
            {item.label !== "꽝" && (
              <button
                type="button"
                className="typo-14-500 text-color-gray-400 cursor-pointer text-center transition-opacity hover:opacity-80"
                onClick={() => {
                  onClose();
                  // TODO: 마이페이지/아이템 확인 페이지로 이동 로직 추가
                }}
              >
                충전내역에서 확인할 수 있어요.
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
