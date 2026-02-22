import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

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
  "all:unset box-border w-full border-b border-gray-300 px-2 py-[14.5px] pr-8 leading-[19px] typo-16-500 text-color-gray-900 outline-none appearance-none cursor-pointer";

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
  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        className={cn(
          SELECT_CLASSNAME,
          error && "border-color-flame-500",
          !rest.value && "text-[#B3B3B3]", // placeholder 색상 처리
          className,
        )}
        style={{ ...SELECT_CONTAINER_STYLE, ...style }}
        defaultValue={rest.value === undefined ? "" : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

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
      <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400">
        <ChevronDown size={20} />
      </div>
    </div>
  );
};

export default FormSelect;
