"use client";

import React, { useState } from "react";
import { AdminHeader } from "../../../_components/AdminHeader";
import { AdminListItem } from "../../../_components/AdminListItem";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useEventList, useDeleteEvent } from "@/hooks/useAdminManagement";
import { formatDateTime } from "@/utils/dateFormatter";

export default function EventListPage() {
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const { data: adminResponse } = useAdminInfo();
  const { data: eventResponse, refetch } = useEventList("RESERVATION");
  const deleteEventMutation = useDeleteEvent();

  const adminData = adminResponse?.data;
  const eventList = eventResponse?.data || [];

  const handleCancel = async (id: number) => {
    if (confirm("이 이벤트를 정말로 취소하시겠어요?")) {
      try {
        await deleteEventMutation.mutateAsync(id);
        alert("이벤트가 취소되었습니다.");
        refetch();
      } catch (error) {
        alert("이벤트 취소 중 오류가 발생했습니다.");
      }
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
        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] w-full p-6 flex flex-col gap-4 min-h-[500px]">
          <div className="text-[32px] font-bold text-black border-none underline decoration-white">
            이벤트 예약목록 및 <span className="text-[#d91329]">취소</span>
          </div>
          <div className="text-xl font-medium text-[#858585]">두 이벤트 예약 리스트 통합 예약 내역 및 취소</div>
          
          <div className="flex flex-col overflow-y-auto">
            {eventList.length > 0 ? (
              eventList.map((item: any) => {
                const start = formatDateTime(item.start);
                const end = formatDateTime(item.end);
                return (
                  <AdminListItem
                    key={item.id}
                    title={item.eventType === "FREE_MATCH" ? "매칭 기회 제공 이벤트" : "포인트 충전 할인 이벤트"}
                    subTitle={item.discountRate ? `${item.discountRate}%` : ""}
                    statusText="실행전"
                    date={start.date}
                    startTime={start.time}
                    endTime={end.time}
                    onCancel={() => handleCancel(item.id)}
                    cancelButtonText="이벤트 취소"
                  />
                );
              })
            ) : (
              <div className="text-2xl mt-10 text-center text-gray-400 font-medium">
                예약된 이벤트가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
