"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import Button from "@/components/ui/Button";
import HobbyButton from "@/app/hobby-select/_components/HobbyButton";
import HobbySearchInput from "@/app/hobby-select/_components/HobbySearchInput";
import AddHobbyDrawer from "@/app/hobby-select/_components/AddHobbyDrawer";
import { HOBBIES, type HobbyCategory } from "@/lib/constants/hobbies";
import { MATCHING_INTEREST_CATEGORIES } from "@/lib/constants/matchingInterests";
import { createChoseongRegex } from "@/lib/utils/hangul";
import { Hobby } from "@/lib/types/profile";
import { removeEmoji } from "@/lib/utils";

const ALL_HOBBIES = Object.values(HOBBIES).flat() as string[];

interface HobbyEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialHobbies: Hobby[];
  onSave: (hobbies: Hobby[]) => void;
}

const findCategoryByHobbyName = (name: string): HobbyCategory => {
  const found = (Object.keys(HOBBIES) as HobbyCategory[]).find((cat) =>
    (HOBBIES[cat] as readonly string[]).includes(name),
  );
  return found || "자기계발";
};

const resolveDisplayHobbies = (hobbies: (Hobby | string)[]) => {
  return hobbies.map((h) => {
    const nameStr = typeof h === "string" ? h : h.name;
    const catStr =
      typeof h === "string" ? findCategoryByHobbyName(nameStr) : h.category;
    const normalizedName = removeEmoji(nameStr);
    const matched = ALL_HOBBIES.find((pre) => {
      const cleanPre = removeEmoji(pre);
      return (
        cleanPre === normalizedName ||
        cleanPre.includes(normalizedName) ||
        normalizedName.includes(cleanPre)
      );
    });
    return {
      category: typeof h === "string" ? catStr : h.category,
      name: matched || nameStr,
    };
  });
};

const HobbyEditDrawer = ({
  isOpen,
  onClose,
  initialHobbies,
  onSave,
}: HobbyEditDrawerProps) => {
  const resolvedInitialHobbies = useMemo(
    () => resolveDisplayHobbies(initialHobbies),
    [initialHobbies],
  );

  const [selected, setSelected] = useState<Hobby[]>(resolvedInitialHobbies);
  const [addedCustomHobbies, setAddedCustomHobbies] = useState<Hobby[]>(
    resolvedInitialHobbies.filter((h) => !ALL_HOBBIES.includes(h.name)),
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      setSelected(resolvedInitialHobbies);
      setAddedCustomHobbies(
        resolvedInitialHobbies.filter((h) => !ALL_HOBBIES.includes(h.name)),
      );
      setSearchKeyword("");
    }
  }, [isOpen, resolvedInitialHobbies]);

  const toggleHobby = (hobbyName: string, category?: HobbyCategory) => {
    setSelected((prev) => {
      const isAlreadySelected = prev.some((h) => h.name === hobbyName);
      if (isAlreadySelected) {
        return prev.filter((h) => h.name !== hobbyName);
      }
      if (prev.length >= 10) {
        alert("최대 10개까지 선택할 수 있어요.");
        return prev;
      }

      let finalCategory = category;
      if (!finalCategory) {
        const foundCategory = (Object.keys(HOBBIES) as HobbyCategory[]).find(
          (cat) => (HOBBIES[cat] as readonly string[]).includes(hobbyName),
        );
        finalCategory = foundCategory || "자기계발";
      }

      return [...prev, { category: finalCategory, name: hobbyName }];
    });
  };

  const filteredHobbies = useMemo(() => {
    if (!searchKeyword.trim()) return null;
    const searchRegex = createChoseongRegex(searchKeyword.trim());
    return ALL_HOBBIES.filter((hobby) => searchRegex.test(hobby));
  }, [searchKeyword]);

  const getHobbiesByCategory = (category: HobbyCategory) => {
    const predefined = HOBBIES[category];
    const customInCategory = addedCustomHobbies.filter(
      (h) => h.category === category,
    );
    return { predefined, customInCategory };
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[782px] max-h-[96vh] rounded-t-[16px] border-none bg-white p-0">
        {/* Frame 15: Header Section */}
        <div className="relative flex h-[67px] items-center justify-center px-6">
          <DrawerTitle className="typo-16-700 text-[#373737]">
            관심사 선택
          </DrawerTitle>
          <DrawerClose className="absolute top-1/2 right-6 -translate-y-1/2">
            <span className="typo-16-500 text-[#999999]">닫기</span>
          </DrawerClose>
        </div>

        {/* Frame 2612259: Content */}
        <div className="flex flex-1 flex-col overflow-hidden px-6 pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* 최근 좋아하는 관심사를 골라주세요. 최대 10개까지 선택할 수 있어요. */}
            <p className="typo-14-500 max-w-[196px] text-[#999999]">
              최근 좋아하는 관심사를 골라주세요. 최대 10개까지 선택할 수 있어요.
            </p>
            {/* Frame 20: Search */}
            <HobbySearchInput onSearch={setSearchKeyword} />
          </div>

          {/* Frame 22: Scroll Area */}
          <div className="scrollbar-hide mt-8 flex-1 overflow-y-auto pb-32">
            <div className="flex flex-col gap-8">
              {filteredHobbies ? (
                <div className="flex flex-col">
                  <h2 className="typo-16-600 mb-3 text-black">검색 결과</h2>
                  <div className="flex flex-wrap gap-3">
                    {filteredHobbies.length > 0 ? (
                      filteredHobbies.map((hobby) => (
                        <HobbyButton
                          key={hobby}
                          onClick={() => toggleHobby(hobby)}
                          selected={selected.some((h) => h.name === hobby)}
                        >
                          {hobby}
                        </HobbyButton>
                      ))
                    ) : (
                      <p className="typo-14-500 text-[#858585]">
                        검색된 관심사가 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                MATCHING_INTEREST_CATEGORIES.map((cat) => {
                  const { predefined, customInCategory } =
                    getHobbiesByCategory(cat);
                  return (
                    <div key={cat} className="flex flex-col">
                      {/* 스포츠, 문화, 음악 등 */}
                      <h2 className="typo-16-600 mb-3 text-black">{cat}</h2>
                      <div className="flex flex-wrap gap-3">
                        {predefined.map((hobby) => (
                          <HobbyButton
                            key={hobby}
                            onClick={() => toggleHobby(hobby)}
                            selected={selected.some((h) => h.name === hobby)}
                          >
                            {hobby}
                          </HobbyButton>
                        ))}
                        {customInCategory.map((hobby) => (
                          <HobbyButton
                            key={hobby.name}
                            onClick={() => toggleHobby(hobby.name, cat)}
                            selected={selected.some(
                              (h) => h.name === hobby.name,
                            )}
                          >
                            {hobby.name}
                          </HobbyButton>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 관심사 추가 섹션 */}
            <div className="typo-14-600 mt-10 flex flex-col items-start gap-3">
              <h2 className="text-black">내가 좋아하는 관심사가 없나요?</h2>
              <AddHobbyDrawer
                onAdd={(hobby, category) => {
                  const emojis = [
                    "✨",
                    "🌟",
                    "🔥",
                    "🌈",
                    "🍀",
                    "🎈",
                    "💎",
                    "🎸",
                    "🎨",
                    "🚀",
                  ];
                  const randomEmoji =
                    emojis[Math.floor(Math.random() * emojis.length)];
                  const newHobbyName = `${randomEmoji} ${hobby}`;
                  setAddedCustomHobbies((prev) => [
                    ...prev,
                    { category, name: newHobbyName },
                  ]);
                  toggleHobby(newHobbyName, category);
                }}
              >
                <HobbyButton plus>내 관심사 추가하기</HobbyButton>
              </AddHobbyDrawer>
            </div>
          </div>
        </div>

        {/* Next_btn: Footer Section */}
        <div className="fixed bottom-10 left-0 w-full px-6">
          <Button
            className="w-full"
            disabled={selected.length < 3}
            onClick={() => {
              onSave(selected);
              onClose();
            }}
          >
            선택 완료
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HobbyEditDrawer;
