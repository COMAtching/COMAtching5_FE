"use client";

import React from "react";
import Image from "next/image";
import { useRouter, redirect } from "next/navigation";
import { X, Info } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SpecialAmountPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const router = useRouter();
  const { amount } = React.use(params);

  // 유효하지 않은 값이면 렌더링 즉시 튕겨냄 (useEffect 불필요)
  if (amount !== "10000" && amount !== "20000") {
    redirect("/roulette/special");
  }

  const displayAmount = amount === "20000" ? "20,000" : "10,000";

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FDC3D4 0%, #FFFDFD 21.83%, #FDECF0 100%)",
      }}
    >
      {/* Decorative Vectors (별/빛 모양 등) */}
      <div className="pointer-events-none absolute top-[102px] left-[69px] h-[32.5px] w-[22.5px]">
        <div className="absolute top-0 left-[10px] h-[14.5px] w-[12.5px] bg-[#FFB6D2]" />
        <div className="absolute top-[23.5px] left-0 h-[9px] w-[8.16px] bg-[#FFB6D2]" />
      </div>
      <div className="pointer-events-none absolute top-[132px] left-[283px] h-[43.5px] w-[41.5px]">
        <div className="absolute top-0 left-0 h-[10.5px] w-[10.5px] bg-[#FFB7D3]" />
        <div className="absolute top-[34px] left-[32px] h-[9.5px] w-[9.5px] bg-[#FFDAE6]" />
      </div>

      {/* 닫기 버튼 */}
      <div className="flex w-full justify-end px-5 pt-[60px] pb-4">
        <button
          onClick={() => router.push("/roulette/special")}
          className="flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-80"
        >
          <X size={24} className="text-[#999999]" />
        </button>
      </div>

      <div className="flex w-full flex-col items-center px-4">
        {/* 축하 메시지 */}
        <h1 className="mt-2 text-center text-[24px] leading-[140%] font-semibold text-[#1A1A1A]">
          당첨을 축하해요!
        </h1>

        {/* 당첨 금액 */}
        <h2 className="mt-[20px] text-center text-[40px] leading-[140%] font-bold text-[#1A1A1A]">
          {displayAmount}원
        </h2>

        {/* 바우처 라벨 구분선 (Voucher container) */}
        <div className="mt-[20px] flex w-[218px] items-center gap-[16px]">
          <div className="h-0 flex-1 border border-[#FF4D61]" />
          <div className="flex h-[30px] shrink-0 items-center justify-center rounded-full bg-[#FF4D61] px-[12px] py-[4px]">
            <span className="text-[16px] leading-[140%] font-semibold text-white">
              상품권
            </span>
          </div>
          <div className="h-0 flex-1 border border-[#FF4D61]" />
        </div>

        {/* 바우처 이미지 */}
        <div className="relative mt-6 h-[92px] w-[256px]">
          <Image
            src={`/roulette/item/gift_card_${amount}.png`}
            alt={`${displayAmount}원 상품권`}
            fill
            className="object-contain drop-shadow-[0px_4px_4px_rgba(0,0,0,0.1)]"
          />
        </div>

        {/* 사용 방법 안내 (Redemption instructions container) */}
        <div className="mt-[60px] flex w-full flex-col gap-[32px]">
          {/* Way 1 */}
          <div className="flex w-full flex-col gap-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="flex h-[25px] items-center justify-center rounded-full bg-[#999999]/30 px-[12px] py-[4px]">
                <span className="text-[12px] leading-[140%] font-semibold text-[#808080]">
                  방법 1
                </span>
              </div>
              <span className="text-[14px] leading-[140%] font-semibold text-[#1A1A1A]">
                마이페이지 확인
              </span>
            </div>
            <p className="text-[14px] leading-[140%] font-medium text-[#808080]">
              마이페이지 - 내 아이템에서 상품권을 확인하세요.
            </p>
          </div>

          {/* Way 2 */}
          <div className="flex w-full flex-col gap-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="flex h-[25px] items-center justify-center rounded-full bg-[#999999]/30 px-[12px] py-[4px]">
                <span className="text-[12px] leading-[140%] font-semibold text-[#808080]">
                  방법 2
                </span>
              </div>
              <span className="text-[14px] leading-[140%] font-semibold text-[#1A1A1A]">
                현장 데스크 교환
              </span>
            </div>
            <p className="text-[14px] leading-[140%] font-medium whitespace-pre-wrap text-[#808080]">
              {
                "축제 기간 중 총학생회 부스에 방문하여\n당첨 화면을 보여주고 실물 상품권으로 교환하세요."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* 하단 영역 (버튼 + 유의사항) */}
      <div className="flex w-full flex-col items-center gap-6 px-4 pt-10 pb-[30px]">
        <Button onClick={() => router.push("/roulette/special")}>확인</Button>
        <div className="flex items-center justify-center gap-2">
          <Info size={12} className="text-[#B3B3B3]" />
          <span className="text-[12px] leading-[14px] font-medium text-[#B3B3B3]">
            결제 취소 시 지급된 보상이 회수될 수 있어요
          </span>
        </div>
      </div>
    </div>
  );
}
