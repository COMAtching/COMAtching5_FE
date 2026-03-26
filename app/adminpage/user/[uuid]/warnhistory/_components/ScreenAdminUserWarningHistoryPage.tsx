/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { AdminWarnItem } from "../../../../_components/AdminWarnItem";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useWarnHistory } from "@/hooks/useAdminManagement";

export default function ScreenAdminUserWarningHistoryPage() {
  const { uuid } = useParams();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const { data: adminResponse } = useAdminInfo();
  const { data: warnResponse } = useWarnHistory(uuid as string);

  const adminData = adminResponse?.data;
  const warnList = warnResponse?.data || [];

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
            경고 히스토리
          </div>
          <div className="text-base font-medium text-[#858585]">
            관리자에 의한 경고 및 누적 히스토리. 경고 처리는 철회할 수 없습니다.
          </div>

          <div className="mt-4 flex flex-col">
            {warnList.length > 0 ? (
              warnList.map((item: any, i: number) => (
                <AdminWarnItem
                  key={i}
                  reason={item.reason || item.type}
                  time={item.warnedAt || item.time}
                />
              ))
            ) : (
              <div className="mt-10 text-center text-2xl font-medium text-gray-400">
                경고 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
