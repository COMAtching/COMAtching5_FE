"use client";
import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Button from "@/components/ui/Button";
import { SelectCheckButton } from "./ProfileImageSelection";

interface TermsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsDrawer = ({ isOpen, onOpenChange }: TermsDrawerProps) => {
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  });

  const checkGradient =
    "linear-gradient(220.53deg, #FF775E -18.87%, #FF4D61 62.05%, #E83ABC 125.76%)";

  const allAgreed = agreements.terms && agreements.privacy;

  const handleToggle = (key: "terms" | "privacy") => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = () => {
    if (allAgreed) {
      onOpenChange(false);
      // 여기서 다음 화면으로 이동하거나 데이터 전송
    }
  };

  const agreementsList = [
    { key: "terms" as const, label: "이용약관 동의" },
    { key: "privacy" as const, label: "개인정보 수집 이용 동의" },
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent
        showHandle={false}
        className="mx-auto w-full rounded-t-[24px] px-4 pt-6 pb-[64px] md:max-w-[430px]"
      >
        <DrawerHeader className="flex flex-row items-start justify-between p-0">
          <div className="flex flex-col gap-1 text-left">
            <DrawerTitle className="typo-20-700">
              약관에 동의해주세요
            </DrawerTitle>
            <p className="typo-14-500 leading-[1.3] text-gray-300">
              여러분의 소중한 개인정보를 잘 지켜 드릴게요
            </p>
          </div>
        </DrawerHeader>

        {/* 약관 체크박스 영역 */}
        <div className="mt-8 flex flex-col gap-4">
          {agreementsList.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <SelectCheckButton
                label={label}
                isSelected={agreements[key]}
                onClick={() => handleToggle(key)}
                gradient={checkGradient}
                marginClassName=""
              />
              <span className="typo-16-700 flex flex-1 items-center gap-2 text-black">
                {label}
                <span className="typo-12-700 text-gray-400">필수</span>
              </span>
              <Link href={key === "terms" ? "/terms" : "/privacy"}>
                <ChevronRight
                  size={20}
                  className="cursor-pointer text-gray-400"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 w-full">
          <Button
            type="button"
            className="bg-button-primary text-button-primary-text-default"
            style={
              !allAgreed
                ? {
                    background: "#1A1A1A",
                    border: "0.8px solid rgba(255, 255, 255, 0.3)",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                  }
                : undefined
            }
            onClick={handleComplete}
            disabled={!allAgreed}
          >
            모두 동의하고 시작하기
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TermsDrawer;
