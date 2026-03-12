"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";

export default function ScreenEventRegisterCompletePage() {
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

      <main className="flex flex-col items-center gap-6 p-6 md:px-[max(5vw,20px)]">
        <div className="flex w-full flex-col items-center gap-6 rounded-[24px] border border-white/30 bg-white p-10 pt-[26px] shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="w-full text-left text-[32px] font-bold text-black">
            이벤트 등록 완료 안내
          </div>
          <Heart size={90} className="fill-[#ff775e] text-[#ff775e]" />
          <div className="w-full text-xl leading-relaxed font-medium text-[#666]">
            해당 이벤트 예약 내역은 좌측 하단 이벤트 예약목록에서 열람하거나{" "}
            <span className="font-bold text-[#d91329]">취소</span>할 수
            있습니다.
            <br />
            이벤트 사유를 공지하고 싶다면 우측 하단의 공지사항 등록을
            이용하십시오.
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div
            onClick={() => router.push("/adminpage/myPage/event/list")}
            className="flex flex-1 cursor-pointer flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 pt-[26px] shadow-[1px_1px_20px_rgba(196,196,196,0.3)] transition-shadow hover:shadow-lg"
          >
            <div className="text-[32px] font-bold text-black">
              이벤트 예약목록 및 <span className="text-[#d91329]">취소</span>
            </div>
            <div className="text-base font-medium text-[#4d4d4d]">
              두 이벤트 예약 리스트 통합 예약 내역 및 취소
            </div>
          </div>

          <div
            onClick={() => router.push("/adminpage/myPage/notice/reservation")}
            className="flex flex-1 cursor-pointer flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 pt-[26px] shadow-[1px_1px_20px_rgba(196,196,196,0.3)] transition-shadow hover:shadow-lg"
          >
            <div className="border-none text-[32px] font-bold text-black">
              공지사항 등록
            </div>
            <div className="text-base font-medium text-[#4d4d4d]">
              이벤트 사유를 공지하고 싶으신가요?
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
