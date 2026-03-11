import Image from "next/image";
import React from "react";

const MyCoinSection = () => {
  return (
    <section className="flex h-[38px] w-full items-center justify-between rounded-full border border-white/30 bg-white/50 pr-2 pl-4 backdrop-blur-[50px]">
      <div className="flex items-center">
        <span className="typo-14-600 text-color-text-caption3">보유현황</span>
        <Image
          src="/main/coin.png"
          alt="coin"
          width={20}
          height={20}
          className="mr-2 ml-4"
        />
        <span className="typo-14-600 text-color-text-caption1">1개</span>
        <div className="mx-4 h-4 w-px bg-black/30" />
        <Image
          src="/main/elec-bulb.png"
          alt="electric bulb"
          className="mr-2"
          width={20}
          height={20}
        />
        <span className="typo-14-600 text-color-text-caption1">1개</span>
      </div>
      <button className="bg-pink-conic typo-11-700 h-[26px] w-[58px] rounded-full text-white">
        구매하기
      </button>
    </section>
  );
};

export default MyCoinSection;
