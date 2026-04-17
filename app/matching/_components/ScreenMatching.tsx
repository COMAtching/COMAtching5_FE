"use client";

import MyCoinSection from "@/components/common/MyCoinSection";
import { BackButton } from "@/components/ui/BackButton";
import Image from "next/image";
import React, { useState } from "react";
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
  예술: "MUSIC",
  여행: "TRAVEL",
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

const ScreenMatching = () => {
  const { data: itemData } = useItems();
  const { mutate: match, isPending } = useMatching();
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isSameMajorExclude, setIsSameMajorExclude] = useState(false);
  const [selectedHobbyCategory, setSelectedHobbyCategory] = useState<
    MatchingInterestCategory | ""
  >("");
  const [importantOption, setImportantOption] =
    useState<ImportantOption | null>(null);

  const matchingTicketCount = itemData?.data.matchingTicketCount ?? 0;
  const hasExtraOption = !!(importantOption || isSameMajorExclude);

  const canSubmit = !!(
    selectedMBTI.length === 2 &&
    selectedAgeGroup &&
    selectedFrequency &&
    selectedHobbyCategory &&
    matchingTicketCount > 0
  );

  const bubbleText =
    matchingTicketCount === 0 ? (
      "사용할 수 있는 매칭권이 없어요."
    ) : (
      <div className="flex items-center gap-1">
        <Image src="/main/coin.png" alt="coin" width={20} height={20} />
        <span>매칭권 1</span>
        {hasExtraOption && (
          <>
            <Image
              src="/main/elec-bulb.png"
              alt="bulb"
              width={20}
              height={20}
              className="ml-1"
            />
            <span>아이템 1</span>
          </>
        )}
        <span>소모</span>
      </div>
    );

  const bubbleTextColor =
    matchingTicketCount === 0 ? "text-color-gray-600" : "text-black";

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

    const payload: MatchingRequest = {
      ageOption: ageInfo.option,
      mbtiOption: selectedMBTI || undefined,
      hobbyOption: selectedHobbyCategory
        ? hobbyMapping[selectedHobbyCategory]
        : undefined,
      contactFrequency: selectedFrequency
        ? frequencyMapping[selectedFrequency]
        : undefined,
      sameMajorOption: isSameMajorExclude,
      importantOption: importantOption || undefined,
      minAgeOffset: ageInfo.min,
      maxAgeOffset: ageInfo.max,
    };

    match(payload);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-30">
      <BackButton text="매칭하기" />
      <MyCoinSection className="my-6" />

      <div className="flex w-full flex-col gap-4">
        <MatchingMBTISection
          onMBTISelect={setSelectedMBTI}
          defaultValue={selectedMBTI}
        />

        <MatchingHobbySection
          onSelect={(category) => setSelectedHobbyCategory(category)}
          selectedCategory={selectedHobbyCategory}
        />

        <MatchingAgeSection
          onAgeGroupSelect={setSelectedAgeGroup}
          defaultValue={selectedAgeGroup}
        />

        <MatchingFrequencySection
          onFrequencySelect={setSelectedFrequency}
          defaultValue={selectedFrequency}
        />

        <MatchingImportantOptionSection
          onSelect={(option) => setImportantOption(option)}
          selectedOption={importantOption}
          selections={{
            MBTI: selectedMBTI || "",
            AGE: selectedAgeGroup || "",
            HOBBY: selectedHobbyCategory || "",
            CONTACT: selectedFrequency || "",
          }}
        />
        <MatchingSameMajorSection
          onSameMajorToggle={setIsSameMajorExclude}
          isExcluded={isSameMajorExclude}
        />
      </div>

      <MatchingSliderButton
        onConfirm={handleMatchingSubmit}
        isActive={canSubmit && !isPending}
        isLoading={isPending}
        bubbleText={bubbleText}
        bubbleTextColor={bubbleTextColor}
      />
    </main>
  );
};

export default ScreenMatching;
