"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import Button from "@/components/ui/Button";
import HobbyButton from "@/app/hobby-select/_components/HobbyButton";
import { ADVANTAGES, AdvantageCategory } from "@/lib/constants/advantages";
import { removeEmoji } from "@/lib/utils";

import HobbySearchInput from "@/app/hobby-select/_components/HobbySearchInput";

const ADVANTAGE_CATEGORIES = Object.keys(ADVANTAGES) as AdvantageCategory[];

interface AdvantageEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTags: string[];
  onSave: (tags: string[]) => void;
}

const resolveDisplayAdvantages = (advantages: string[]) => {
  const normalizedSelected = advantages.map((adv) => removeEmoji(adv));
  const allDisplayAdvantages = Object.values(ADVANTAGES).flat();

  return allDisplayAdvantages.filter((displayAdv) => {
    const cleanDisplay = removeEmoji(displayAdv);
    return normalizedSelected.some(
      (sel) =>
        cleanDisplay === sel ||
        cleanDisplay.includes(sel) ||
        sel.includes(cleanDisplay),
    );
  });
};

const AdvantageEditDrawer = ({
  isOpen,
  onClose,
  initialTags,
  onSave,
}: AdvantageEditDrawerProps) => {
  const [selected, setSelected] = useState<string[]>(() =>
    resolveDisplayAdvantages(initialTags),
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      setSelected(resolveDisplayAdvantages(initialTags));
      setSearchKeyword("");
    }
  }, [isOpen, initialTags]);

  const toggleAdvantage = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((t) => t !== name);
      if (prev.length >= 5) {
        alert("최대 5개까지 선택할 수 있어요.");
        return prev;
      }
      return [...prev, name];
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[782px] max-h-[96vh] rounded-t-[16px] border-none bg-white p-0">
        {/* Header */}
        <div className="relative flex h-[67px] items-center justify-center px-6">
          <DrawerTitle className="typo-16-700 text-[#373737]">
            장점 선택
          </DrawerTitle>
          <DrawerClose className="absolute top-1/2 right-6 -translate-y-1/2">
            <span className="typo-16-500 text-[#999999]">닫기</span>
          </DrawerClose>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden px-6 pt-4">
          <p className="typo-14-500 text-center text-[#999999]">
            나의 장점을 골라주세요. <br />
            최대 5개까지 선택할 수 있어요.
          </p>

          <div className="mt-6">
            <HobbySearchInput
              onSearch={(keyword) => setSearchKeyword(keyword)}
            />
          </div>

          {/* Scroll Area */}
          <div className="scrollbar-hide mt-6 flex-1 overflow-y-auto pb-32">
            <div className="flex flex-col gap-8">
              {ADVANTAGE_CATEGORIES.map((cat) => {
                const filteredAdvs = ADVANTAGES[cat].filter((adv) =>
                  adv.toLowerCase().includes(searchKeyword.toLowerCase()),
                );

                if (filteredAdvs.length === 0) return null;

                return (
                  <div key={cat} className="flex flex-col">
                    <h2 className="typo-16-600 mb-3 text-black">{cat}</h2>
                    <div className="flex flex-wrap gap-3">
                      {filteredAdvs.map((adv) => (
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
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-10 left-0 w-full px-6">
          <Button
            className="w-full"
            onClick={() => {
              onSave(selected);
              onClose();
            }}
          >
            선택 완료 {selected.length > 0 && `(${selected.length})`}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AdvantageEditDrawer;
