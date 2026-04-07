import MyCoinSectionSSR from "@/components/common/MyCoinSectionSSR";
import { BackButton } from "@/components/ui/BackButton";
import React from "react";

const ScreenMatching = () => {
  return (
    <main className="flex flex-col items-center px-4 py-2">
      <BackButton text="매칭하기" />
      <div className="typo-14-500 grid h-8.5 grid-rows-2 text-center leading-4.25 text-[#858585]">
        <span>요즘 관심있는 것들을 3개 이상 선택해주세요.</span>
        <span>최대 10개까지 선택할 수 있어요.</span>
      </div>
      <MyCoinSectionSSR className="my-6" />
    </main>
  );
};

export default ScreenMatching;
