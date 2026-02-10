import React from "react";
import { cn } from "@/lib/utils";

// React.InputHTMLAttributes를 확장하여 모든 표준 input 속성을 타입 안전하게 지원
interface FormInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "type" | "name" | "placeholder"
> {
  id: string; // input 요소의 고유 식별자 (label의 htmlFor와 연결)
  type: string; // input 타입 (예: text, email, password 등)
  name: string; // form 데이터 전송 시 key 역할
  placeholder: string; // 입력란에 표시되는 안내 텍스트
}

const INPUT_STYLE = {
  background:
    "linear-gradient(180deg, rgba(248, 248, 248, 0.03) 0%, rgba(248, 248, 248, 0.24) 100%)",
};
const INPUT_CLASSNAME =
  "all:unset box-border w-full border-b border-gray-300 px-2 py-[14.5px] leading-[19px] typo-16-500 placeholder:text-[#B3B3B3] text-color-gray-900 outline-none";

// 안전한 속성 화이트리스트 (XSS 방지)
const SAFE_INPUT_ATTRIBUTES = [
  "autoComplete",
  "required",
  "value",
  "defaultValue",
  "disabled",
  "readOnly",
  "maxLength",
  "minLength",
  "max",
  "min",
  "pattern",
  "step",
  "inputMode",
  "aria-label",
  "aria-describedby",
  "aria-invalid",
  "aria-required",
  "onChange",
  "onBlur",
  "onFocus",
  "onInput",
  "onKeyDown",
  "onKeyUp",
  "ref", // React 19에서 ref는 일반 prop
] as const;

type SafeInputAttribute = (typeof SAFE_INPUT_ATTRIBUTES)[number];

// React 19: ref는 일반 prop으로 전달되므로 forwardRef 불필요
const FormInput = ({
  id,
  type,
  name,
  placeholder,
  className = "",
  style = {},
  ...rest
}: FormInputProps) => {
  // 화이트리스트에 있는 안전한 속성만 추출
  const safeProps = Object.fromEntries(
    Object.entries(rest).filter(([key]) =>
      SAFE_INPUT_ATTRIBUTES.includes(key as SafeInputAttribute),
    ),
  );

  return (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      className={cn(INPUT_CLASSNAME, className)}
      style={{ ...INPUT_STYLE, ...style }}
      {...safeProps}
    />
  );
};

export default FormInput;
