"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";

export default function NoticeRegisterCompletePage() {
  const router = useRouter();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
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
      
      <main className="p-6 md:px-[max(5vw,20px)] flex flex-col items-center gap-6">
        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] w-full p-10 pt-[26px] flex flex-col items-center gap-6">
          <div className="text-[32px] font-bold text-black w-full text-left">공지사항 예약 완료 안내</div>
          <Image src="/logo/event-register-heart.svg" alt="heart" width={90} height={90} />
          <div className="w-full text-xl font-medium text-[#666] leading-relaxed">
            해당 공지사항 예약 내역은 좌측 하단 공지사항 예약목록에서 열람하거나 <span className="font-bold text-[#d91329]">취소</span>할 수 있습니다.<br />
            이벤트 예약을 잊으셨다면 우측 하단의 이벤트 예약을 이용하십시오.
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <div 
            onClick={() => router.push("/adminpage/myPage/notice/list")}
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black">
              공지사항 예약목록 및 <span className="text-[#d91329]">취소</span>
            </div>
            <div className="text-base font-medium text-[#4d4d4d]">전체 공지사항 예약 내역 및 취소</div>
          </div>
          
          <div 
            onClick={() => router.push("/adminpage/myPage/event/page")} // or event main
            className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] flex-1 p-6 pt-[26px] flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-[32px] font-bold text-black border-none">이벤트 예약</div>
            <div className="text-base font-medium text-[#4d4d4d]">이벤트를 아직 예약하지 않으셨나요?</div>
          </div>
        </div>
      </main>
    </div>
  );
}
