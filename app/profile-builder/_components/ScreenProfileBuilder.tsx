"use client";

import React, { useActionState, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useProfile } from "@/providers/profile-provider";
import {
  profileBuilderAction,
  type ProfileBuilderState,
} from "@/lib/actions/profileBuilderAction";
import { majorCategories, universities } from "@/lib/constants/majors";
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
      // router.push("/next-step");
      console.log("Profile updated:", state.data);
    }
  }, [state.success, state.data, updateProfile]);

  // localStorage 로딩 전에는 스켈레톤 UI 표시
  if (!isReady) {
    return (
      <div className="relative flex min-h-screen animate-pulse flex-col bg-white px-4 pb-32">
        {/* 헤더 스켈레톤 */}
        <div className="mt-16 mb-8">
          <div className="mb-2 h-8 w-48 rounded bg-gray-200" />
          <div className="mb-1 h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>

        {/* 폼 스켈레톤 */}
        <div className="flex flex-col gap-6">
          {/* 나이 */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-12 rounded bg-gray-200" />
            <div className="h-12 w-full rounded bg-gray-200" />
          </div>

          {/* 학교 */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-12 rounded bg-gray-200" />
            <div className="h-12 w-full rounded bg-gray-200" />
          </div>

          {/* 학과 / 전공 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-12 rounded bg-gray-200" />
              <div className="h-12 w-full rounded bg-gray-200" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-5 w-12 rounded bg-gray-200" />
              <div className="h-12 w-full rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* 버튼 스켈레톤 */}
        <div className="fixed right-4 bottom-6 left-4 h-12 rounded-[16px] bg-gray-200" />
      </div>
    );
  }

  // 연도 옵션 생성 (1997 ~ 2020) - 1997년생부터 가입 가능
  const yearOptions = Array.from({ length: 24 }, (_, i) => ({
    value: String(1997 + i),
    label: `${1997 + i}년`,
  }));

  // 대학 옵션
  const universityOptions = universities.map((uni) => ({
    value: uni,
    label: uni,
  }));

  // 선택된 학교에 따른 계열(학과) 옵션
  const getDepartmentOptions = () => {
    const university = majorCategories.find(
      (cat) => cat.label === selectedUniversity,
    );

    if (!university) return [];

    return university.departments.map((dept) => ({
      value: dept.label,
      label: dept.label,
    }));
  };

  // 선택된 계열에 따른 전공 옵션
  const getMajorOptions = () => {
    const university = majorCategories.find(
      (cat) => cat.label === selectedUniversity,
    );

    if (!university) return [];

    const department = university.departments.find(
      (dept) => dept.label === selectedDepartment,
    );

    if (!department) return [];

    return department.majors.map((major) => ({
      value: major,
      label: major,
    }));
  };

  const departmentOptions = getDepartmentOptions();
  const majorOptions = getMajorOptions();

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "전공이 어떻게 되세요?";
      case 2:
        return "성별을 알려주세요";
      case 3:
        return "본인의 MBTI를 알려 주세요";
      case 4:
        return "연락빈도를 알려 주세요";
      default:
        return " ";
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
          {getStepTitle()}
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
