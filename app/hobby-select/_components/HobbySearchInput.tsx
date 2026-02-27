import React, { FormEvent, useRef } from "react";
import { Search } from "lucide-react";

interface HobbySearchInputProps {
  onSearch: (keyword: string) => void;
}

const HobbySearchInput = ({ onSearch }: HobbySearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      onSearch(inputRef.current.value);
      inputRef.current.blur();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-9 w-full items-center rounded-[12px] border border-[#C2C2C2] bg-[#B3B3B31A]"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="관심사 혹은 키워드를 입력하세요."
        className="placeholder:typo-12-500 w-full bg-transparent py-2 pl-4 placeholder:text-gray-400 focus:outline-none"
      />
      <button type="submit" className="mr-[17.25px]">
        <Search size={16} color="#b3b3b3" />
      </button>
    </form>
  );
};

export default HobbySearchInput;
