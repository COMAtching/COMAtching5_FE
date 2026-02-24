import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 옵션 타입 정의 (일반적인 단일 옵션)
export type SelectOption = {
  value: string;
  label: string;
};

// 옵션 그룹 타입 정의 (대학 - 계열 - 학과 처럼 묶여있는 경우)
export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

interface FormSelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "id" | "name"
> {
  id: string;
  name: string;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
  error?: boolean;
}

const SELECT_CONTAINER_STYLE = {
  background:
    "linear-gradient(180deg, rgba(248, 248, 248, 0.03) 0%, rgba(248, 248, 248, 0.24) 100%)",
};

const SELECT_CLASSNAME =
  "all:unset box-border w-full border-b border-gray-300 px-2 py-[14.5px] pr-8 leading-[19px] typo-16-500 text-black outline-none appearance-none cursor-pointer";

// 타입 가드: 옵션 그룹인지 확인
function isOptionGroup(
  option: SelectOption | SelectOptionGroup,
): option is SelectOptionGroup {
  return "options" in option;
}

const FormSelect = ({
  id,
  name,
  options,
  placeholder,
  className = "",
  style = {},
  error = false,
  ...rest
}: FormSelectProps) => {
  // value prop이 없을 때만 내부 상태 사용 (uncontrolled)
  const [internalValue, setInternalValue] = useState(rest.defaultValue || "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInternalValue(e.target.value);
    if (rest.onChange) {
      rest.onChange(e);
    }
  };

  // controlled 컴포넌트면 value 사용, 아니면 내부 상태 사용
  const currentValue = rest.value !== undefined ? rest.value : internalValue;

  // 값이 없거나 빈 문자열인 경우 placeholder 색상 적용
  const isPlaceholder = !currentValue || currentValue === "";

  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        className={cn(
          SELECT_CLASSNAME,
          error && "border-color-flame-700",
          isPlaceholder && "text-color-text-caption2", // placeholder 색상 처리
          className,
        )}
        style={{ ...SELECT_CONTAINER_STYLE, ...style }}
        defaultValue={rest.value === undefined ? "" : undefined}
        onChange={handleChange}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((item, index) => {
          if (isOptionGroup(item)) {
            return (
              <optgroup key={`${item.label}-${index}`} label={item.label}>
                {item.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            );
          }

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>

      {/* 오른쪽에 화살표 아이콘 (포인터 이벤트 무시하여 클릭 방해 안 함) */}
      <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
        <Image src="/global/reverse-triangle.svg" alt="" width={8} height={8} />
      </div>
    </div>
  );
};

export default FormSelect;
