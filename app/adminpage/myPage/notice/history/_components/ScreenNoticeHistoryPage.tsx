/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { AdminListItem } from "../../../../_components/AdminListItem";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useNoticeList } from "@/hooks/useAdminManagement";
import { formatDateTime } from "@/utils/dateFormatter";

export default function ScreenNoticeHistoryPage() {
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const { data: adminResponse } = useAdminInfo();
  const { data: noticeResponse } = useNoticeList("HISTORY");

  const adminData = adminResponse?.data;
  const noticeList = noticeResponse?.data || [];

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
            공지사항 히스토리
          </div>
          <div className="text-xl font-medium text-[#858585]">
            진행한 공지사항의 히스토리
          </div>

          <div className="flex flex-col overflow-y-auto">
            {noticeList.length > 0 ? (
              noticeList.map((item: any) => {
                const posted = formatDateTime(item.postedAt);
                const closed = formatDateTime(item.closedAt);
                return (
                  <AdminListItem
                    key={item.id}
                    title={item.title}
                    statusText="실행 완료"
                    date={posted.date}
                    startTime={posted.time}
                    endTime={closed.time}
                  />
                );
              })
            ) : (
              <div className="mt-10 text-center text-2xl font-medium text-gray-400">
                공지사항 히스토리가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
