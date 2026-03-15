"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useProfile } from "@/providers/profile-provider";
import { majorCategories, universities } from "@/lib/constants/majors";
import {
  getDepartmentOptions,
  getMajorOptions,
  getUniversityOptions,
  getYearOptions,
} from "../_lib/options";
import { getStepTitle } from "../_lib/step";
import ProgressStepBar from "@/components/ui/ProgressStepBar";
import Step1Basic from "./Step1Basic";
import Step2Gender from "./Step2Gender";
import Step3MBTI from "./Step3MBTI";
import Step4ContactFrequency from "./Step4ContactFrequency";
import {
  ContactFrequency,
  Gender,
  MBTI,
  ProfileData,
} from "@/lib/types/profile";

const genderMap: Record<string, Gender> = {
  남자: "MALE",
  여자: "FEMALE",
};

const contactFrequencyMap: Record<string, ContactFrequency> = {
  자주: "FREQUENT",
  보통: "NORMAL",
  적음: "RARE",
};

const mbtiSet = new Set<MBTI>([
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
]);

const isValidMBTI = (mbti?: string): mbti is MBTI =>
  mbtiSet.has((mbti || "").toUpperCase() as MBTI);

export const ScreenProfileBuilder = () => {
  const router = useRouter();
  const { profile, updateProfile, isReady } = useProfile();

  // Derive initial values from profile or localStorage synchronously
  const getInitialValues = () => {
    if (profile) {
      return {
        birthYear: profile.birthDate ? profile.birthDate.split("-")[0] : "",
        university: profile.university || "",
        department: profile.department || "",
        major: profile.major || "",
        gender:
          Object.keys(genderMap).find(
            (key) => genderMap[key] === profile.gender,
          ) || "",
        mbti: profile.mbti || "",
        frequency:
          Object.keys(contactFrequencyMap).find(
            (key) => contactFrequencyMap[key] === profile.contactFrequency,
          ) || "",
      };
    }
    try {
      const saved = localStorage.getItem("profileBuilder");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  };

  const initialValues = getInitialValues();
  const allFilled = Boolean(
    initialValues.birthYear &&
    initialValues.university &&
    initialValues.department &&
    initialValues.major &&
    initialValues.gender &&
    isValidMBTI(initialValues.mbti) &&
    initialValues.frequency,
  );

  const [currentStep, setCurrentStep] = useState(allFilled ? 4 : 1);
  const [selectedBirthYear, setSelectedBirthYear] = useState<string>(
    initialValues.birthYear || "",
  );
  const [selectedUniversity, setSelectedUniversity] = useState<string>(
    initialValues.university || "",
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    initialValues.department || "",
  );
  const [selectedMajor, setSelectedMajor] = useState<string>(
    initialValues.major || "",
  );
  const [selectedGender, setSelectedGender] = useState<string>(
    initialValues.gender || "",
  );
  const [selectedMBTI, setSelectedMBTI] = useState<string>(
    initialValues.mbti || "",
  );
  const [selectedFrequency, setSelectedFrequency] = useState<string>(
    initialValues.frequency || "",
  );
  const [hasSelectedGender, setHasSelectedGender] = useState(false);
  const [hasSelectedMBTI, setHasSelectedMBTI] = useState(false);
  const [hasSelectedFrequency, setHasSelectedFrequency] = useState(false);

  // isReady ref — kept to avoid re-running on profile change during session
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!isReady || initializedRef.current) return;
    initializedRef.current = true;
    // Values are already set via lazy init above; nothing extra needed here
  }, [isReady]);

  const yearOptions = getYearOptions();
  const universityOptions = getUniversityOptions(universities);
  const departmentOptions = getDepartmentOptions(
    selectedUniversity,
    majorCategories,
  );
  const majorOptions = getMajorOptions(
    selectedUniversity,
    selectedDepartment,
    majorCategories,
  );

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    const normalizedMBTI = selectedMBTI.toUpperCase();

    // Context 업데이트용 데이터 변환
    const profileData: Partial<ProfileData> = {
      birthDate: selectedBirthYear ? `${selectedBirthYear}-01-01` : undefined,
      university: selectedUniversity,
      department: selectedDepartment,
      major: selectedMajor,
      gender: genderMap[selectedGender],
      mbti: isValidMBTI(normalizedMBTI) ? normalizedMBTI : undefined,
      contactFrequency: contactFrequencyMap[selectedFrequency],
    };

    // Context 업데이트
    updateProfile(profileData);

    // 다음 페이지로 이동
    router.push("/hobby-select");
  };

  const handleGenderSelect = (value: string) => {
    setSelectedGender(value);
    setHasSelectedGender(true);
  };

  const handleMBTISelect = (value: string) => {
    setSelectedMBTI(value);
    setHasSelectedMBTI(true);
  };

  const handleFrequencySelect = (value: string) => {
    setSelectedFrequency(value);
    setHasSelectedFrequency(true);
  };

  // 단계별 유효성 검사
  const isStepValid = (() => {
    switch (currentStep) {
      case 1:
        return !!(
          selectedBirthYear &&
          selectedUniversity &&
          selectedDepartment &&
          selectedMajor
        );
      case 2:
        return !!selectedGender && hasSelectedGender;
      case 3:
        return isValidMBTI(selectedMBTI) && hasSelectedMBTI;
      case 4:
        return !!selectedFrequency && hasSelectedFrequency;
      default:
        return false;
    }
  })();

  return (
    <div className="relative flex min-h-screen flex-col px-4 pb-32">
      {/* 헤더 영역 */}
      <ProgressStepBar currentStep={1} totalSteps={3} />
      <div className="mt-8 mb-10 text-center">
        <h1 className="typo-24-700 text-color-gray-900 mb-2">
          {getStepTitle(currentStep)}
        </h1>
        <p className="typo-14-400 text-color-text-caption2">
          정보를 정확하게 입력했는지 확인해 주세요.
          <br />
          별로 오래 걸리지 않아요!
        </p>
      </div>

      {/* 폼 영역 */}
      <div className="flex flex-col gap-6">
        {/* Step 4: Contact Frequency */}
        {currentStep >= 4 && (
          <Step4ContactFrequency
            onFrequencySelect={handleFrequencySelect}
            defaultValue={selectedFrequency}
          />
        )}

        {/* Step 3: MBTI */}
        {currentStep >= 3 && (
          <Step3MBTI
            onMBTISelect={handleMBTISelect}
            defaultValue={selectedMBTI}
          />
        )}

        {/* Step 2: Gender */}
        {currentStep >= 2 && (
          <Step2Gender
            onGenderSelect={handleGenderSelect}
            defaultValue={selectedGender}
          />
        )}

        {/* Step 1: Basic */}
        <Step1Basic
          yearOptions={yearOptions}
          universityOptions={universityOptions}
          departmentOptions={departmentOptions}
          majorOptions={majorOptions}
          selectedBirthYear={selectedBirthYear}
          selectedUniversity={selectedUniversity}
          selectedDepartment={selectedDepartment}
          selectedMajor={selectedMajor}
          onBirthYearChange={setSelectedBirthYear}
          onUniversityChange={setSelectedUniversity}
          onDepartmentChange={(value) => {
            setSelectedDepartment(value);
            setSelectedMajor("");
          }}
          onMajorChange={setSelectedMajor}
        />
      </div>

      {/* 하단 고정 버튼 */}
      <Button
        type="button"
        fixed
        bottom={24}
        sideGap={16}
        safeArea
        disabled={!isStepValid}
        onClick={currentStep === 4 ? handleComplete : handleNext}
        className="bg-button-primary text-button-primary-text-default"
      >
        {currentStep === 4 ? "완료" : "다음으로"}
      </Button>
    </div>
  );
};
