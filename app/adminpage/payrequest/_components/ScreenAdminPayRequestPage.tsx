/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { AdminHeader } from "../../_components/AdminHeader";
import { RequestUserComponent } from "../../_components/RequestUserComponent";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useChargeList } from "@/hooks/useAdminManagement";

export default function ScreenAdminPayRequestPage() {
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
        setTimeout(() => {
          setFilteredData(
            userData.filter((item: any) =>
              item.username.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          );
        }, 0);
      } else {
        setTimeout(() => setFilteredData(userData), 0);
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

      <main className="flex flex-col items-center gap-4 p-6 md:px-[max(5vw,20px)]">
        <div className="flex w-full flex-col gap-6 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)]">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="flex flex-col gap-2">
              <div className="text-[32px] font-bold text-black">
                충전 요청 목록
              </div>
              <div className="text-base font-medium text-[#858585]">
                유저로부터 이름, 아이디, 입금 내역 확인해서 충전을 진행합니다.
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-[53px] w-full border-b border-[#999] md:w-[347px]">
                <input
                  type="text"
                  placeholder="닉네임으로 검색하세요."
                  className="w-full bg-transparent text-center text-2xl font-semibold text-[#808080] outline-none placeholder:text-[#b3b3b3]"
                  onKeyDown={handleKeyDown}
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
                <div className="absolute right-0 flex h-12 w-12 cursor-pointer items-center justify-center hover:opacity-70">
                  <Search size={28} className="text-[#808080]" />
                </div>
              </div>

              <div
                className="cursor-pointer transition-transform duration-500 hover:rotate-180"
                onClick={() => refetch()}
              >
                <div className="rounded-full bg-[#f0f0f0] p-2">
                  <RefreshCw size={24} className="text-[#808080]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {isLoading ? (
              <div className="flex justify-center p-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff775e]"></div>
              </div>
            ) : filteredData.length > 0 ? (
              filteredData.map((data, i) => (
                <RequestUserComponent {...data} key={i} onUpdate={refetch} />
              ))
            ) : (
              <div className="py-20 text-center text-xl font-medium text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
