import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import HobbyButton from "@/app/hobby-select/_components/HobbyButton";
import { ADVANTAGES, type AdvantageCategory } from "@/lib/constants/advantages";
import Button from "@/components/ui/Button";
import { removeEmoji } from "@/lib/utils";

interface AdvantageDrawerProps {
  children: React.ReactNode;
  selectedAdvantages: string[];
  onComplete: (advantages: string[]) => void;
}

const AdvantageDrawer = ({
  children,
  selectedAdvantages,
  onComplete,
}: AdvantageDrawerProps) => {
  const [selected, setSelected] = useState<string[]>(selectedAdvantages);
  const [isOpen, setIsOpen] = useState(false);

  const resolveDisplayAdvantages = (advantages: string[]) => {
    const normalizedSelected = new Set(
      advantages.map((adv) => removeEmoji(adv)),
    );
    const allDisplayAdvantages = Object.values(ADVANTAGES).flat();

    return allDisplayAdvantages.filter((displayAdv) =>
      normalizedSelected.has(removeEmoji(displayAdv)),
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSelected(resolveDisplayAdvantages(selectedAdvantages));
    }
  };

  const toggleAdvantage = (advantage: string) => {
    const isAlreadySelected = selected.includes(advantage);

    if (isAlreadySelected) {
      setSelected((prev) => prev.filter((a) => a !== advantage));
      return;
    }

    if (selected.length >= 5) {
      alert("최대 5개까지 선택할 수 있어요.");
      return;
    }

    setSelected((prev) => [...prev, advantage]);
  };

  const handleComplete = () => {
    onComplete(selected);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        showHandle={false}
        className="mx-auto w-full rounded-t-[24px] px-[15px] pt-6 pb-6 md:max-w-[430px]"
      >
        <DrawerHeader className="flex flex-row items-start justify-between p-0">
          <div className="flex flex-col gap-1 text-left">
            <DrawerTitle>제 장점은요...</DrawerTitle>
            <p className="typo-12-400 text-[#858585]">
              내가 생각하는 나의 장점을 골라주세요 (최대 5개)
            </p>
          </div>
          <DrawerClose
            aria-label="닫기"
            className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>

        {/* 장점 목록 스크롤 영역 */}
        <div className="scrollbar-hide mt-6 flex max-h-[60vh] flex-col gap-8 overflow-y-auto pb-8">
          {(Object.keys(ADVANTAGES) as AdvantageCategory[]).map((category) => (
            <div key={category} className="flex flex-col">
              <h2 className="typo-16-600 mb-3 text-black">{category}</h2>
              <div className="flex flex-wrap gap-3">
                {ADVANTAGES[category].map((adv) => (
                  <HobbyButton
                    key={adv}
                    onClick={() => toggleAdvantage(adv)}
                    selected={selected.includes(adv)}
                  >
                    {adv}
                  </HobbyButton>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 고정 버튼 영역 */}
        <div className="mt-4 w-full">
          <Button
            type="button"
            className="bg-button-primary text-button-primary-text-default"
            onClick={handleComplete}
          >
            확인
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AdvantageDrawer;
