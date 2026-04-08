"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";

export default function ScreenAdminNoticeMainPage() {
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const router = useRouter();
  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      <AdminHeader
        setAdminSelect={setAdminSelect}
        adminSelect={adminSelect}
        university={adminData?.university}
        role={adminData?.role}
        nickname={adminData?.nickname}
      />

      <main className="flex flex-col items-center gap-4 p-6 md:px-[max(5vw,20px)]">
        <div
          onClick={() => router.push("/adminpage/myPage/notice/reservation")}
          className="flex w-full cursor-pointer flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 pt-[26px] shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] transition-shadow hover:shadow-lg"
        >
          <div className="border-none text-[32px] font-bold text-black">
            공지사항 예약
          </div>
          <div className="text-base font-medium text-[#858585]">
            공지사항은 예약제
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div
            onClick={() => router.push("/adminpage/myPage/notice/list")}
            className="flex flex-1 cursor-pointer flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 pt-[26px] shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] transition-shadow hover:shadow-lg"
          >
            <div className="border-none text-[32px] font-bold text-black">
              공지사항 예약목록 및 <span className="text-[#d91329]">취소</span>
            </div>
            <div className="text-base font-medium text-[#858585]">
              전체 공지사항 예약 내역 및 취소
            </div>
          </div>

          <div
            onClick={() => router.push("/adminpage/myPage/notice/history")}
            className="flex flex-1 cursor-pointer flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 pt-[26px] shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] transition-shadow hover:shadow-lg"
          >
            <div className="border-none text-[32px] font-bold text-black">
              공지사항 히스토리
            </div>
            <div className="text-base font-medium text-[#858585]">
              지금까지 진행한 과거 공지사항 히스토리
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
