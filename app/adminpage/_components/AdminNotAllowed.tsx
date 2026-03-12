"use client";

import React from "react";
import { Ban } from "lucide-react";

export default function AdminNotAllowed() {
  return (
    <div className="flex w-full flex-col items-center pt-[200px] font-sans">
      <Ban size={100} className="text-[#858585]" />
      <div className="mt-4 text-center text-[36px] font-bold text-[#4d4d4d]">
        미승인 오퍼레이터입니다.
        <br />
        관리자의 승인을 대기해 주세요.
      </div>
    </div>
  );
}
