import React, { useState, useRef, useEffect } from "react";
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
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "id" | "name" | "value" | "onChange"
> {
  id: string;
  name: string;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
  error?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const SELECT_CONTAINER_STYLE = {
  background:
    "linear-gradient(180deg, rgba(248, 248, 248, 0.03) 0%, rgba(248, 248, 248, 0.24) 100%)",
};

const SELECT_CLASSNAME =
  "all:unset box-border w-full border-b border-gray-300 px-2 py-[14.5px] pr-8 leading-[19px] typo-16-500 text-black outline-none appearance-none cursor-pointer flex items-center";

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
  value,
  defaultValue,
  onChange,
  disabled = false,
  ...rest
}: FormSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // uncontrolled 상태 관리를 위한 내부 상태
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  // 제어/비제어 값 결정
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleSelect = (selectedValue: string) => {
    // 닫기
    setIsOpen(false);

    // 내부 상태 업데이트
    setInternalValue(selectedValue);

    // onChange(faked event)
    if (onChange) {
      // Create a fake event object to match the signature of a typical input onChange
      const event = {
        target: { name, value: selectedValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  // 외부 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 값이 없거나 빈 문자열인 경우 placeholder 색상 적용
  const isPlaceholder = !currentValue || currentValue === "";

  // 현재 선택된 라벨 찾기 (디스플레이용)
  const currentLabel = React.useMemo(() => {
    if (!currentValue) return placeholder || "";
    for (const option of options) {
      if (isOptionGroup(option)) {
        const found = option.options.find((o) => o.value === currentValue);
        if (found) return found.label;
      } else {
        if (option.value === currentValue) return option.label;
      }
    }
    return currentValue;
  }, [currentValue, options, placeholder]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 폼 전송용 숨겨진 input */}
      <input type="hidden" id={id} name={name} value={currentValue} />

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          SELECT_CLASSNAME,
          error && "border-color-flame-700",
          isPlaceholder && "text-color-text-caption2", // placeholder 색상 처리
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        style={{ ...SELECT_CONTAINER_STYLE, ...style }}
        {...rest}
      >
        <span className="flex-1 truncate text-left">{currentLabel}</span>
      </button>

      {/* 오른쪽에 화살표 아이콘 (포인터 이벤트 무시하여 클릭 방해 안 함) */}
      <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
        <Image
          src="/global/reverse-triangle.svg"
          alt=""
          width={8}
          height={8}
          className={cn("transition-transform", isOpen && "rotate-180")}
        />
      </div>

      {/* 드롭다운 메뉴 영역 */}
      {isOpen && !disabled && (
        <div className="custom-scrollbar animate-in fade-in slide-in-from-top-2 absolute top-[calc(100%+4px)] left-0 z-[100] flex max-h-[300px] w-full flex-col overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] duration-200">
          {options.map((item, index) => {
            if (isOptionGroup(item)) {
              return (
                <div
                  key={`${item.label}-${index}`}
                  className="mb-1 flex flex-col last:mb-0"
                >
                  <div className="typo-12-600 text-color-text-caption1 sticky top-0 z-10 bg-gray-50/50 px-4 py-2 backdrop-blur-sm">
                    {item.label}
                  </div>
                  <div className="flex flex-col">
                    {item.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(opt.value);
                        }}
                        className={cn(
                          "typo-14-500 px-4 py-3 text-left transition-colors",
                          currentValue === opt.value
                            ? "bg-button-primary/5 text-button-primary font-bold"
                            : "text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item.value);
                }}
                className={cn(
                  "typo-14-500 flex items-center justify-between px-4 py-3 text-left transition-colors",
                  currentValue === item.value
                    ? "bg-button-primary/5 text-button-primary font-bold"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                {item.label}
              </button>
            );
          })}
          {options.length === 0 && (
            <div className="typo-14-400 py-6 text-center text-gray-400">
              선택할 수 있는 항목이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormSelect;
