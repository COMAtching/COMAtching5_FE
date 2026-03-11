"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useToggle1000Button } from "@/hooks/useAdminManagement";

// --- Types ---
interface ManagementProps {
  adminData: {
    nickname: string;
    role: string;
    university: string;
    schoolEmail: string;
  };
}

// --- AdminMyPageMain ---
export const AdminMyPageMain = ({ adminData }: ManagementProps) => {
  return (
    <div className="w-full h-[calc(100vh-88px)] bg-[#f4f4f4] px-[100px] py-6 font-sans flex flex-col items-center whitespace-nowrap">
      <div className="flex flex-col text-left w-[calc(100%-200px)] bg-white shadow-[1px_1px_20px_rgba(196,196,196,0.3)] p-6 rounded-[24px]">
        <span className="text-[32px] font-bold text-black mb-2 border-none">내 정보</span>
        <span className="text-base text-[#858585] font-medium mb-10">모든 기능을 이용할 수 있습니다</span>
        <div className="flex flex-col gap-[19px]">
          <div className="text-[#828282] text-2xl font-medium">
            이름 : <span className="text-black font-semibold">{adminData.nickname}</span>
          </div>
          <div className="text-[#828282] text-2xl font-medium">
            권한 : <span className="text-black font-semibold">{adminData.role}</span>
          </div>
          <div className="text-[#828282] text-2xl font-medium">
            소속 : {adminData.university}
          </div>
          <div className="text-[#828282] text-2xl font-medium">
            웹메일 : {adminData.schoolEmail}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MasterManageComponent ---
export const MasterManageComponent = () => {
  const router = useRouter();
  const toggle1000 = useToggle1000Button();

  const handle1000Button = async () => {
    try {
      const data = await toggle1000.mutateAsync();
      if (data.data === "활성화") {
        alert("1000원 버튼 활성화 되었습니다.");
      } else if (data.data === "비활성화") {
        alert("1000원 버튼 비활성화 되었습니다.");
      }
    } catch (error) {
      console.error("천원 버튼 요청 실패", error);
      alert("천원 버튼 요청에 실패했습니다.");
    }
  };

  const menuItems = [
    { title: "가입자 결제 요청 관리", sub: "유저 결제 요청 관리", path: "/adminpage/payrequest" },
    { title: "가입자 검색 및 관리", sub: "결제내역 및 포인트 사용내역 열람, 포인트 조정, 블랙리스트 추가", path: "/adminpage/myPage/search" },
    { title: "가입자 성비 분석", sub: "가입자의 성비 분석", path: "/adminpage/myPage/gender" },
    { title: "공지사항 등록", sub: "전체알림 공지", path: "/adminpage/myPage/notice" },
    { title: "블랙리스트 확인 및 해제", sub: "블랙리스트 조회와 해제", path: "/adminpage/myPage/blacklist" },
    { title: "이벤트 등록", sub: "관리자의 이벤트 등록", path: "/adminpage/myPage/event" },
    { title: "문의 및 신고목록", sub: "가입자로부터 온 문의와 신고 열람", path: "/adminpage/myPage/Q&A" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[636fr_428fr] gap-4 w-full font-sans">
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          onClick={() => router.push(item.path)}
          className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex flex-col justify-center text-left p-6 gap-2 cursor-pointer min-w-[317px]"
        >
          <div className="text-[32px] font-bold text-black">{item.title}</div>
          <div className="text-base font-medium text-[#858585]">{item.sub}</div>
        </div>
      ))}
      <div
        onClick={handle1000Button}
        className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex flex-col justify-center text-left p-6 gap-2 cursor-pointer min-w-[317px]"
      >
        <div className="text-[32px] font-bold text-black">1000원 맞추기 버튼</div>
        <div className="text-base font-medium text-[#858585]">코매칭 마지막 날 진행할 유저포인트 천원 버튼 활성화</div>
      </div>
    </div>
  );
};

// --- OperatorManageComponent ---
export const OperatorManageComponent = () => {
  const router = useRouter();
  
  const menuItems = [
    { title: "가입자 결제 요청 관리", sub: "유저 결제 요청 관리", path: "/adminpage/payrequest" },
    { title: "가입자 검색 및 관리", sub: "결제내역 및 포인트 사용내역 열람, 포인트 조정, 블랙리스트 추가", path: "/adminpage/myPage/search" },
    { title: "가입자 성비 분석", sub: "가입자의 성비 분석", path: null },
    { title: "문의 및 신고목록", sub: "가입자로부터 온 문의와 신고 열람", path: null },
    { title: "블랙리스트 확인 및 해제", sub: "블랙리스트 조회와 해제", path: null },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[636fr_428fr] gap-4 w-full font-sans">
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          onClick={() => item.path && router.push(item.path)}
          className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex flex-col justify-center text-left p-6 gap-2 cursor-pointer min-w-[317px]"
        >
          <div className="text-[32px] font-bold text-black">{item.title}</div>
          <div className="text-base font-medium text-[#858585]">{item.sub}</div>
        </div>
      ))}
    </div>
  );
};

// --- AdminTeamManage ---
export const AdminTeamManage = () => {
  return (
    <div className="w-full flex flex-col gap-4 font-sans max-w-4xl mx-auto">
      <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex flex-col gap-2 text-left p-6">
        <div className="flex items-center gap-2">
          <span className="text-black font-bold text-[32px]">오퍼레이터 승인 요청</span>
          <div className="rounded-full bg-[#ff775e] text-base font-bold text-white w-9 h-9 flex justify-center items-center">
            3
          </div>
        </div>
        <span className="text-base font-medium text-[#858585]">오퍼레이터 승인 요청</span>
      </div>
      <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex flex-col gap-2 text-left p-6">
        <span className="text-black font-bold text-[32px]">오퍼레이터 관리</span>
        <span className="text-base font-medium text-[#858585]">오퍼레이터 관리</span>
      </div>
    </div>
  );
};
