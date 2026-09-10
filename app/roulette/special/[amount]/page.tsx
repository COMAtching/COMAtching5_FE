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
      <X
        size={24}
        onClick={() => router.push("/roulette/special")}
        className="text-color-gray-400 mt-[60px] mr-5 mb-4 cursor-pointer self-end transition-opacity hover:opacity-80"
      />

      <div className="flex w-full flex-col items-center px-4">
        {/* 축하 메시지 */}
        <h1 className="typo-24-600 text-color-text-black mt-2 w-full text-center">
          특별 보상에 <br />
          <span className="text-color-brand-primary-flame">당첨</span>됐어요!
        </h1>

        {/* 당첨 금액 */}
        <h2 className="text-color-text-black mt-[20px] text-center text-[40px] leading-[140%] font-bold">
          {displayAmount}원
        </h2>

        {/* 바우처 라벨 구분선 (Voucher container) */}
        <div className="mt-[20px] flex w-[218px] items-center gap-[16px]">
          <div className="h-0 flex-1 border border-[#FF4D61]" />
          <div className="flex h-[30px] shrink-0 items-center justify-center rounded-full bg-[#FF4D61] px-[12px] py-[4px]">
            <span className="typo-16-600 text-white">상품권</span>
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
              <div className="flex items-center justify-center rounded-full bg-[#999999]/30 px-[12px] py-[4px]">
                <span className="typo-12-600 text-color-gray-400">
                  수령 방법 1
                </span>
              </div>
              <span className="typo-14-600 text-color-text-black">
                부스에서 인증하기
              </span>
            </div>
            <p className="typo-14-500 text-color-gray-400">
              코마 부스에 방문하여 화면과 닉네임을 보여주세요
            </p>
          </div>

          {/* Way 2 */}
          <div className="flex w-full flex-col gap-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="flex items-center justify-center rounded-full bg-[#999999]/30 px-[12px] py-[4px]">
                <span className="typo-12-600 text-color-gray-400">
                  수령 방법 2
                </span>
              </div>
              <span className="typo-14-600 text-color-text-black">
                인스타그램 인증
              </span>
            </div>
            <p className="typo-14-500 text-color-gray-400 whitespace-pre-wrap">
              {"코마 공식 인스타그램 DM으로 \n화면과 닉네임을 보내주세요"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* 하단 영역 (버튼 + 유의사항) */}
      <div className="flex w-full flex-col items-center gap-6 px-4 pt-10 pb-[30px]">
        <Button
          onClick={() =>
            window.open("https://www.instagram.com/cuk_coma", "_blank")
          }
        >
          인스타그램으로 문의하기
        </Button>
        <div className="flex items-center justify-center gap-2">
          <Info size={12} className="text-color-gray-300" />
          <span className="typo-12-500 text-color-gray-300">
            준비 수량 소진 시 동일 가치 이상의 아이템으로 대체될 수 있어요
          </span>
        </div>
      </div>
    </div>
  );
}
