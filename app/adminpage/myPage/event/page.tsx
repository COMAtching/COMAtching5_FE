"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";

export default function AdminEventPage() {
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const router = useRouter();
  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;
  
  // Mock heart logic if needed in future
  const [remainingEvents] = useState(3);

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
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div 
            onClick={() => router.push("/adminpage/myPage/event/free-match")}
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black border-none">매칭 기회 제공 이벤트</div>
            <div className="text-base font-medium text-[#858585]">이벤트 1회당 이성뽑기 1회 상한 존재</div>
          </div>
          
          <div 
            onClick={() => router.push("/adminpage/myPage/event/discount")}
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black border-none">포인트 충전 할인 이벤트</div>
            <div className="text-base font-medium text-[#858585]">40%의 할인 상한 존재, 최대 2시간 상한 존재</div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <div 
            onClick={() => router.push("/adminpage/myPage/event/list")}
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black border-none">이벤트 예약목록 및 취소</div>
            <div className="text-base font-medium text-[#858585]">두 이벤트 예약 리스트 통합 예약 내역 및 취소</div>
          </div>
          
          <div 
            onClick={() => router.push("/adminpage/myPage/event/history")}
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black border-none">이벤트 히스토리</div>
            <div className="text-base font-medium text-[#858585]">지금까지 진행한 과거 이벤트의 히스토리</div>
          </div>
        </div>
      </main>
    </div>
  );
}
