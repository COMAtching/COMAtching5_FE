"use client";

import React from "react";
import FormSelect from "@/components/ui/FormSelect";
import { SelectOption } from "@/components/ui/FormSelect";

interface Step1BasicProps {
  yearOptions: SelectOption[];
  universityOptions: SelectOption[];
  departmentOptions: SelectOption[];
  majorOptions: SelectOption[];
  selectedBirthYear: string;
  selectedUniversity: string;
  selectedDepartment: string;
  selectedMajor: string;
  onBirthYearChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onMajorChange: (value: string) => void;
}

export default function Step1Basic({
  yearOptions,
  universityOptions,
  departmentOptions,
  majorOptions,
  selectedBirthYear,
  selectedUniversity,
  selectedDepartment,
  selectedMajor,
  onBirthYearChange,
  onUniversityChange,
  onDepartmentChange,
  onMajorChange,
}: Step1BasicProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 나이 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="birthYear" className="typo-16-600 text-black">
          나이
        </label>
        <FormSelect
          key="select-birthYear"
          id="birthYear"
          name="birthYear"
          options={yearOptions}
          placeholder="태어난 년도"
          value={selectedBirthYear}
          onChange={(e) => onBirthYearChange(e.target.value)}
        />
      </div>

      {/* 학교 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="university" className="typo-16-600 text-black">
          학교
        </label>
        <FormSelect
          key="select-university"
          id="university"
          name="university"
          options={universityOptions}
          placeholder="선택"
          value={selectedUniversity}
          onChange={(e) => onUniversityChange(e.target.value)}
        />
      </div>

      {/* 학과(계열) / 전공 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="department" className="typo-16-600 text-black">
            학과
          </label>
          <FormSelect
            key="select-department"
            id="department"
            name="department"
            options={departmentOptions}
            placeholder="선택"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            disabled={!selectedUniversity}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="major" className="typo-16-600 text-black">
            전공
          </label>
          <FormSelect
            key="select-major"
            id="major"
            name="major"
            options={majorOptions}
            placeholder="선택"
            value={selectedMajor}
            onChange={(e) => onMajorChange(e.target.value)}
            disabled={!selectedDepartment}
          />
        </div>
      </div>
    </div>
  );
}
