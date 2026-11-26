"use client";
import { showAppAlert } from "@/lib/app-alert";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { useFeatureStates } from "@/stores/features";
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

import Button from "@/components/ui/Button";
import { usePurchaseProduct } from "@/hooks/usePurchaseProduct";
import { useRealName } from "@/hooks/useRealName";
import { ChargeDrawerContext } from "@/components/common/ChargeDrawer";

interface DirectChargeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  maxOrderQuantity: number;
  amount: number;
  depositorName?: string;
  onSwitchToToss?: () => void;
}

export default function DirectChargeDrawer({
  open,
  onOpenChange,
  productId,
  maxOrderQuantity,
  amount,
  depositorName,
  onSwitchToToss,
}: DirectChargeDrawerProps) {
  const drawerContext = React.useContext(ChargeDrawerContext);
  const { mutate: purchase, isPending } = usePurchaseProduct();
  const { data: realNameData } = useRealName();

  const [name, setName] = React.useState(
    depositorName || realNameData?.data?.realName || "",
  );
  const [agreed, setAgreed] = React.useState(false);
  const [selection, setQuantity] = React.useState(1);
  const quantity = Math.min(selection, maxOrderQuantity);

  // 실명이 로드되면 이름 업데이트
  React.useEffect(() => {
    const fetchedName = realNameData?.data?.realName;
    if (fetchedName && !depositorName && !name) {
      setName(fetchedName);
    }
  }, [realNameData, depositorName, name]);

  // Drawer가 닫힐 때 상태 리셋
  React.useEffect(() => {
    if (!open) {
      setAgreed(false);
      setQuantity(1);
    }
  }, [open]);

  /* 충전 완료 알림 */
  const handleConfirmAction = () => {
    if (!useFeatureStates.getState().states.SHOP_PAYMENT?.open || quantity < 1)
      return;
    if (!name) {
      showAppAlert("먼저 입금자명을 설정해 주세요.", () => {
        onOpenChange(false);
        drawerContext?.setActiveTab(2);
      });
      return;
    }

    purchase(
      { productId, quantity },
      {
        onSuccess: () => {
          onOpenChange(false);
          drawerContext?.showPendingOrder();
        },
        onError: (error: AxiosError<{ code?: string; message?: string }>) => {
          const errorData = error.response?.data;
          if (errorData?.code === "PAY-003") {
            onOpenChange(false);
            drawerContext?.showPendingOrder();
          } else if (
            errorData?.code === "PAY-004" ||
            errorData?.message?.includes("사용자명") ||
            errorData?.message?.includes("입금자명")
          ) {
            showAppAlert(
              errorData?.message || "먼저 입금자명을 설정해 주세요.",
              () => {
                onOpenChange(false);
                drawerContext?.setActiveTab(2);
              },
            );
          } else {
            showAppAlert(
              errorData?.message ||
                "충전 요청 중 오류가 발생했습니다. 다시 시도해 주세요.",
            );
          }
        },
      },
    );
  };

  const isQuantityItem = maxOrderQuantity > 1;
  const totalAmount = amount * quantity;

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
              <div className="bg-color-gray-50 flex flex-col gap-4 rounded-2xl p-4">
                {/* 구매 수량 (조건부) */}
                {isQuantityItem && (
                  <div className="mt-2 flex items-center justify-start gap-4">
                    <span className="typo-16-600 text-[#777777]">
                      구매 수량
                    </span>
                    <div className="flex items-center gap-3 rounded-md border border-[#E5E5E5] bg-white px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="flex h-6 w-6 items-center justify-center text-[#777777] disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="typo-16-700 text-color-gray-900 w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(Math.min(maxOrderQuantity, quantity + 1))
                        }
                        disabled={quantity >= maxOrderQuantity}
                        className="flex h-6 w-6 items-center justify-center text-[#777777] disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-2 flex flex-col gap-2">
                  {/* 입금자명 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-16-600 pb-0.5 text-[#777777]">
                      입금자명
                    </span>
                    <div className="flex items-center gap-1 border-b border-[#6A6A6A] pb-0.5">
                      <span className="typo-16-700 text-color-gray-900 leading-none">
                        {name || "미지정"}
                      </span>
                    </div>
                  </div>

                  {/* 입금액 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-16-600 pb-0.5 text-[#777777]">
                      총 입금액
                    </span>
                    <div className="flex items-center gap-1 pb-0.5">
                      <span className="typo-16-700 text-color-gray-900">
                        {totalAmount.toLocaleString()}
                      </span>
                      <span className="typo-16-700 text-color-gray-900">
                        원
                      </span>
                    </div>
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
                  신청할 상품과 입금액을 확인했습니다.
                </span>
              </div>
            </div>

            {/* ── 하단 버튼 영역 ── */}
            <div className="flex w-full flex-col items-center gap-4">
              <Button
                disabled={!agreed || isPending}
                onClick={handleConfirmAction}
              >
                {isPending ? (
                  <LoadingSpinner variant="inline" label="요청 중" />
                ) : (
                  "충전 신청하고 입금 정보 보기"
                )}
              </Button>
              {onSwitchToToss && (
                <button
                  type="button"
                  onClick={onSwitchToToss}
                  className="text-center text-xs font-medium text-[#999999] transition-colors hover:text-[#666666]"
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
