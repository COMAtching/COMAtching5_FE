"use client";

import MyCoinSection from "@/components/common/MyCoinSection";
import { BackButton } from "@/components/ui/BackButton";
import React, { useState } from "react";
import MatchingAgeSection from "./MatchingAgeSection";
import MatchingHobbySection from "./MatchingHobbySection";
import MatchingMBTISection from "./MatchingMBTISection";
import MatchingFrequencySection from "./MatchingFrequencySection";
import MatchingImportantOptionSection from "./MatchingImportantOptionSection";
import MatchingSameMajorSection from "./MatchingSameMajorSection";
import { ContactFrequency } from "@/lib/types/profile";
import {
  AgeOption,
  HobbyOption,
  ImportantOption,
  MatchingRequest,
} from "@/lib/types/matching";

import MatchingHobbyBottomSheet from "./MatchingHobbyBottomSheet";
import ImportantBottomSheet from "./ImportantBottomSheet";
import { HobbyCategory } from "@/lib/constants/hobbies";

const hobbyMapping: Record<string, HobbyOption> = {
  스포츠: "SPORTS",
  문화예술: "CULTURE",
  음악: "MUSIC",
  여행: "TRAVEL",
  "일상/공부": "DAILY",
  게임: "GAME",
};

const frequencyMapping: Record<string, ContactFrequency> = {
  자주: "FREQUENT",
  보통: "NORMAL",
  적음: "RARE",
};

import MatchingSliderButton from "./MatchingSliderButton";

const ScreenMatching = () => {
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isSameMajorExclude, setIsSameMajorExclude] = useState(false);
  const [selectedHobbyCategory, setSelectedHobbyCategory] =
    useState<string>("");
  const [importantOption, setImportantOption] =
    useState<ImportantOption | null>(null);

  const [isHobbyDrawerOpen, setIsHobbyDrawerOpen] = useState(false);
  const [isImportantDrawerOpen, setIsImportantDrawerOpen] = useState(false);

  const canSubmit = !!(
    selectedMBTI.length === 2 &&
    selectedAgeGroup &&
    selectedFrequency &&
    selectedHobbyCategory
  );

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

    console.log("Matching Payload:", payload);
    alert("매칭을 시작합니다!");
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-48">
      <BackButton text="매칭하기" />
      <MyCoinSection className="my-6" />

      <div className="flex w-full flex-col gap-4">
        <MatchingMBTISection
          onMBTISelect={setSelectedMBTI}
          defaultValue={selectedMBTI}
        />

        <MatchingHobbySection
          onHobbyClick={() => setIsHobbyDrawerOpen(true)}
          selectedHobbies={selectedHobbyCategory ? [selectedHobbyCategory] : []}
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
          onClick={() => setIsImportantDrawerOpen(true)}
        />
        <MatchingSameMajorSection
          onSameMajorToggle={setIsSameMajorExclude}
          isExcluded={isSameMajorExclude}
        />
      </div>

      <MatchingSliderButton
        onConfirm={handleMatchingSubmit}
        isActive={canSubmit}
      />

      <MatchingHobbyBottomSheet
        isOpen={isHobbyDrawerOpen}
        onClose={() => setIsHobbyDrawerOpen(false)}
        selectedCategory={selectedHobbyCategory}
        onSelect={(category) => setSelectedHobbyCategory(category)}
      />

      <ImportantBottomSheet
        isOpen={isImportantDrawerOpen}
        onClose={() => setIsImportantDrawerOpen(false)}
        selectedOption={importantOption}
        onSelect={(option) => setImportantOption(option)}
      />
    </main>
  );
};

export default ScreenMatching;
