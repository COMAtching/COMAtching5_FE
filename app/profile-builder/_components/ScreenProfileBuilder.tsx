"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useProfile } from "@/providers/profile-provider";
import {
  profileBuilderAction,
  type ProfileBuilderState,
} from "@/lib/actions/profileBuilderAction";
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

const initialState: ProfileBuilderState = {
  success: false,
  message: "",
};

export const ScreenProfileBuilder = () => {
  const router = useRouter();
  const { profile, updateProfile, isReady } = useProfile();
  const [state, formAction, isPending] = useActionState(
    profileBuilderAction,
    initialState,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState<string>(
    profile.university || "가톨릭대학교",
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedMBTI, setSelectedMBTI] = useState<string>("");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");

  // 성공 시 Context 업데이트 및 다음 페이지로 이동
  useEffect(() => {
    if (state.success && state.data) {
      updateProfile(state.data);
      // TODO: 다음 온보딩 페이지로 이동
      router.push("/hobby-select");
      console.log("Profile updated:", state.data);
    }
  }, [state.success, state.data, updateProfile]);

  // localStorage 로딩 전에는 스켈레톤 UI 표시
  // (스켈레톤 제거됨)

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

  return (
    <form
      action={currentStep === 4 ? formAction : undefined}
      onSubmit={(e) => {
        if (currentStep < 4) {
          e.preventDefault();
          handleNext();
        }
      }}
      className="relative flex min-h-screen flex-col bg-white px-4 pb-32"
    >
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
        {/* Step 4: currentStep >= 4일 때 표시 */}
        {currentStep >= 4 && (
          <Step4ContactFrequency
            onFrequencySelect={setSelectedFrequency}
            defaultValue={selectedFrequency}
          />
        )}

        {/* Step 3: currentStep >= 3일 때 표시 */}
        {currentStep >= 3 && (
          <Step3MBTI
            onMBTISelect={setSelectedMBTI}
            defaultValue={selectedMBTI}
          />
        )}

        {/* Step 2: currentStep >= 2일 때 표시 */}
        {currentStep >= 2 && (
          <Step2Gender
            onGenderSelect={setSelectedGender}
            defaultValue={selectedGender}
          />
        )}

        {/* Step 1: 항상 표시 */}
        <Step1Basic
          yearOptions={yearOptions}
          universityOptions={universityOptions}
          departmentOptions={departmentOptions}
          majorOptions={majorOptions}
          selectedUniversity={selectedUniversity}
          selectedDepartment={selectedDepartment}
          selectedMajor={selectedMajor}
          onUniversityChange={setSelectedUniversity}
          onDepartmentChange={(value) => {
            setSelectedDepartment(value);
            setSelectedMajor("");
          }}
          onMajorChange={setSelectedMajor}
          errors={state.errors}
        />
      </div>

      {/* 하단 고정 버튼 */}
      <Button
        type={currentStep === 4 ? "submit" : "button"}
        fixed
        bottom={24}
        sideGap={16}
        safeArea
        disabled={isPending}
        onClick={currentStep < 4 ? handleNext : undefined}
        className="bg-button-primary text-button-primary-text-default"
      >
        {isPending ? "처리 중..." : currentStep === 4 ? "완료" : "다음으로"}
      </Button>
    </form>
  );
};
