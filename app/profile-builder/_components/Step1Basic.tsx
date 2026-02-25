"use client";

import React from "react";
import FormSelect from "@/components/ui/FormSelect";
import { SelectOption } from "@/components/ui/FormSelect";

interface Step1BasicProps {
  yearOptions: SelectOption[];
  universityOptions: SelectOption[];
  departmentOptions: SelectOption[];
  majorOptions: SelectOption[];
  selectedUniversity: string;
  selectedDepartment: string;
  selectedMajor: string;
  onUniversityChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onMajorChange: (value: string) => void;
  errors?: {
    birthYear?: boolean;
    university?: boolean;
    department?: boolean;
    major?: boolean;
  };
}

export default function Step1Basic({
  yearOptions,
  universityOptions,
  departmentOptions,
  majorOptions,
  selectedUniversity,
  selectedDepartment,
  selectedMajor,
  onUniversityChange,
  onDepartmentChange,
  onMajorChange,
  errors,
}: Step1BasicProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 나이 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="birthYear" className="typo-16-600 text-black">
          나이
        </label>
        <FormSelect
          id="birthYear"
          name="birthYear"
          options={yearOptions}
          placeholder="태어난 년도"
          error={!!errors?.birthYear}
        />
      </div>

      {/* 학교 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="university" className="typo-16-600 text-black">
          학교
        </label>
        <FormSelect
          id="university"
          name="university"
          options={universityOptions}
          placeholder="선택"
          defaultValue=""
          onChange={(e) => onUniversityChange(e.target.value)}
          error={!!errors?.university}
        />
      </div>

      {/* 학과(계열) / 전공 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="department" className="typo-16-600 text-black">
            학과
          </label>
          <FormSelect
            id="department"
            name="department"
            options={departmentOptions}
            placeholder="선택"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            disabled={!selectedUniversity}
            error={!!errors?.department}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="major" className="typo-16-600 text-black">
            전공
          </label>
          <FormSelect
            id="major"
            name="major"
            options={majorOptions}
            placeholder="선택"
            value={selectedMajor}
            onChange={(e) => onMajorChange(e.target.value)}
            disabled={!selectedDepartment}
            error={!!errors?.major}
          />
        </div>
      </div>
    </div>
  );
}
