/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { AdminListItem } from "../../../../_components/AdminListItem";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useEventList } from "@/hooks/useAdminManagement";
import { formatDateTime } from "@/utils/dateFormatter";

export default function ScreenEventHistoryPage() {
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const { data: adminResponse } = useAdminInfo();
  const { data: eventResponse } = useEventList("HISTORY");

  const adminData = adminResponse?.data;
  const eventList = eventResponse?.data || [];

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
        <div className="flex min-h-[500px] w-full flex-col gap-4 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="border-none text-[32px] font-bold text-black">
            이벤트 히스토리
          </div>
          <div className="text-xl font-medium text-[#858585]">
            진행한 이벤트의 히스토리
          </div>

          <div className="flex flex-col overflow-y-auto">
            {eventList.length > 0 ? (
              eventList.map((item: any) => {
                const start = formatDateTime(item.start);
                const end = formatDateTime(item.end);
                return (
                  <AdminListItem
                    key={item.id}
                    title={
                      item.eventType === "FREE_MATCH"
                        ? "매칭 기회 제공 이벤트"
                        : "포인트 충전 할인 이벤트"
                    }
                    subTitle={item.discountRate ? `${item.discountRate}%` : ""}
                    statusText="실행 완료"
                    date={start.date}
                    startTime={start.time}
                    endTime={end.time}
                  />
                );
              })
            ) : (
              <div className="mt-10 text-center text-2xl font-medium text-gray-400">
                이벤트 히스토리가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
