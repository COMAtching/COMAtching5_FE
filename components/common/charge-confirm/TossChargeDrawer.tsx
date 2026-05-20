"use client";

import React from "react";
import Image from "next/image";
import { AxiosError } from "axios";
import { X, Pencil } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useQueryClient } from "@tanstack/react-query";
import { usePurchaseProduct } from "@/hooks/usePurchaseProduct";
import { useRealName } from "@/hooks/useRealName";
import { useUpdateRealName } from "@/hooks/useUpdateRealName";
import { ChargeDrawerContext } from "@/components/common/ChargeDrawer";
import { BANK_INFO } from "@/lib/constants/charge";

interface TossChargeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  amount: number;
  productName?: string;
  depositorName?: string;
  onSwitchToDirect: () => void;
}

export default function TossChargeDrawer({
  open,
  onOpenChange,
  productId,
  amount,
  productName,
  depositorName,
  onSwitchToDirect,
}: TossChargeDrawerProps) {
  const queryClient = useQueryClient();
  const drawerContext = React.useContext(ChargeDrawerContext);
  const { mutate: purchase, isPending } = usePurchaseProduct();
  const { data: realNameData } = useRealName();
  const { mutate: updateName } = useUpdateRealName();

  const [name, setName] = React.useState(
    depositorName || realNameData?.data?.realName || "",
  );

  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState("");

  // 실명이 로드되면 이름 업데이트
  React.useEffect(() => {
    const fetchedName = realNameData?.data?.realName;
    if (fetchedName && !depositorName && !name) {
      setName(fetchedName);
    }
  }, [realNameData, depositorName, name]);

  // Drawer가 열리거나 닫힐 때 상태 리셋
  React.useEffect(() => {
    if (open) {
      setIsEditingName(false);
      setNameInput(name || realNameData?.data?.realName || "");
    }
  }, [open, name, realNameData]);

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

  /* 실명 변경 저장 */
  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameInput(name);
      setIsEditingName(false);
      return;
    }
    if (trimmed === name) {
      setIsEditingName(false);
      return;
    }

    updateName(trimmed, {
      onSuccess: () => {
        setName(trimmed);
        setIsEditingName(false);
        queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        queryClient.invalidateQueries({ queryKey: ["realName"] });
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        const errMsg =
          error.response?.data?.message || "입금자명 변경에 실패했습니다.";
        alert(errMsg);
        setNameInput(name);
        setIsEditingName(false);
      },
    });
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
        {/* ── Choice View (Default Modal) ── */}
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 px-4 pt-6 pb-10 outline-none">
          {/* ── Header (CONTENTS) ── */}
          <div className="flex h-6 w-full items-center justify-between">
            <DrawerTitle className="font-sans text-[20px] leading-[24px] font-bold text-black">
              결제하기
            </DrawerTitle>
            <DrawerClose
              aria-label="닫기"
              className="flex h-5 w-5 items-center justify-center"
            >
              <X size={20} className="text-[#999999]" />
            </DrawerClose>
          </div>

          {/* ── Content (Frame 2612290) ── */}
          <div className="flex w-full flex-col items-center gap-6">
            {/* ── Product Card (Frame 2612294) ── */}
            <div className="flex w-full flex-col items-start gap-4 rounded-[16px] bg-[#F5F5F5] p-4">
              {/* Row 1 (Product Name & Price) */}
              <div className="flex w-full flex-row items-center justify-between border-b border-[#EAEAEA] pb-3">
                <span className="text-[16px] font-semibold text-[#1A1A1A]">
                  {productName || "뽑기권"}
                </span>
                <span className="text-[16px] font-semibold text-[#808080]">
                  {amount.toLocaleString()}원
                </span>
              </div>

              {/* Row 2 (Pricing/Depositor) */}
              <div className="flex w-full flex-col gap-3">
                {/* Depositor Name (Frame 2612281) */}
                <div className="flex w-full flex-row items-center justify-end gap-2">
                  <span className="text-[16px] leading-[19px] font-semibold text-[#999999]">
                    입금자명
                  </span>
                  <div
                    onClick={() => {
                      if (!isEditingName) {
                        setIsEditingName(true);
                      }
                    }}
                    className="flex cursor-pointer flex-row items-center justify-center gap-1 border-b border-[#B3B3B3] p-0.5"
                  >
                    {isEditingName ? (
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                        }}
                        autoFocus
                        maxLength={6}
                        className="w-16 border-none bg-transparent text-right text-[16px] font-bold text-[#1A1A1A] outline-none"
                      />
                    ) : (
                      <>
                        <span className="text-[16px] leading-[19px] font-bold text-[#1A1A1A]">
                          {name || "미지정"}
                        </span>
                        <Pencil size={12} className="text-[#B3B3B3]" />
                      </>
                    )}
                  </div>
                </div>

                {/* Total Price (Frame 2612282) */}
                <div className="flex w-full flex-row items-center justify-end gap-2">
                  <span className="text-[16px] leading-[19px] font-semibold text-[#999999]">
                    결제 금액
                  </span>
                  <div className="flex flex-row items-center justify-center gap-1">
                    <span className="text-[16px] leading-[19px] font-bold text-[#1A1A1A]">
                      {amount.toLocaleString()}
                    </span>
                    <span className="text-[16px] leading-[19px] font-bold text-[#1A1A1A]">
                      원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer (Frame 2612789) ── */}
          <div className="flex w-full flex-col items-center gap-4">
            {/* Toss Payments Button (Next_btn) */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleConfirmAction(amount)}
              className="flex h-12 w-full max-w-[345px] flex-row items-center justify-center gap-[10px] rounded-[8px] bg-[#1A1A1A] px-[18px] py-[3px] transition-colors hover:bg-black"
            >
              <Image
                src="/charge/toss.png"
                alt="Toss Payments"
                width={26}
                height={26}
                className="order-0 h-[26px] w-[26px] flex-none flex-grow-0 object-contain"
              />
              <span className="order-1 flex h-[24px] w-auto flex-none flex-grow-0 items-center justify-center text-center font-sans text-[20px] leading-[24px] font-semibold text-white">
                {isPending
                  ? "요청 중..."
                  : `Toss로 ${amount.toLocaleString()}원 결제하기`}
              </span>
            </button>

            {/* Manual Transfer Link */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-center text-[12px] leading-[160%] font-medium text-[#999999]">
                토스앱을 설치하지 않으셨나요?
              </span>
              <button
                type="button"
                onClick={onSwitchToDirect}
                className="text-center text-[12px] leading-[160%] font-medium text-[#999999] underline underline-offset-4 transition-colors hover:text-[#666666]"
              >
                수동으로 계좌이체하기
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
