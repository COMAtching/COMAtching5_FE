import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps {
  id: string; // input 요소의 고유 식별자 (label의 htmlFor와 연결)
  type: string; // input 타입 (예: text, email, password 등)
  name: string; // form 데이터 전송 시 key 역할
  placeholder: string; // 입력란에 표시되는 안내 텍스트
  autoComplete?: string; // 브라우저 자동완성 속성값 (예: email, username, current-password, new-password, tel, off 등)
  required?: boolean; // 필수 입력 여부
  className?: string; // 추가 커스텀 클래스
  style?: React.CSSProperties; // 인라인 스타일
  value?: string; // input 값 (제어 컴포넌트로 사용 시)
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 값 변경 핸들러
}

const INPUT_STYLE = {
  background:
    "linear-gradient(180deg, rgba(248, 248, 248, 0.03) 0%, rgba(248, 248, 248, 0.24) 100%)",
};
const INPUT_CLASSNAME =
  "all:unset box-border w-full border-b border-gray-300 px-2 py-[14.5px] leading-[19px] typo-16-500 placeholder:text-[#B3B3B3] text-color-gray-900 outline-none";

const FormInput = ({
  id,
  type,
  name,
  placeholder,
  autoComplete,
  required = false,
  className = "",
  style = {},
  ...rest
}: FormInputProps) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      className={cn(INPUT_CLASSNAME, className)}
      style={{ ...INPUT_STYLE, ...style }}
      {...rest}
    />
  );
};

export default FormInput;
