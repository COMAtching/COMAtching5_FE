"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminHeader } from "../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useUserDetail } from "@/hooks/useAdminManagement";

export default function AdminUserDetailPage() {
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
      <div className="flex justify-center items-center min-h-screen bg-[#f4f4f4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
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
      
      <main className="p-6 md:px-[max(5vw,20px)] flex flex-col items-center gap-10">
        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] w-full min-h-[274px] p-6 flex flex-col gap-6 relative">
          <div className="flex items-center gap-2">
            <span className="text-[32px] font-bold text-black">가입자 상세정보</span>
            {isBlacklisted && <span className="text-xl font-semibold text-[#D91329] ml-2">(이용제한 가입자)</span>}
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center h-8">
              <span className="text-[#828282] text-2xl font-medium">Nickname :</span>
              <span className="text-black text-2xl font-semibold ml-2">{userData?.username}</span>
            </div>
            <div className="flex items-center h-12">
              <span className="text-[#828282] text-2xl font-medium">E-mail :</span>
              <span className={`text-2xl font-bold ml-2 ${isBlacklisted ? "text-[#D91329]" : "text-[#828282]"}`}>
                {userData?.email}
              </span> 
            </div>
          </div>
          
          <div className="flex justify-end gap-8 mt-auto">
            <FunctionButton onClick={() => router.push(`/adminpage/user/${uuid}/warnhistory`)}>
              경고 히스토리
            </FunctionButton>
            <FunctionButton onClick={() => router.push(`/adminpage/user/${uuid}/SendWarnMessage`)}>
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

        <div className="w-full flex flex-col md:flex-row gap-4">
          <ActionCard 
            title="결제 내역" 
            subText="결제내역 확인" 
            onClick={() => router.push(`/adminpage/user/${uuid}/PaymentHistory`)} 
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="w-[423px] bg-white rounded-[24px] shadow-lg flex flex-col items-center">
              <div className="h-[190px] w-full flex items-center justify-center text-2xl text-black border-b border-[#b3b3b3] text-center p-6">
                해당 가입자에게 경고 메시지가 <br />전송 되었습니다.
              </div>
              <div 
                className="h-14 w-full flex items-center justify-center text-[#ff775e] text-xl font-medium cursor-pointer hover:bg-gray-50 rounded-b-[24px]"
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

const FunctionButton = ({ children, onClick, isBlacklisted, isBlacklist }: any) => (
  <button
    onClick={onClick}
    className={`h-12 px-[10px] rounded-lg text-white text-xl font-bold shadow-sm flex items-center justify-center transition-all active:scale-95 ${
      isBlacklist && isBlacklisted ? "bg-[#1a1a1a]" : "bg-[#ff775e]"
    } hover:opacity-90`}
  >
    {children}
  </button>
);

const ActionCard = ({ title, subText, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] h-[117px] flex-1 flex flex-col justify-center text-left p-6 gap-2 cursor-pointer hover:shadow-lg transition-shadow"
  >
    <div className="text-[32px] font-bold text-black leading-tight">{title}</div>
    <div className="text-base font-medium text-[#858585]">{subText}</div>
  </div>
);
