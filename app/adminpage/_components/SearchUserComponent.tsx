"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SearchUserProps {
  nickname: string;
  email: string;
  uuid: string;
}

export const SearchUserComponent = ({ nickname, email, uuid }: SearchUserProps) => {
  const router = useRouter();

  return (
    <div className="h-[125px] flex flex-col justify-center border-b border-[#808080] font-sans">
      <div className="h-[29px]">
        <span className="text-[#828282] text-2xl font-medium">Nickname :</span>
        <span className="text-black text-2xl font-semibold ml-2">{nickname}</span>
      </div>
      <div className="h-[48px] flex items-center justify-between">
        <div>
          <span className="text-[#828282] text-2xl font-medium">E-mail :</span>
          <span className="text-[#828282] text-2xl font-bold ml-2">{email}</span>
        </div>
        <button
          onClick={() => router.push(`/adminpage/user/${uuid}`)}
          className="w-[129px] h-12 bg-[#ff775e] text-white text-xl font-bold rounded-lg shadow-sm flex items-center justify-center hover:opacity-90 active:scale-95 transition-all outline-none"
        >
          상세정보 보기
        </button>
      </div>
    </div>
  );
};
