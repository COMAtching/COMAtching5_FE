"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface AdminDropdownProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  height?: string;
  className?: string;
}

export const AdminDropdown = ({ 
  options, 
  selectedValue, 
  onSelect, 
  height, 
  className 
}: AdminDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef} 
      className={`relative w-full md:w-[136px] h-12 ${className || ""}`}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full bg-[#f4f4f4] rounded-lg border border-[#e5e5e5] px-3 flex items-center justify-between cursor-pointer text-[18px] font-semibold text-black"
      >
        <span>{selectedValue}</span>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 text-gray-400 ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-0 w-full bg-white border border-[#e5e5e5] mt-1 rounded-lg shadow-lg z-50 overflow-y-auto"
          style={{ maxHeight: height || "200px" }}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="px-3 py-2 hover:bg-[#f4f4f4] cursor-pointer text-[18px] font-medium text-black"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
