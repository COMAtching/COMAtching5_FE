/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminHeader } from "../../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useUserDetail } from "@/hooks/useAdminManagement";

export default function ScreenAdminUserDetailPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;

  const { data: userResponse, isLoading } = useUserDetail(uuid as string);
  const userData = userResponse?.data;

  // Mock data for blacklist and gender based on old code structure
  const isBlacklisted = false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-black"></div>
      </div>
    );
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

      <main className="flex flex-col items-center gap-10 p-6 md:px-[max(5vw,20px)]">
        <div className="relative flex min-h-[274px] w-full flex-col gap-6 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="flex items-center gap-2">
            <span className="text-[32px] font-bold text-black">
              가입자 상세정보
            </span>
            {isBlacklisted && (
              <span className="ml-2 text-xl font-semibold text-[#D91329]">
                (이용제한 가입자)
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex h-8 items-center">
              <span className="text-2xl font-medium text-[#828282]">
                Nickname :
              </span>
              <span className="ml-2 text-2xl font-semibold text-black">
                {userData?.username}
              </span>
            </div>
            <div className="flex h-12 items-center">
              <span className="text-2xl font-medium text-[#828282]">
                E-mail :
              </span>
              <span
                className={`ml-2 text-2xl font-bold ${isBlacklisted ? "text-[#D91329]" : "text-[#828282]"}`}
              >
                {userData?.email}
              </span>
            </div>
          </div>

          <div className="mt-auto flex justify-end gap-8">
            <FunctionButton
              onClick={() => router.push(`/adminpage/user/${uuid}/warnhistory`)}
            >
              경고 히스토리
            </FunctionButton>
            <FunctionButton
              onClick={() =>
                router.push(`/adminpage/user/${uuid}/SendWarnMessage`)
              }
            >
              경고 메시지 전송
            </FunctionButton>
            <FunctionButton
              isBlacklist={true}
              isBlacklisted={isBlacklisted}
              onClick={() => {}} // Handle blacklist toggle
            >
              {isBlacklisted ? "블랙리스트 해제" : "블랙리스트 추가"}
            </FunctionButton>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <ActionCard
            title="결제 내역"
            subText="결제내역 확인"
            onClick={() =>
              router.push(`/adminpage/user/${uuid}/PaymentHistory`)
            }
          />
          <ActionCard
            title="포인트 사용 내역"
            subText="포인트 사용내역 확인"
            onClick={() => {}}
          />
          <ActionCard
            title="포인트 조정"
            subText="포인트 수동조정"
            onClick={() => router.push(`/adminpage/user/${uuid}/pointManage`)}
          />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="flex w-[423px] flex-col items-center rounded-[24px] bg-white shadow-lg">
              <div className="flex h-[190px] w-full items-center justify-center border-b border-[#b3b3b3] p-6 text-center text-2xl text-black">
                해당 가입자에게 경고 메시지가 <br />
                전송 되었습니다.
              </div>
              <div
                className="flex h-14 w-full cursor-pointer items-center justify-center rounded-b-[24px] text-xl font-medium text-[#ff775e] hover:bg-gray-50"
                onClick={handleCloseModal}
              >
                확인
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const FunctionButton = ({
  children,
  onClick,
  isBlacklisted,
  isBlacklist,
}: any) => (
  <button
    onClick={onClick}
    className={`flex h-12 items-center justify-center rounded-lg px-[10px] text-xl font-bold text-white shadow-sm transition-all active:scale-95 ${
      isBlacklist && isBlacklisted ? "bg-[#1a1a1a]" : "bg-[#ff775e]"
    } hover:opacity-90`}
  >
    {children}
  </button>
);

const ActionCard = ({ title, subText, onClick }: any) => (
  <div
    onClick={onClick}
    className="flex h-[117px] flex-1 cursor-pointer flex-col justify-center gap-2 rounded-[24px] border border-white/30 bg-white p-6 text-left shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] transition-shadow hover:shadow-lg"
  >
    <div className="text-[32px] leading-tight font-bold text-black">
      {title}
    </div>
    <div className="text-base font-medium text-[#858585]">{subText}</div>
  </div>
);
