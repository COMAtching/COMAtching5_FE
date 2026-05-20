"use client";

import React from "react";
import { AxiosError } from "axios";
import { X, Check } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { BANK_INFO } from "@/lib/constants/charge";
import { usePurchaseProduct } from "@/hooks/usePurchaseProduct";
import { useRealName } from "@/hooks/useRealName";
import { ChargeDrawerContext } from "@/components/common/ChargeDrawer";

interface DirectChargeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  amount: number;
  productName?: string;
  depositorName?: string;
  onSwitchToToss?: () => void;
}

export default function DirectChargeDrawer({
  open,
  onOpenChange,
  productId,
  amount,
  productName,
  depositorName,
  onSwitchToToss,
}: DirectChargeDrawerProps) {
  const queryClient = useQueryClient();
  const drawerContext = React.useContext(ChargeDrawerContext);
  const { mutate: purchase, isPending } = usePurchaseProduct();
  const { data: realNameData } = useRealName();

  const [name, setName] = React.useState(
    depositorName || realNameData?.data?.realName || "",
  );
  const [agreed, setAgreed] = React.useState(false);

  // 실명이 로드되면 이름 업데이트
  React.useEffect(() => {
    const fetchedName = realNameData?.data?.realName;
    if (fetchedName && !depositorName && !name) {
      setName(fetchedName);
    }
  }, [realNameData, depositorName, name]);

  // Drawer가 닫힐 때 동의 상태 리셋
  React.useEffect(() => {
    if (!open) {
      setAgreed(false);
    }
  }, [open]);

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

  /* 토스 송금 딥링크 */
  const handleTossTransfer = (customAmount: number) => {
    const accountNo = BANK_INFO.account.replace(/-/g, "");
    const bankCode = BANK_INFO.bankCode;
    const message = "포인트충전";
    const tossDeepLink = `supertoss://send?accountNo=${accountNo}&bankCode=${bankCode}&amount=${customAmount}&message=${encodeURIComponent(message)}`;

    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      localStorage.setItem("tossPaymentInProgress", "1");
      const a = document.createElement("a");
      a.href = tossDeepLink;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("모바일 기기에서 토스 앱을 통해 송금하실 수 있습니다.");
    }
  };

  /* 충전 완료 알림 */
  const handleConfirmAction = (customAmount: number) => {
    if (!name) {
      alert("먼저 입금자명을 설정해 주세요.");
      onOpenChange(false);
      drawerContext?.setActiveTab(2);
      return;
    }

    purchase(productId, {
      onSuccess: () => {
        alert(
          "충전 요청이 완료되었습니다! 토스가 설치되어 있다면 토스로 바로 이동합니다.",
        );
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["myProfile"] });

        // 토스 송금 앱으로 즉시 자동 연동
        handleTossTransfer(customAmount);
      },
      onError: (error: AxiosError<{ code?: string; message?: string }>) => {
        const errorData = error.response?.data;
        if (errorData?.code === "PAY-003") {
          alert("이미 입금 확인 대기 중인 주문이 존재합니다.");
          onOpenChange(false);
        } else if (
          errorData?.code === "PAY-004" ||
          errorData?.message?.includes("사용자명") ||
          errorData?.message?.includes("입금자명")
        ) {
          alert(errorData?.message || "먼저 입금자명을 설정해 주세요.");
          onOpenChange(false);
          drawerContext?.setActiveTab(2);
        } else {
          alert(
            errorData?.message ||
              "충전 요청 중 오류가 발생했습니다. 다시 시도해 주세요.",
          );
        }
      },
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="rounded-t-[24px] bg-white outline-none"
        showHandle={false}
      >
        <div className="mx-auto w-full max-w-md pb-10 outline-none">
          <div className="flex flex-col gap-8 px-4 pt-6">
            {/* ── Header ── */}
            <DrawerHeader className="p-0">
              <div className="flex items-center justify-between">
                <DrawerTitle className="typo-20-700 font-sans text-black">
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
                  <div className="flex flex-col items-center gap-2 rounded-[8px] bg-white py-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                    <span className="typo-16-500 text-color-gray-900 text-center">
                      {BANK_INFO.bank}
                    </span>
                    <span className="typo-20-700 text-color-text-black text-center">
                      {BANK_INFO.account}
                    </span>
                    <span className="typo-14-500 text-center text-[#808080]">
                      예금주: {BANK_INFO.holder}
                    </span>
                  </div>
                </div>

                {/* 입금자명 */}
                <div className="flex items-center gap-2">
                  <span className="typo-16-600 pb-[2px] text-[#777777]">
                    입금자명
                  </span>
                  <div className="flex items-center gap-1 border-b border-[#6A6A6A] pb-[2px]">
                    <span className="typo-16-700 text-color-gray-900 leading-none">
                      {name || "미지정"}
                    </span>
                  </div>
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
              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  onClick={() => setAgreed((prev) => !prev)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                    agreed
                      ? "bg-gradient-to-br from-[#FF775E] via-[#FF4D61] to-[#E83ABC]"
                      : "border-2 border-[#CCCCCC] bg-white"
                  }`}
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
              <Button
                disabled={!agreed || isPending}
                onClick={() => handleConfirmAction(amount)}
              >
                {isPending ? "요청 중..." : "충전 확인 요청하기"}
              </Button>
              {onSwitchToToss && (
                <button
                  type="button"
                  onClick={onSwitchToToss}
                  className="text-center text-[12px] font-medium text-[#999999] transition-colors hover:text-[#666666]"
                >
                  혹은 Toss로 계좌이체하기
                </button>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
