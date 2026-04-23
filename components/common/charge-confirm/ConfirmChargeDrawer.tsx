"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X, PencilLine, Check } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Button from "@/components/ui/Button";
import { BANK_INFO } from "@/lib/constants/charge";

/* ── Props ── */
interface ConfirmChargeDrawerProps {
  trigger: React.ReactNode;
  /** 입금액 (원 단위 숫자) */
  amount: number;
  /** 입금자명 (사전 설정된 값) */
  depositorName?: string;
}

/* ────────────────────────────────────── */

export default function ConfirmChargeDrawer({
  trigger,
  amount,
  depositorName = "박승원",
}: ConfirmChargeDrawerProps) {
  const [agreed, setAgreed] = React.useState(false);
  const [name, setName] = React.useState(depositorName);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  /* 입금자명 수정 시 input focus */
  React.useEffect(() => {
    if (isEditingName) inputRef.current?.focus();
  }, [isEditingName]);

  /* 계좌번호 복사 */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${BANK_INFO.bank} ${BANK_INFO.account}`,
      );
      alert("계좌 정보가 복사되었습니다.");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  /* 충전 완료 알림 */
  const handleConfirm = () => {
    alert("충전 요청이 완료되었습니다!");
  };

  return (
    <Drawer onOpenChange={() => setAgreed(false)}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className="rounded-t-[24px] bg-white outline-none"
        showHandle={false}
      >
        <div className="flex flex-col px-[15px] pt-6 pb-10">
          <div className="flex flex-col items-center gap-8">
            {/* ── Header ── */}
            <DrawerHeader className="w-full shrink-0 gap-0 p-0">
              <div className="flex items-center justify-between">
                <DrawerTitle className="typo-20-700 text-black">
                  계좌이체
                </DrawerTitle>
                <DrawerClose aria-label="닫기">
                  <X size={20} className="text-color-gray-400" />
                </DrawerClose>
              </div>
            </DrawerHeader>

            {/* ── Content ── */}
            <div className="flex w-full flex-col gap-6">
              {/* ── 입금 정보 카드 ── */}
              <div className="bg-color-gray-50 flex flex-col gap-4 rounded-[16px] p-4">
                {/* 입금계좌 라벨 + 복사 */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-[10px]">
                    <span className="typo-16-600 text-[#777777]">입금계좌</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="bg-color-gray-64 border-color-gray-100 typo-10-500 text-color-gray-300 flex items-center justify-center rounded-full border px-2 py-1 backdrop-blur-[50px]"
                    >
                      복사
                    </button>
                  </div>

                  {/* 계좌 정보 박스 */}
                  <div className="flex flex-col items-center gap-2 rounded-[8px] bg-white py-4">
                    <span className="typo-16-500 text-color-gray-900 text-center">
                      {BANK_INFO.bank}
                    </span>
                    <span className="typo-16-500 text-color-gray-900 text-center">
                      {BANK_INFO.account}
                    </span>
                    <span className="typo-16-500 text-color-gray-900 text-center">
                      예금주 : {BANK_INFO.holder}
                    </span>
                  </div>
                </div>

                {/* 입금자명 */}
                <div className="flex items-center gap-2">
                  <span className="typo-16-600 pb-[2px] text-[#777777]">
                    입금자명
                  </span>
                  {isEditingName ? (
                    <div className="flex items-center border-b border-[#6A6A6A] pb-[2px]">
                      <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setIsEditingName(false);
                        }}
                        className="typo-16-700 text-color-gray-900 h-[24px] w-[50px] bg-transparent text-center outline-none"
                        maxLength={6}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="flex items-center gap-1 border-b border-[#6A6A6A] pb-[2px]"
                    >
                      <span className="typo-16-700 text-color-gray-900 leading-none">
                        {name}
                      </span>
                      <PencilLine size={12} className="text-[#6A6A6A]" />
                    </button>
                  )}
                </div>

                {/* 입금액 */}
                <div className="flex items-center gap-2">
                  <span className="typo-16-600 pb-[2px] text-[#777777]">
                    입금액
                  </span>
                  <div className="flex items-center gap-1 pb-[2px]">
                    <span className="typo-16-700 text-color-gray-900">
                      {amount.toLocaleString()}
                    </span>
                    <span className="typo-16-700 text-color-gray-900">원</span>
                  </div>
                </div>
              </div>

              {/* ── 동의 체크 ── */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAgreed((prev) => !prev)}
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                    agreed
                      ? "bg-gradient-to-br from-[#FF775E] via-[#FF4D61] to-[#E83ABC]"
                      : "border-2 border-[#CCCCCC] bg-white",
                  )}
                  aria-label="동의 체크"
                >
                  {agreed && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </button>
                <span className="typo-16-700 text-black">
                  상기 계좌로 입금을 완료했습니다.
                </span>
              </div>
            </div>

            {/* ── 하단 버튼 영역 ── */}
            <div className="flex w-full flex-col items-center gap-4">
              {/* CTA 버튼 */}
              <Button disabled={!agreed} onClick={handleConfirm}>
                충전 완료 확인
              </Button>

              {/* Toss 링크 */}
              <span className="typo-12-500 text-center leading-[140%] text-[#999999]">
                혹은 Toss로 계좌이체하기
              </span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
