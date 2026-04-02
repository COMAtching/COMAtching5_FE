"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useProfile } from "@/stores/profile-store";
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

const mapProfileToInitialValues = (profile: Partial<ProfileData>) => ({
  birthYear: profile.birthDate ? profile.birthDate.split("-")[0] : "",
  university: profile.university || "",
  department: profile.department || "",
  major: profile.major || "",
  gender:
    Object.keys(genderMap).find((k) => genderMap[k] === profile.gender) || "",
  mbti: profile.mbti || "",
  frequency:
    Object.keys(contactFrequencyMap).find(
      (k) => contactFrequencyMap[k] === profile.contactFrequency,
    ) || "",
});

export const ScreenProfileBuilder = () => {
  const router = useRouter();
  const { profile, updateProfile, isReady } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBirthYear, setSelectedBirthYear] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isReady || hasInitialized.current) return;

    const initialValues = mapProfileToInitialValues(profile);
    const timeoutId = setTimeout(() => {
      if (initialValues.birthYear)
        setSelectedBirthYear(initialValues.birthYear);
      if (initialValues.university)
        setSelectedUniversity(initialValues.university);
      if (initialValues.department)
        setSelectedDepartment(initialValues.department);
      if (initialValues.major) setSelectedMajor(initialValues.major);
      if (initialValues.gender) {
        setSelectedGender(initialValues.gender);
      }
      if (initialValues.mbti) {
        setSelectedMBTI(initialValues.mbti);
      }
      if (initialValues.frequency) {
        setSelectedFrequency(initialValues.frequency);
      }

      // 모든 정보가 이미 있다면 Step 4까지 모두 펼쳐줌
      if (
        initialValues.birthYear &&
        initialValues.university &&
        initialValues.department &&
        initialValues.major &&
        initialValues.gender &&
        initialValues.mbti &&
        initialValues.frequency
      ) {
        setCurrentStep(4);
      }

      hasInitialized.current = true;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isReady, profile]);

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

    const profileData: Partial<ProfileData> = {
      birthDate: selectedBirthYear ? `${selectedBirthYear}-01-01` : undefined,
      university: selectedUniversity,
      department: selectedDepartment,
      major: selectedMajor,
      gender: genderMap[selectedGender],
      mbti: isValidMBTI(normalizedMBTI) ? normalizedMBTI : undefined,
      contactFrequency: contactFrequencyMap[selectedFrequency],
    };

    updateProfile(profileData);
    router.push("/hobby-select");
  };

  const handleGenderSelect = (value: string) => {
    setSelectedGender(value);
  };

  const handleMBTISelect = (value: string) => {
    setSelectedMBTI(value);
  };

  const handleFrequencySelect = (value: string) => {
    setSelectedFrequency(value);
  };

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
        return !!selectedGender;
      case 3:
        return isValidMBTI(selectedMBTI);
      case 4:
        return !!selectedFrequency;
      default:
        return false;
    }
  })();

  return (
    <div className="relative flex min-h-screen flex-col px-4 pb-32">
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

      <div className="flex flex-col gap-6">
        {currentStep >= 4 && (
          <Step4ContactFrequency
            onFrequencySelect={handleFrequencySelect}
            defaultValue={selectedFrequency}
          />
        )}

        {currentStep >= 3 && (
          <Step3MBTI
            onMBTISelect={handleMBTISelect}
            defaultValue={selectedMBTI}
          />
        )}

        {currentStep >= 2 && (
          <Step2Gender
            onGenderSelect={handleGenderSelect}
            defaultValue={selectedGender}
          />
        )}

        <Step1Basic
          yearOptions={yearOptions}
          universityOptions={universityOptions}
          departmentOptions={departmentOptions}
          majorOptions={majorOptions}
          selectedBirthYear={selectedBirthYear}
          selectedUniversity={selectedUniversity}
          selectedDepartment={selectedDepartment}
          selectedMajor={selectedMajor}
          onBirthYearChange={(value) => {
            setSelectedBirthYear(value);
          }}
          onUniversityChange={(value) => {
            setSelectedUniversity(value);
          }}
          onDepartmentChange={(value) => {
            setSelectedDepartment(value);
            setSelectedMajor("");
          }}
          onMajorChange={(value) => {
            setSelectedMajor(value);
          }}
        />
      </div>

      <Button
        type="button"
        fixed
        bottom={24}
        sideGap={16}
        safeArea
        disabled={!isStepValid}
        onClick={currentStep === 4 ? handleComplete : handleNext}
      >
        {currentStep === 4 ? "완료" : "다음으로"}
      </Button>
    </div>
  );
};

export default ScreenProfileBuilder;
