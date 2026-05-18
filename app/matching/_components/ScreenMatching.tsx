"use client";

import MyCoinSection from "@/components/common/MyCoinSection";
import { BackButton } from "@/components/ui/BackButton";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MatchingAgeOption from "./MatchingAgeOption";
import MatchingAgeSection from "./MatchingAgeSection";
import MatchingHobbySection from "./MatchingHobbySection";
import MatchingMBTISection from "./MatchingMBTISection";
import MatchingFrequencySection from "./MatchingFrequencySection";
import MatchingImportantOptionSection from "./MatchingImportantOptionSection";
import MatchingSameMajorSection from "./MatchingSameMajorSection";
import { ContactFrequency } from "@/lib/types/profile";
import MatchingSliderButton from "./MatchingSliderButton";

import {
  AgeOption,
  HobbyOption,
  ImportantOption,
  MatchingRequest,
} from "@/lib/types/matching";

import { MatchingInterestCategory } from "@/lib/constants/matchingInterests";

const hobbyMapping: Record<MatchingInterestCategory, HobbyOption> = {
  스포츠: "SPORTS",
  문화: "CULTURE",
  음악: "MUSIC",
  여행: "LEISURE",
  자기계발: "DAILY",
  게임: "GAME",
};

const frequencyMapping: Record<string, ContactFrequency> = {
  자주: "FREQUENT",
  보통: "NORMAL",
  적음: "RARE",
};

import { useItems } from "@/hooks/useItems";
import { useMatching } from "@/hooks/useMatching";
import { useMyProfile } from "@/hooks/useProfile";

const ScreenMatching = () => {
  const router = useRouter();
  const { data: itemData, isLoading: isItemsLoading } = useItems();
  const { data: myProfile } = useMyProfile();
  const { mutate: match, isPending } = useMatching();
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isSameMajorExclude, setIsSameMajorExclude] = useState(false);
  const [selectedHobbyCategory, setSelectedHobbyCategory] = useState<
    MatchingInterestCategory | ""
  >("");
  const [importantOption, setImportantOption] =
    useState<ImportantOption | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // 현재 사용자 나이 계산 (한국식 나이: 현재연도 - 태어난연도 + 1)
  const userAge = React.useMemo(() => {
    if (!myProfile?.data.birthDate) return 0;
    try {
      const birthYear = new Date(myProfile.data.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear + 1;
    } catch {
      return 0;
    }
  }, [myProfile]);

  const matchingTicketCount = itemData?.data.matchingTicketCount ?? 0;
  const isAgeRangeActive = minAge !== undefined && maxAge !== undefined;
  const extraOptionCount =
    (importantOption ? 1 : 0) +
    (isSameMajorExclude ? 1 : 0) +
    (isAgeRangeActive ? 1 : 0);

  const optionTicketCountOwned = itemData?.data.optionTicketCount ?? 0;

  const canSubmit = !!(
    selectedMBTI.length === 2 &&
    (selectedAgeGroup || isAgeRangeActive) &&
    selectedFrequency &&
    selectedHobbyCategory &&
    matchingTicketCount > 0 &&
    optionTicketCountOwned >= extraOptionCount
  );

  const bubbleText = isItemsLoading ? null : matchingTicketCount === 0 ? (
    "사용할 수 있는 매칭권이 없어요."
  ) : extraOptionCount === 0 ? (
    <Image
      src="/bubble/bubble.png"
      alt="매칭권 1 소모"
      width={226}
      height={42}
      className="pointer-events-none drop-shadow-md"
    />
  ) : (
    <div className="flex items-center gap-1">
      <Image src="/main/ticket.png" alt="coin" width={20} height={20} />
      <span>매칭권 1</span>
      {extraOptionCount > 0 && (
        <>
          <Image
            src="/main/option.png"
            alt="bulb"
            width={20}
            height={20}
            className="ml-1"
          />
          <span>옵션권 {extraOptionCount}</span>
        </>
      )}
      <span>소모</span>
    </div>
  );

  const bubbleTextColor =
    matchingTicketCount === 0 ? "text-color-gray-600" : "text-black";

  const handleAgeGroupSelect = (group: string) => {
    setSelectedAgeGroup(group);
    // 나이 그룹 선택 시 나이 구간(슬라이더) 설정 초기화
    setMinAge(undefined);
    setMaxAge(undefined);
  };

  const handleAgeRangeSelect = (min: number, max: number) => {
    // 나이 구간 설정 시 나이 그룹(연하/동갑/연상) 초기화
    setSelectedAgeGroup("");
    setMinAge(min);
    setMaxAge(max);
  };

  const calculateAgeOffsets = (
    group: string,
  ): {
    min: number | null;
    max: number | null;
    option: AgeOption | undefined;
  } => {
    switch (group) {
      case "연하":
        return { min: -5, max: -1, option: "YOUNGER" };
      case "동갑":
        return { min: 0, max: 0, option: "EQUAL" };
      case "연상":
        return { min: 1, max: 5, option: "OLDER" };
      default:
        return { min: null, max: null, option: undefined };
    }
  };

  const handleMatchingSubmit = () => {
    if (!canSubmit) {
      alert("모든 조건을 선택해 주세요!");
      return;
    }

    const ageInfo = calculateAgeOffsets(selectedAgeGroup);

    // 실제 서버로 보낼 절대 나이 계산
    let finalMinAge: number | null = null;
    let finalMaxAge: number | null = null;

    if (isAgeRangeActive) {
      finalMinAge = minAge ?? null;
      finalMaxAge = maxAge ?? null;
    } else {
      // 연상/연하/동갑 선택 시에는 직접 지정하는 나이 구간(min/max)을 null로 전달하여
      // 백엔드가 ageOption("OLDER"/"YOUNGER"/"EQUAL")만 보고 올바르게 연산하도록 유도합니다.
      finalMinAge = null;
      finalMaxAge = null;
    }

    const payload: MatchingRequest = {
      ageOption: isAgeRangeActive ? null : ageInfo.option || null,
      minAgeOffset: finalMinAge,
      maxAgeOffset: finalMaxAge,
      mbtiOption: selectedMBTI || undefined,
      hobbyOption: selectedHobbyCategory
        ? hobbyMapping[selectedHobbyCategory]
        : undefined,
      contactFrequency: selectedFrequency
        ? frequencyMapping[selectedFrequency]
        : undefined,
      sameMajorOption: isSameMajorExclude,
      importantOption: importantOption || undefined,
    };

    match(payload, {
      onError: () => {
        setResetKey((prev) => prev + 1);
      },
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-30">
      <BackButton text="매칭하기" onClick={() => router.push("/main")} />
      <MyCoinSection className="my-6" />

      <div className="flex w-full flex-col gap-4">
        <MatchingMBTISection
          onMBTISelect={setSelectedMBTI}
          selected={selectedMBTI}
        />

        <MatchingHobbySection
          onSelect={(category) => setSelectedHobbyCategory(category)}
          selectedCategory={selectedHobbyCategory}
        />

        <MatchingAgeSection
          onAgeGroupSelect={handleAgeGroupSelect}
          selected={isAgeRangeActive ? "" : selectedAgeGroup}
        />

        <MatchingFrequencySection
          onFrequencySelect={setSelectedFrequency}
          selected={selectedFrequency}
        />

        <MatchingImportantOptionSection
          onSelect={(option) => setImportantOption(option)}
          selectedOption={importantOption}
          selections={{
            MBTI: selectedMBTI || "",
            HOBBY: selectedHobbyCategory || "",
            CONTACT: selectedFrequency || "",
          }}
        />
        <MatchingAgeOption
          onAgeRangeSelect={handleAgeRangeSelect}
          onReset={() => {
            setMinAge(undefined);
            setMaxAge(undefined);
          }}
          minAge={minAge}
          maxAge={maxAge}
        />
        <MatchingSameMajorSection
          onSameMajorToggle={setIsSameMajorExclude}
          isExcluded={isSameMajorExclude}
        />
      </div>

      <MatchingSliderButton
        key={resetKey}
        onConfirm={handleMatchingSubmit}
        isActive={canSubmit && !isPending}
        isLoading={isPending}
        bubbleText={bubbleText}
        bubbleTextColor={bubbleTextColor}
        renderRawBubble={extraOptionCount === 0 && matchingTicketCount > 0}
      />
    </main>
  );
};

export default ScreenMatching;
