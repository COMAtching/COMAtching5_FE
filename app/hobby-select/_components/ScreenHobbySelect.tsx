"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import HobbyButton from "./HobbyButton";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { useProfile } from "@/providers/profile-provider";
import ProgressStepBar from "@/components/ui/ProgressStepBar";
import Blur from "@/components/common/Blur";

import { HOBBIES, type HobbyCategory } from "@/lib/constants/hobbies";
import HobbySearchInput from "./HobbySearchInput";
import { createChoseongRegex } from "@/lib/utils/hangul";

const ALL_HOBBIES = Object.values(HOBBIES).flat();

const ScreenHobbySelect = () => {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [selected, setSelected] = useState<string[]>(profile.hobbies || []);
  const [searchKeyword, setSearchKeyword] = useState("");

  const toggleHobby = (hobby: string) => {
    // alert 중복 방지: selected.length 기준으로 체크
    const isAlreadySelected = selected.includes(hobby);
    if (!isAlreadySelected && selected.length >= 10) {
      console.log("ALERT: 10개 초과 시도", selected);
      alert("최대 10개까지 선택할 수 있어요.");
      return;
    }
    setSelected((prev) => {
      const isAlreadySelectedInner = prev.includes(hobby);
      if (isAlreadySelectedInner) {
        // 선택 해제는 무조건 허용
        return prev.filter((h) => h !== hobby);
      }
      return [...prev, hobby];
    });
  };

  const handleComplete = () => {
    // Context 업데이트
    updateProfile({
      ...profile,
      hobbies: selected,
    });

    // 다음 페이지로 이동 (회원가입/추가 정보 입력 등)
    router.push("/extra-info");
  };

  const filteredHobbies = useMemo(() => {
    if (!searchKeyword.trim()) return null; // No search term

    // Normalize and create regex for chosung matching
    const searchRegex = createChoseongRegex(searchKeyword.trim());
    return ALL_HOBBIES.filter((hobby) => searchRegex.test(hobby));
  }, [searchKeyword]);

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
                  const isSelected = selected.includes(hobby);
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
          (Object.keys(HOBBIES) as HobbyCategory[]).map((category) => (
            <div key={category} className="flex flex-col">
              <h2 className="typo-16-600 mb-3 text-black">{category}</h2>
              <div className="flex flex-wrap gap-3">
                {HOBBIES[category].map((hobby) => {
                  const isSelected = selected.includes(hobby);
                  return (
                    <HobbyButton
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      selected={isSelected}
                    >
                      {hobby}
                    </HobbyButton>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="typo-14-600 mt-8 flex flex-col items-start gap-3">
        <h2>내가 좋아하는 관심사가 없나요?</h2>
        <HobbyButton plus>내 관심사 추가하기</HobbyButton>
      </div>

      <Button
        type="button"
        fixed
        bottom={24}
        sideGap={16}
        safeArea
        disabled={selected.length < 3}
        onClick={handleComplete}
        className="bg-button-primary text-button-primary-text-default"
      >
        다음으로
      </Button>
    </main>
  );
};

export default ScreenHobbySelect;
