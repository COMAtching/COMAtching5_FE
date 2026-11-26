"use client";

import React from "react";
import { useFeature } from "@/stores/features";
import TossChargeDrawer from "./TossChargeDrawer";
import DirectChargeDrawer from "./DirectChargeDrawer";

/* ── Props ── */
interface ConfirmChargeDrawerProps {
  trigger: React.ReactNode;
  /** 상품 ID */
  productId: number;
  maxOrderQuantity: number;
  /** 입금액 (원 단위 숫자) */
  amount: number;
  /** 상품 이름 */
  productName?: string;
  /** 입금자명 (사전 설정된 값) */
  depositorName?: string;
}

export default function ConfirmChargeDrawer({
  trigger,
  productId,
  maxOrderQuantity,
  amount,
  productName,
  depositorName,
}: ConfirmChargeDrawerProps) {
  const shopOpen = useFeature("SHOP_PAYMENT")?.open === true;
  const [openToss, setOpenToss] = React.useState(false);
  const [openDirect, setOpenDirect] = React.useState(false);

  /* Toss결제창에서 수동계좌이체창으로 전환 */
  const handleSwitchToDirect = () => {
    setOpenToss(false);
    // 슬라이드 다운 애니메이션을 위해 150ms 딜레이 후 실행
    setTimeout(() => {
      setOpenDirect(true);
    }, 150);
  };

  /* 수동계좌이체창에서 Toss결제창으로 전환 */
  const handleSwitchToToss = () => {
    setOpenDirect(false);
    // 슬라이드 다운 애니메이션을 위해 150ms 딜레이 후 실행
    setTimeout(() => {
      setOpenToss(true);
    }, 150);
  };

  const triggerElement = React.isValidElement(trigger)
    ? React.cloneElement(
        trigger as React.ReactElement<{
          onClick?: (e: React.MouseEvent) => void;
        }>,
        {
          onClick: (e: React.MouseEvent) => {
            (
              trigger.props as { onClick?: (e: React.MouseEvent) => void }
            ).onClick?.(e);
            if (shopOpen && maxOrderQuantity > 0) setOpenToss(true);
          },
        },
      )
    : trigger;

  return (
    <>
      {triggerElement}

      {/* 1. Toss 결제 전용 Drawer */}
      <TossChargeDrawer
        open={openToss && shopOpen && maxOrderQuantity > 0}
        onOpenChange={setOpenToss}
        productId={productId}
        maxOrderQuantity={maxOrderQuantity}
        amount={amount}
        productName={productName}
        depositorName={depositorName}
        onSwitchToDirect={handleSwitchToDirect}
      />

      {/* 2. 수동 계좌이체 전용 Drawer */}
      <DirectChargeDrawer
        open={openDirect && shopOpen && maxOrderQuantity > 0}
        onOpenChange={setOpenDirect}
        productId={productId}
        maxOrderQuantity={maxOrderQuantity}
        amount={amount}
        depositorName={depositorName}
        onSwitchToToss={handleSwitchToToss}
      />
    </>
  );
}
