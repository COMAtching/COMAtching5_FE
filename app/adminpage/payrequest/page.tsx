"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminHeader } from "../_components/AdminHeader";
import { RequestUserComponent } from "../_components/RequestUserComponent";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useChargeList } from "@/hooks/useAdminManagement";

export default function AdminPayRequestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;

  const { data: chargeResponse, isLoading, refetch } = useChargeList();
  const userData = chargeResponse?.data || [];

  useEffect(() => {
    if (userData) {
      if (searchQuery) {
        setFilteredData(
          userData.filter((item: any) =>
            item.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredData(userData);
      }
    }
  }, [userData, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Filter logic is handled by useEffect
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
      
      <main className="p-6 md:px-[max(5vw,20px)] flex flex-col items-center gap-4">
        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] w-full p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-[32px] font-bold text-black">충전 요청 목록</div>
              <div className="text-base font-medium text-[#858585]">
                유저로부터 이름, 아이디, 입금 내역 확인해서 충전을 진행합니다.
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative border-b border-[#999] w-full md:w-[347px] h-[53px]">
                <input
                  type="text"
                  placeholder="닉네임으로 검색하세요."
                  className="w-full text-center text-[#808080] text-2xl font-semibold outline-none bg-transparent placeholder:text-[#b3b3b3]"
                  onKeyDown={handleKeyDown}
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
                <div className="absolute right-0 w-12 h-12 flex items-center justify-center cursor-pointer hover:opacity-70">
                  <Image src="/logo/search-logo.svg" alt="Search" width={35} height={35} />
                </div>
              </div>
              
              <div 
                className="cursor-pointer hover:rotate-180 transition-transform duration-500"
                onClick={() => refetch()}
              >
                <Image src="/logo/refresh-button.svg" alt="Refresh" width={40} height={40} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {isLoading ? (
              <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff775e]"></div>
              </div>
            ) : filteredData.length > 0 ? (
              filteredData.map((data, i) => (
                <RequestUserComponent {...data} key={i} onUpdate={refetch} />
              ))
            ) : (
              <div className="text-center py-20 text-gray-500 text-xl font-medium">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
