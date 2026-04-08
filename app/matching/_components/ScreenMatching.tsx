"use client";

import MyCoinSection from "@/components/common/MyCoinSection";
import { BackButton } from "@/components/ui/BackButton";
import React, { useState } from "react";
import MatchingAgeSection from "./MatchingAgeSection";
import MatchingHobbySection from "./MatchingHobbySection";
import MatchingMBTISection from "./MatchingMBTISection";
import MatchingFrequencySection from "./MatchingFrequencySection";
import MatchingImportantOptionSection from "./MatchingImportantOptionSection";

const ScreenMatching = () => {
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isSameMajorExclude, setIsSameMajorExclude] = useState(false);

  return (
    <main className="flex flex-col items-center px-4 py-2">
      <BackButton text="매칭하기" />
      <MyCoinSection className="my-6" />

      <div className="flex w-full flex-col gap-4 pb-10">
        <MatchingMBTISection
          onMBTISelect={setSelectedMBTI}
          defaultValue={selectedMBTI}
        />

        <MatchingHobbySection />
        <MatchingAgeSection
          onAgeGroupSelect={setSelectedAgeGroup}
          defaultValue={selectedAgeGroup}
        />

        <MatchingFrequencySection
          onFrequencySelect={setSelectedFrequency}
          defaultValue={selectedFrequency}
        />

        <MatchingImportantOptionSection
          onSameMajorToggle={setIsSameMajorExclude}
          isExcluded={isSameMajorExclude}
        />
      </div>
    </main>
  );
};

export default ScreenMatching;
