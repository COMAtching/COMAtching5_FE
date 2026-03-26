"use client";

import React, { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { AdminDropdown } from "../../../../_components/AdminDropdown";
import { AdminDateSelector } from "../../../../_components/AdminDateSelector";
import { AdminTimeRow } from "../../../../_components/AdminTimeRow";
import { AdminWarningModal } from "../../../../_components/AdminWarningModal";
import { useAdminInfo } from "@/hooks/useAdminAuth";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 6 }, (_, i) =>
  String(i * 10).padStart(2, "0"),
);
const percentages = Array.from({ length: 4 }, (_, i) => String((i + 1) * 10));

export default function ScreenEventDiscountPage() {
  const router = useRouter();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [selectedDate, setSelectedDate] = useState("오늘");
  const [startTime, setStartTime] = useState("선택");
  const [startMinutes, setStartMinutes] = useState("선택");
  const [endTime, setEndTime] = useState("선택");
  const [endMinutes, setEndMinutes] = useState("선택");
  const [selectedDiscount, setSelectedDiscount] = useState("선택");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>("");

  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;

  const getDurationText = () => {
    const sH = parseInt(startTime);
    const sM = parseInt(startMinutes);
    const eH = parseInt(endTime);
    const eM = parseInt(endMinutes);

    if (isNaN(sH) || isNaN(sM) || isNaN(eH) || isNaN(eM)) return "0시간";

    const diff = eH * 60 + eM - (sH * 60 + sM);
    if (diff <= 0) return "0시간";

    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
  };

  const handleConfirm = () => {
    const sH = parseInt(startTime);
    const sM = parseInt(startMinutes);
    const eH = parseInt(endTime);
    const eM = parseInt(endMinutes);

    if (isNaN(sH) || isNaN(sM) || isNaN(eH) || isNaN(eM)) {
      alert("시간을 올바르게 선택해주세요.");
      return;
    }
    if (selectedDiscount === "선택") {
      alert("할인율을 선택해주세요.");
      return;
    }

    const startTotal = sH * 60 + sM;
    const endTotal = eH * 60 + eM;

    if (startTotal >= endTotal) {
      setErrorMessage(
        <>
          이벤트 시작 시간이 종료 시간보다 <br /> 같거나 늦을 수 없습니다.
        </>,
      );
      setShowModal(true);
      return;
    }

    // API Call logic
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

      <main className="flex flex-col items-center gap-6 p-6 md:px-[max(5vw,20px)]">
        <div className="flex w-full flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="text-[32px] font-bold text-black">
            포인트 충전 할인 이벤트 예약
          </div>
        </div>

        <div className="flex w-full flex-col gap-8 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <AdminDateSelector
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <div className="flex flex-col gap-4">
            <div className="text-[32px] font-bold text-black">
              이벤트 시간설정(최대 2시간)
            </div>

            <AdminTimeRow
              hours={hours}
              minutes={minutes}
              selectedHour={startTime}
              selectedMinute={startMinutes}
              onHourSelect={setStartTime}
              onMinuteSelect={setStartMinutes}
              suffix="분 부터"
            />

            <AdminTimeRow
              hours={hours}
              minutes={minutes}
              selectedHour={endTime}
              selectedMinute={endMinutes}
              onHourSelect={setEndTime}
              onMinuteSelect={setEndMinutes}
              suffix="분 까지"
            />

            <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-6">
              <div className="text-2xl font-semibold text-black">
                교내 가입자 전원에게{" "}
                <span className="text-[#ff4d61]">
                  {getDurationText()}동안 최대 3번 구매 가능한
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <AdminDropdown
                  options={percentages}
                  selectedValue={selectedDiscount}
                  onSelect={setSelectedDiscount}
                />
                <div className="text-2xl font-semibold">
                  %의 <span className="text-[#ff4d61]">포인트 충전 할인</span>을
                  제공합니다.
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="h-12 w-[120px] self-end rounded-lg bg-[#dd272a] text-xl font-bold text-white shadow-md transition-colors hover:bg-red-700"
            >
              확인
            </button>
          </div>
        </div>
      </main>

      <AdminWarningModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={errorMessage}
      />
    </div>
  );
}
