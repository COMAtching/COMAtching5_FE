"use client";
import React from "react";
import { BackButton } from "@/components/ui/BackButton";
import Roulette from "./Roulette";
import MyTicketSection from "./MyTicketSection";

const ScreenRouletteMain = () => {
  return (
    <div className="flex w-full flex-col gap-8 px-5 pt-4">
      <BackButton text="룰렛" variant="plain" />

      <MyTicketSection />

      <div className="mt-10 flex flex-1 flex-col items-center justify-center">
        <Roulette onFinish={(idx) => console.log("당첨 인덱스:", idx)} />
      </div>
    </div>
  );
};

export default ScreenRouletteMain;
