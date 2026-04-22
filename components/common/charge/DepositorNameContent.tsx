"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function DepositorNameContent() {
  const [name, setName] = React.useState("");

  return (
    <div className="flex flex-col gap-[23px] pt-8">
      {/* ── 입금자명 입력 ── */}
      <div className="flex flex-col gap-2">
        <span className="typo-14-500 text-[#666666]">입금자명</span>
        <div
          className="flex h-[48px] items-center border-b border-[#B3B3B3] px-2"
          style={{
            background:
              "linear-gradient(180deg, rgba(245, 245, 245, 0.03) 0%, rgba(245, 245, 245, 0.24) 100%)",
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            className="typo-16-500 w-full bg-transparent text-center text-[#1A1A1A] outline-none placeholder:text-[#B3B3B3]"
            maxLength={6}
          />
        </div>
      </div>

      {/* ── 예시 이미지 ── */}
      <div className="flex flex-col gap-2">
        <span className="typo-14-500 text-[#666666]">예시</span>
        <div className="bg-color-gray-50 flex h-[121px] w-full items-center justify-center rounded-[16px] border border-[#EFEFEF]">
          <span className="typo-12-500 text-color-gray-400">
            Toss 앱 입금자명 설정 예시 이미지
          </span>
        </div>
      </div>

      {/* ── 안내 가이드 (Frame 2612440) ── */}
      <div className="bg-color-gray-50 flex flex-col gap-6 rounded-[16px] p-4">
        {/* 유의사항 */}
        <div className="flex flex-col gap-2">
          <span className="typo-14-600 text-[#808080]">유의사항</span>
          <p className="typo-14-500 leading-[160%] text-[#999999]">
            코매칭에 보내실 입금자명을 입력해 주세요. 입금자명은 한글이나
            영문자로 6자 이내입니다. 특수문자는 사용할 수 없습니다. Toss 앱에
            사전 설정된 입금자명을 입력하시면 간편합니다. 나중에 다시 수정할 수
            있어요!
          </p>
        </div>

        {/* FAQ */}
        <div className="flex flex-col gap-2">
          <span className="typo-14-600 text-[#808080]">
            왜 입금자명을 설정해야 하나요?
          </span>
          <p className="typo-14-500 leading-[140%] text-[#999999]">
            모든 포인트 충전은 계좌이체로 진행되고 있어요. 충전 간 복잡함을
            줄이기 위해, 사전에 입금자명을 설정하시면 더욱 편리하고 쾌적한
            코매칭을 즐기실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
