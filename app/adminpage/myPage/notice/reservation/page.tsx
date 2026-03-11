"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../../_components/AdminHeader";
import { AdminDropdown } from "../../../_components/AdminDropdown";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useRegisterNotice } from "@/hooks/useAdminManagement";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')); // 5 min interval for better precision? Old used 10 but let's stick to 10 if that's standard.
// Actually standard was minutes = Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, '0'));
const stdMinutes = Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, '0'));

export default function NoticeReservationPage() {
  const router = useRouter();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState("오늘");
  const [startTime, setStartTime] = useState("선택");
  const [startMinutes, setStartMinutes] = useState("선택");
  const [endTime, setEndTime] = useState("선택");
  const [endMinutes, setEndMinutes] = useState("선택");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>("");

  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;
  const registerNoticeMutation = useRegisterNotice();

  const handleConfirm = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMessage(<>공지사항 제목과 내용을 <br /> 모두 입력해주세요.</>);
      setShowModal(true);
      return;
    }

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
      const currentTotal = now.getHours() * 60 + now.getMinutes();
      if (startTotal < currentTotal + 10) {
        setErrorMessage(<>공지사항 시작 시각은 현재 시각보다 <br /> 최소 10분 이후로 설정해야 합니다.</>);
        setShowModal(true);
        return;
      }
    }

    if (startTotal >= endTotal) {
      setErrorMessage(<>시작 시간이 종료 시간보다 <br /> 같거나 늦을 수 없습니다.</>);
      setShowModal(true);
      return;
    }

    const today = new Date();
    let selectedDateObject = new Date(today);
    if (selectedDate === "내일") selectedDateObject.setDate(today.getDate() + 1);
    else if (selectedDate === "모레") selectedDateObject.setDate(today.getDate() + 2);

    const formatTimePart = (h: number, m: number) => {
      const d = new Date(selectedDateObject);
      d.setHours(h, m, 0, 0);
      // Adjust to KST (UTC+9)
      const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
      return kst.toISOString().slice(0, 19);
    };

    const payload = {
      title,
      content,
      postedAt: formatTimePart(sH, sM),
      closedAt: formatTimePart(eH, eM),
    };

    try {
      await registerNoticeMutation.mutateAsync(payload);
      router.push("/adminpage/myPage/notice/complete");
    } catch (error) {
      setErrorMessage(<>공지사항 등록 중 오류가 발생했습니다. <br /> 다시 시도해주세요.</>);
      setShowModal(true);
    }
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
        <div className="w-full flex flex-col lg:flex-row gap-6">
          <div className="flex-[444] flex flex-col gap-6 min-w-[350px]">
            <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] p-6 pt-[26px] flex flex-col gap-4">
              <div className="text-[32px] font-bold text-black border-none">공지사항 제목 등록</div>
              <div className="text-base font-medium text-[#858585]">아래에 공지사항 제목을 입력해주세요.</div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full border border-[#979797] rounded-md p-3 text-2xl font-medium shadow-inner placeholder:text-[#b3b3b3] outline-none focus:ring-2 focus:ring-[#ff775e]"
              />
            </div>
            
            <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] p-6 pt-[26px] flex flex-col gap-4">
              <div className="text-[32px] font-bold text-black border-none">내용 등록</div>
              <div className="text-base font-medium text-[#858585]">아래에 공지사항 내용을 입력하세요.</div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full h-[200px] border border-[#979797] rounded-md p-4 text-2xl font-medium shadow-inner placeholder:text-[#b3b3b3] outline-none focus:ring-2 focus:ring-[#ff775e] text-center resize-none"
              />
            </div>
          </div>

          <div className="flex-[619] bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] p-6 lg:p-[82px_24px] flex flex-col gap-8">
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
              <div className="text-[32px] font-bold text-black underline decoration-white border-none">공지 시간설정</div>
              
              <div className="flex flex-wrap items-center gap-4">
                <AdminDropdown options={hours} selectedValue={startTime} onSelect={setStartTime} />
                <span className="text-2xl font-semibold">시</span>
                <AdminDropdown options={stdMinutes} selectedValue={startMinutes} onSelect={setStartMinutes} />
                <span className="text-2xl font-semibold">분 부터</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <AdminDropdown options={hours} selectedValue={endTime} onSelect={setEndTime} />
                <span className="text-2xl font-semibold">시</span>
                <AdminDropdown options={stdMinutes} selectedValue={endMinutes} onSelect={setEndMinutes} />
                <span className="text-2xl font-semibold">분 까지</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-auto border-t border-gray-100 pt-6">
              <div className="text-2xl font-semibold text-black">
                교내 가입자 전체에게 팝업 형태로 공지합니다.
              </div>
              <button 
                onClick={handleConfirm}
                className="w-[120px] h-12 bg-[#dd272a] text-white text-xl font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                disabled={registerNoticeMutation.isPending}
              >
                {registerNoticeMutation.isPending ? "..." : "확인"}
              </button>
            </div>
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
