"use client";
import React from "react";
import FormInput from "@/components/ui/FormInput";
import { Shuffle } from "lucide-react";

interface NicknameSectionProps {
  nickname: string;
  onNicknameChange: (value: string) => void;
}

const NicknameSection = ({
  nickname,
  onNicknameChange,
}: NicknameSectionProps) => {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <label htmlFor="nickname" className="typo-14-500 px-2 text-[#4D4D4D]">
        닉네임
      </label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <FormInput
            id="nickname"
            name="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            className="h-[48px] rounded-none border-b-2 border-[#E5E5E5] px-4 py-[3px] text-[16px] leading-[19px] font-medium text-[#0E1013] placeholder:text-[#BDC1C6]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.24) 100%)",
            }}
          />
        </div>
        <button
          type="button"
          /* Placeholder onClick, or remove if not needed */
          className="flex h-[48px] w-[120px] items-center justify-center gap-[8px] rounded-[16px] border border-[#0E1013]/10 bg-white"
        >
          <Shuffle size={16} color="#5F6368" />
          <span className="text-[18px] leading-none font-semibold text-[#5F6368]">
            랜덤
          </span>
        </button>
      </div>
    </div>
  );
};

export default NicknameSection;
