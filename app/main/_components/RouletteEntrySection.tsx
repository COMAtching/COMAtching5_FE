import Image from "next/image";
import Link from "next/link";
import React from "react";

const RouletteEntrySection = () => {
  return (
    <Link
      href="/roulette"
      prefetch={true}
      aria-label="오늘의 룰렛 이동"
      className="flex w-full items-center gap-4 overflow-hidden rounded-3xl border-[1.5px] border-white/30 bg-[radial-gradient(100%_99.65%_at_0%_-4.11%,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.3)_100%)] px-4 py-2 shadow-[0_0_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px] transition-transform duration-200 active:scale-[0.99]"
    >
      <div className="flex w-15 shrink-0 flex-col items-center justify-center gap-1.5">
        <Image
          src="/main/main-roulette.png"
          alt=""
          width={60}
          height={60}
          className="object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <div className="flex items-center gap-2">
          <span className="typo-18-600 text-color-text-black leading-5.25">
            오늘의 룰렛
          </span>
          <span className="typo-10-700 inline-flex h-3 w-7 items-center justify-center rounded-full bg-linear-to-r from-[#F76BA3] via-[#FA78A0] to-[#FC849F] leading-3 text-white">
            new
          </span>
        </div>

        <p className="typo-14-500 text-color-text-caption1 leading-4.25">
          무료로 돌릴 수 있는 룰렛이 있어요
        </p>
      </div>
    </Link>
  );
};

export default RouletteEntrySection;
