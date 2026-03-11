"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";

export default function AdminNoticeMainPage() {
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
      
      <main className="p-6 md:px-[max(5vw,20px)] flex flex-col items-center gap-4">
        <div 
          onClick={() => router.push("/adminpage/myPage/notice/reservation")}
          className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] w-full p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="text-[32px] font-bold text-black border-none">공지사항 예약</div>
          <div className="text-base font-medium text-[#858585]">공지사항은 예약제</div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <div 
            onClick={() => router.push("/adminpage/myPage/notice/list")}
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black border-none">
              공지사항 예약목록 및 <span className="text-[#d91329]">취소</span>
            </div>
            <div className="text-base font-medium text-[#858585]">전체 공지사항 예약 내역 및 취소</div>
          </div>
          
          <div 
            onClick={() => router.push("/adminpage/myPage/notice/history")}
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black border-none">공지사항 히스토리</div>
            <div className="text-base font-medium text-[#858585]">지금까지 진행한 과거 공지사항 히스토리</div>
          </div>
        </div>
      </main>
    </div>
  );
}
