"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { useProfile } from "@/providers/profile-provider";
import ProgressStepBar from "@/components/ui/ProgressStepBar";
import Blur from "@/components/common/Blur";

import { HOBBIES, type HobbyCategory } from "@/lib/constants/hobbies";

const ScreenHobbySelect = () => {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [selected, setSelected] = useState<string[]>(profile.hobbies || []);

  const toggleHobby = (hobby: string) => {
    setSelected((prev) => {
      const isAlreadySelected = prev.includes(hobby);

      if (!isAlreadySelected && prev.length >= 10) {
        alert("최대 10개까지 선택할 수 있어요.");
        return prev;
      }

      return isAlreadySelected
        ? prev.filter((h) => h !== hobby)
        : [...prev, hobby];
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

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden px-4 pb-[120px]">
      <Blur />

      <div className="flex flex-col gap-2 pt-3">
        <BackButton />
        <ProgressStepBar currentStep={2} totalSteps={3} />
      </div>

      <div className="my-8 flex flex-col gap-2 text-center">
        <h1 className="typo-20-700 text-[#373737]">관심사를 알려주세요.</h1>
        <p className="typo-14-500 leading-[1.6] text-[#858585]">
          요즘 관심있는 것들을 3개 이상 선택해주세요.
          <br />
          최대 10개까지 선택할 수 있어요.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {(Object.keys(HOBBIES) as HobbyCategory[]).map((category) => (
          <div key={category} className="flex flex-col">
            <h2 className="typo-16-600 mb-3 text-black">{category}</h2>
            <div className="flex flex-wrap gap-3">
              {HOBBIES[category].map((hobby) => {
                const isSelected = selected.includes(hobby);
                return (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => toggleHobby(hobby)}
                    className={`typo-14-500 rounded-full border px-3 py-[7.5px] whitespace-nowrap transition-all duration-200 ease-in-out ${
                      isSelected
                        ? "border-[#FF4D61] bg-[#FFEBED] text-black"
                        : "border-[#DFDFDF] bg-[#B3B3B3]/15 text-black"
                    }`}
                  >
                    {hobby}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
