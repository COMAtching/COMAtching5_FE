import matchingTicket from "@/public/main/ticket.png";
import optionTicket from "@/public/main/option.png";
import { useItems } from "@/hooks/useItems";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import ChargeDrawer from "./ChargeDrawer";
import { useFeature } from "@/stores/features";

interface MyCoinSectionProps {
  className?: string;
}

const MyCoinSection = ({ className }: MyCoinSectionProps) => {
  const { data, isLoading, isError } = useItems();
  const shop = useFeature("SHOP_PAYMENT");
  const closed = shop?.open === false;

  if (isError && !data) return null;
  const counts = data?.data;

  return (
    <section
      aria-busy={isLoading}
      className={cn(
        "flex h-9.5 w-full items-center justify-between rounded-full border border-white/30 bg-white/50 pr-2 pl-4 backdrop-blur-[50px]",
        className,
      )}
    >
      <div className="flex items-center">
        <span className="typo-14-600 text-color-text-caption3">보유현황</span>
        <Image
          src={matchingTicket}
          unoptimized
          loading="eager"
          alt="매칭권"
          width={20}
          height={20}
          className="mr-2 ml-4"
        />
        <span className="typo-14-600 text-color-text-caption1">
          {counts ? counts.matchingTicketCount + "장" : "–"}
        </span>
        <div className="mx-4 h-4 w-px bg-black/30" />
        <Image
          src={optionTicket}
          unoptimized
          loading="eager"
          alt="옵션권"
          className="mr-2"
          width={20}
          height={20}
        />
        <span className="typo-14-600 text-color-text-caption1">
          {counts ? counts.optionTicketCount + "장" : "–"}
        </span>
      </div>
      <ChargeDrawer
        trigger={
          <button
            aria-label={closed ? "종료된 상점 안내 열기" : "충전하기"}
            className={cn(
              "typo-11-700 h-6.5 rounded-full px-3",
              closed
                ? "bg-[#f1e7ea] text-[#744556]"
                : "bg-milky-pink text-white",
            )}
          >
            {closed ? "상점 종료" : "충전하기"}
          </button>
        }
      />
    </section>
  );
};

export default MyCoinSection;
