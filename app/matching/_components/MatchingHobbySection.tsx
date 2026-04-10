"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

import { HOBBIES, HobbyCategory } from "@/lib/constants/hobbies";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface MatchingHobbySectionProps {
  onSelect: (category: HobbyCategory) => void;
  selectedCategory?: string;
}

export default function MatchingHobbySection({
  onSelect,
  selectedCategory,
}: MatchingHobbySectionProps) {
  const [open, setOpen] = React.useState(false);
  const categories = Object.keys(HOBBIES) as HobbyCategory[];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="border-color-gray-100 flex w-full flex-col gap-4 border-b pb-5">
        <div className="flex w-full items-center justify-between">
          <DrawerTrigger asChild>
            <button className="flex flex-1 items-center justify-between text-left">
              <div className="flex flex-col gap-1">
                <h2 className="typo-20-700 text-color-text-black">관심사</h2>
                <p className="typo-14-500 text-color-text-caption3">
                  상대방이 가졌음 하는 관심사를 골라주세요.
                </p>
              </div>
              <ChevronRight className="text-color-text-caption3 h-5 w-5" />
            </button>
          </DrawerTrigger>
        </div>

        {selectedCategory && (
          <div className="flex flex-wrap gap-2">
            <span className="typo-14-500 bg-color-gray-50 text-color-gray-800 rounded-full px-3 py-1">
              {selectedCategory}
            </span>
          </div>
        )}
      </div>

      <DrawerContent className="pb-10">
        <DrawerHeader className="px-5 text-left">
          <DrawerTitle className="typo-20-700 text-color-text-black">
            관심사 선택
          </DrawerTitle>
          <p className="typo-14-500 text-color-text-caption3 mt-1 leading-tight">
            상대방이 가졌음 하는 관심사를 골라주세요. <br />
            중분류만 선택할 수 있어요.
          </p>
        </DrawerHeader>
        <div className="mt-4 grid grid-cols-2 place-items-center gap-x-4 gap-y-6 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onSelect(category);
                setOpen(false);
              }}
              className={`flex h-[148px] w-[148px] flex-col items-center justify-center gap-2 rounded-full border transition-all ${
                selectedCategory === category
                  ? "bg-pink-gradient border-[#F57DB2]"
                  : "border-color-gray-100 bg-white"
              }`}
            >
              <div className="relative h-16 w-16">
                <Image
                  src="/main/elec-bulb.png"
                  alt={category}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="typo-16-600 text-black">{category}</span>
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
