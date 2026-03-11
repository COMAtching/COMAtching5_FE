"use client";

import React from "react";
import Image from "next/image";

export default function AdminNotAllowed() {
  return (
    <div className="flex flex-col items-center pt-[200px] w-full font-sans">
      <Image src="/logo/not-allowed.svg" alt="Error" width={100} height={100} />
      <div className="text-[36px] font-bold text-[#4d4d4d] text-center mt-4">
        미승인 오퍼레이터입니다.<br />
        관리자의 승인을 대기해 주세요.
      </div>
    </div>
  );
}
