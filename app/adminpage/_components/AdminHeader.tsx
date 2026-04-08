"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface AdminHeaderProps {
  adminSelect?: string;
  setAdminSelect?: (val: string) => void;
  university?: string;
  role?: string;
  nickname?: string;
}

export const AdminHeader = ({ 
  adminSelect, 
  setAdminSelect,
  university,
  role,
  nickname
}: AdminHeaderProps) => {
  const router = useRouter();

  const goToMainButton = () => {
    if (setAdminSelect) setAdminSelect("Main");
    router.push("/adminpage/myPage");
  };

  const goToTeamButton = () => {
    if (setAdminSelect) setAdminSelect("팀관리");
    router.push("/adminpage/myPage?tab=팀관리");
  };

  const goToMemberButton = () => {
    if (setAdminSelect) setAdminSelect("가입자관리");
    router.push("/adminpage/myPage?tab=가입자관리");
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "";
    return role.includes("ADMIN") ? "관리자" : "오퍼레이터";
  };

  return (
    <header className="w-full flex h-[88px] font-sans justify-between items-center px-12 bg-white border-b border-[#cdcdcd] sticky top-0 z-[19999]">
      <Image 
        src="/logo/admin_header_logo.svg" 
        alt="코매칭 로고" 
        width={140} 
        height={40} 
        className="cursor-pointer" 
        onClick={() => router.push("/adminpage")} 
      />

      <nav className="flex justify-center items-center gap-[4.5em] whitespace-nowrap h-full">
        <div
          onClick={goToMainButton}
          className={`px-6 py-[29.5px] text-2xl font-semibold cursor-pointer h-full flex items-center transition-all ${adminSelect === "Main" ? "border-b-4 border-black text-black" : "text-[#808080]"}`}
        >
          Main
        </div>

        <div
          onClick={goToMemberButton}
          className={`px-2 py-[29.5px] text-2xl font-semibold cursor-pointer h-full flex items-center transition-all ${adminSelect === "가입자관리" ? "border-b-4 border-black text-black" : "text-[#808080]"}`}
        >
          가입자관리
        </div>

        <div
          onClick={goToTeamButton}
          className={`px-[10px] py-[29.5px] flex items-center gap-2 cursor-pointer h-full transition-all ${adminSelect === "팀관리" ? "border-b-4 border-black text-black" : "text-[#808080]"}`}
        >
          <span className="text-2xl font-semibold">팀 관리</span>
          <div className="rounded-full bg-[#ff775e] text-[10px] font-bold text-white w-6 h-6 flex justify-center items-center">
            3
          </div>
        </div>
      </nav>

      <div className="p-2 h-[50px] bg-[#f3f3f3] text-black whitespace-nowrap flex justify-center items-center text-right gap-4 rounded-lg">
        <div className="flex flex-col font-medium leading-tight">
          <div className="text-[#808080] text-xs font-semibold">{university}</div>
          <div className="text-sm">{getRoleLabel(role)} {nickname}님</div>
        </div>
        <ChevronDown size={16} className="text-gray-400 shrink-0" />
      </div>
    </header>
  );
};

export const AdminRegisterHeader = () => {
  const router = useRouter();
  return (
    <header className="w-full flex h-[88px] font-sans justify-between items-center px-12 bg-white border-b border-[#cdcdcd]">
      <Image 
        src="/logo/admin_header_logo.svg" 
        alt="코매칭 로고" 
        width={140} 
        height={40} 
        className="cursor-pointer" 
        onClick={() => router.push("/adminpage")} 
      />
    </header>
  );
};
