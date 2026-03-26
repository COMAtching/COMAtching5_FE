/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { AdminListItem } from "../../../../_components/AdminListItem";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useNoticeList, useDeleteNotice } from "@/hooks/useAdminManagement";
import { formatDateTime } from "@/utils/dateFormatter";

export default function ScreenNoticeListPage() {
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const { data: adminResponse } = useAdminInfo();
  const { data: noticeResponse, refetch } = useNoticeList("RESERVATION");
  const deleteNoticeMutation = useDeleteNotice();

  const adminData = adminResponse?.data;
  const noticeList = noticeResponse?.data || [];

  const handleCancel = async (id: number) => {
    if (confirm("이 공지를 정말로 취소하시겠어요?")) {
      try {
        await deleteNoticeMutation.mutateAsync(id);
        alert("공지가 삭제되었습니다.");
        refetch();
      } catch (error) {
        alert("공지 삭제 중 오류가 발생했습니다.");
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

      <main className="flex flex-col items-center gap-6 p-6 md:px-[max(5vw,20px)]">
        <div className="flex min-h-[500px] w-full flex-col gap-4 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="border-none text-[32px] font-bold text-black underline decoration-white">
            공지사항 예약목록 및 <span className="text-[#d91329]">취소</span>
          </div>
          <div className="text-xl font-medium text-[#858585]">
            전체 공지사항 예약 내역 및 취소
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
                    statusText="실행전"
                    date={posted.date}
                    startTime={posted.time}
                    endTime={closed.time}
                    onCancel={() => handleCancel(item.id)}
                    cancelButtonText="공지 취소"
                  />
                );
              })
            ) : (
              <div className="mt-10 text-center text-2xl font-medium text-gray-400">
                예약된 공지사항이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
