"use client";
import React from "react";

interface IntroSectionProps {
  intro: string;
  onIntroChange: (value: string) => void;
}

const INTRO_MAX_LENGTH = 60;

const IntroSection = ({ intro, onIntroChange }: IntroSectionProps) => {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <label htmlFor="intro" className="typo-16-500 text-black">
        자기소개
      </label>

      <div className="relative box-border flex h-30 w-full items-start rounded-[16px] border border-[#0E1013]/10 bg-white p-4">
        <textarea
          id="intro"
          name="intro"
          value={intro}
          maxLength={INTRO_MAX_LENGTH}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= INTRO_MAX_LENGTH) {
              onIntroChange(value);
            }
          }}
          placeholder="나를 소개하는 한마디를 작성해주세요!"
          className="typo-16-500 h-full w-full resize-none border-0 bg-transparent leading-[160%] text-[#0E1013] placeholder:text-[#BDC1C6] focus:outline-none"
        />

        <span className="pointer-events-none absolute right-4 bottom-4 text-[16px] leading-[160%] font-medium text-[#DADCE0]">
          {intro.length}/{INTRO_MAX_LENGTH}
        </span>
      </div>
    </div>
  );
};

export default IntroSection;
