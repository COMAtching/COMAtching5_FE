"use client";

import React, { useState, useMemo } from "react";
import HobbyButton from "./HobbyButton";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useProfileStore } from "@/stores/profile-store";
import ProgressStepBar from "@/components/ui/ProgressStepBar";

import { HOBBIES, type HobbyCategory } from "@/lib/constants/hobbies";
import { MATCHING_INTEREST_CATEGORIES } from "@/lib/constants/matchingInterests";
import HobbySearchInput from "./HobbySearchInput";
import { createChoseongRegex } from "@/lib/utils/hangul";
import AddHobbyDrawer from "./AddHobbyDrawer";
import { Hobby } from "@/lib/types/profile";

const ALL_HOBBIES = Object.values(HOBBIES).flat() as string[];

const ScreenHobbySelect = () => {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  // 취미 이름으로 카테고리를 찾는 헬퍼 함수
  const findCategoryByHobbyName = (name: string): HobbyCategory => {
    const found = (Object.keys(HOBBIES) as HobbyCategory[]).find((cat) =>
      (HOBBIES[cat] as readonly string[]).includes(name),
    );
    return found || "자기계발";
  };

  // selected를 Hobby[] 형태로 관리하여 카테고리 정보 유지
  const [selected, setSelected] = useState<Hobby[]>(() => {
    const initial = profile.hobbies || [];
    if (initial.length > 0 && typeof initial[0] === "string") {
      return (initial as string[]).map((name) => ({
        category: findCategoryByHobbyName(name),
        name,
      }));
    }
    return initial as Hobby[];
  });

  // 사용자가 추가한 모든 커스텀 취미를 추적 (해제해도 남겨두기 위함)
  const [addedCustomHobbies, setAddedCustomHobbies] = useState<Hobby[]>(() => {
    return selected.filter((h) => !ALL_HOBBIES.includes(h.name));
  });

  const [searchKeyword, setSearchKeyword] = useState("");

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

  const handleComplete = () => {
    updateProfile({
      hobbies: selected,
    });
    router.push("/extra-info");
  };

  const filteredHobbies = useMemo(() => {
    if (!searchKeyword.trim()) return null;
    const searchRegex = createChoseongRegex(searchKeyword.trim());
    return ALL_HOBBIES.filter((hobby) => searchRegex.test(hobby));
  }, [searchKeyword]);

  // 카테고리별 선택된 취미
  const getHobbiesByCategory = (category: HobbyCategory) => {
    const predefined = HOBBIES[category];
    // 사용자가 이 카테고리에 추가했던 모든 커스텀 취미 추출
    const customInCategory = addedCustomHobbies.filter(
      (h) => h.category === category,
    );
    return {
      predefined,
      customInCategory,
    };
  };

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden px-4 pb-[120px]">
      <ProgressStepBar currentStep={2} totalSteps={3} />
      <div className="my-6 flex flex-col gap-2 text-center">
        <h1 className="typo-20-700 text-[#373737]">관심사를 알려주세요.</h1>
        <p className="typo-14-500 leading-[1.6] text-[#858585]">
          요즘 관심있는 것들을 3개 이상 선택해주세요.
          <br />
          최대 10개까지 선택할 수 있어요.
        </p>
      </div>
      <HobbySearchInput onSearch={setSearchKeyword} />

      <div className="mt-6 flex flex-col gap-8">
        {filteredHobbies ? (
          <div className="flex flex-col">
            <h2 className="typo-16-600 mb-3 text-black">검색 결과</h2>
            <div className="flex flex-wrap gap-3">
              {filteredHobbies.length > 0 ? (
                filteredHobbies.map((hobby) => {
                  const isSelected = selected.some((h) => h.name === hobby);
                  return (
                    <HobbyButton
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      selected={isSelected}
                    >
                      {hobby}
                    </HobbyButton>
                  );
                })
              ) : (
                <p className="typo-14-500 text-[#858585]">
                  검색된 관심사가 없습니다.
                </p>
              )}
            </div>
          </div>
        ) : (
          MATCHING_INTEREST_CATEGORIES.map((displayCategory) => {
            const hobbyCategory = displayCategory;
            const { predefined, customInCategory } =
              getHobbiesByCategory(hobbyCategory);
            return (
              <div key={displayCategory} className="flex flex-col">
                <h2 className="typo-16-600 mb-3 text-black">
                  {displayCategory}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {/* 기존 취미 목록 */}
                  {predefined.map((hobby) => (
                    <HobbyButton
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      selected={selected.some((h) => h.name === hobby)}
                    >
                      {hobby}
                    </HobbyButton>
                  ))}
                  {/* 이 카테고리에 추가된 커스텀 취미 목록 (해제 시에도 유지) */}
                  {customInCategory.map((hobby) => (
                    <HobbyButton
                      key={hobby.name}
                      onClick={() => toggleHobby(hobby.name, hobbyCategory)}
                      selected={selected.some((h) => h.name === hobby.name)}
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

      <div className="typo-14-600 mt-8 flex flex-col items-start gap-3">
        <h2>내가 좋아하는 관심사가 없나요?</h2>
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

      <Button
        type="button"
        fixed
        bottom={24}
        sideGap={16}
        safeArea
        disabled={selected.length < 3}
        onClick={handleComplete}
      >
        다음으로
      </Button>
    </main>
  );
};

export default ScreenHobbySelect;
