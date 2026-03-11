"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../../_components/AdminHeader";
import { AdminDropdown } from "../../../_components/AdminDropdown";
import { useAdminInfo } from "@/hooks/useAdminAuth";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, '0'));

export default function EventFreeMatchPage() {
  const router = useRouter();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [selectedDate, setSelectedDate] = useState("오늘");
  const [startTime, setStartTime] = useState("선택");
  const [startMinutes, setStartMinutes] = useState("선택");
  const [endTime, setEndTime] = useState("선택");
  const [endMinutes, setEndMinutes] = useState("선택");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>("");

  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;
  
  const [remainingEvents] = useState(3);

  const handleConfirm = () => {
    const sH = parseInt(startTime);
    const sM = parseInt(startMinutes);
    const eH = parseInt(endTime);
    const eM = parseInt(endMinutes);

    if (isNaN(sH) || isNaN(sM) || isNaN(eH) || isNaN(eM)) {
      alert("시간을 올바르게 선택해주세요.");
      return;
    }

    const startTotal = sH * 60 + sM;
    const endTotal = eH * 60 + eM;

    if (selectedDate === "오늘") {
      const now = new Date();
      if (startTotal < now.getHours() * 60 + now.getMinutes()) {
        setErrorMessage(<>이벤트 시작 시각은 현재 시각보다 <br /> 이전으로 설정할 수 없습니다.</>);
        setShowModal(true);
        return;
      }
    }

    if (startTotal >= endTotal) {
      setErrorMessage(<>이벤트 시작 시간이 종료 시간보다 <br /> 같거나 늦을 수 없습니다.</>);
      setShowModal(true);
      return;
    }

    // API Call logic here (using fetch or axios)
    // For now, redirect to completion page
    router.push("/adminpage/myPage/event/registercomplete");
  };

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
        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] w-full p-6 flex flex-col items-center gap-2">
          <div className="text-[32px] font-bold text-black w-full text-left">매칭 기회 제공 이벤트 예약</div>
          <div className="text-xl font-medium text-[#858585] w-full text-left">현재 잔여 이벤트 횟수는 {remainingEvents}회입니다.</div>
          <div className="flex justify-center gap-2 mt-2">
            {[...Array(4)].map((_, i) => (
              <Image 
                key={i} 
                src={i < remainingEvents ? "/logo/full-heart.svg" : "/logo/empty-heart.svg"} 
                alt="heart" 
                width={30} 
                height={30} 
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] w-full p-6 flex flex-col gap-8">
          <div className="flex gap-2 w-full">
            {["오늘", "내일", "모레"].map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-1 h-12 rounded-lg text-xl font-bold transition-all shadow-sm ${selectedDate === date ? "bg-[#ff775e] text-white" : "bg-[#b3b3b3] text-white"}`}
              >
                {date}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-[32px] font-bold text-black">이벤트 시간설정</div>
            
            <div className="flex flex-wrap items-center gap-4">
              <AdminDropdown options={hours} selectedValue={startTime} onSelect={setStartTime} />
              <span className="text-2xl font-semibold">시</span>
              <AdminDropdown options={minutes} selectedValue={startMinutes} onSelect={setStartMinutes} />
              <span className="text-2xl font-semibold">분 부터</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <AdminDropdown options={hours} selectedValue={endTime} onSelect={setEndTime} />
              <span className="text-2xl font-semibold">시</span>
              <AdminDropdown options={minutes} selectedValue={endMinutes} onSelect={setEndMinutes} />
              <span className="text-2xl font-semibold">분 까지</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100 pt-6">
            <div className="text-2xl font-semibold text-black">
              교내 가입자 전원에게 <span className="text-[#ff4d61]">매칭 1회의 기회</span>를 제공합니다.
            </div>
            <button 
              onClick={handleConfirm}
              className="w-[120px] h-12 bg-[#dd272a] text-white text-xl font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-[423px] bg-white rounded-[24px] shadow-2xl flex flex-col items-center">
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <Image src="/logo/modal-warn.svg" alt="warning" width={60} height={60} />
              <div className="text-2xl font-semibold text-black leading-relaxed">
                {errorMessage}
              </div>
            </div>
            <div 
              className="h-14 w-full flex border-t border-[#b3b3b3] items-center justify-center text-[#ff775e] text-xl font-bold cursor-pointer hover:bg-gray-50 rounded-b-[24px]"
              onClick={() => setShowModal(false)}
            >
              확인
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
