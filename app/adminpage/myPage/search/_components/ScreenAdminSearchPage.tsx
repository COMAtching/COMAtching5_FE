/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AdminHeader } from "../../../_components/AdminHeader";
import { SearchUserComponent } from "../../../_components/SearchUserComponent";
import { Pagination } from "../../../_components/Pagination";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useUserList, useSearchUsers } from "@/hooks/useAdminManagement";

export default function ScreenAdminSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [selectedSort, setSelectedSort] = useState("50명씩 정렬");
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1);

  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;

  const pageSize =
    selectedSort === "50명씩 정렬"
      ? 50
      : selectedSort === "10명씩 정렬"
        ? 10
        : 5;

  const { data: listResponse, isLoading: isListLoading } = useUserList(
    currentPage - 1,
    pageSize,
  );
  const searchMutation = useSearchUsers();

  useEffect(() => {
    if (listResponse && !searchQuery) {
      setTimeout(() => {
        setUserData(listResponse.data.content);
        setTotalPage(listResponse.data.page.totalPages);
      }, 0);
    }
  }, [listResponse, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = async () => {
    if (searchQuery) {
      const searchType = searchQuery.includes("@") ? "email" : "username";
      try {
        const data = await searchMutation.mutateAsync({
          searchType,
          keyword: searchQuery,
        });
        setUserData(data.data.content);
        setTotalPage(1); // Usually search results are single page or differently handled by API
        setCurrentPage(1);
      } catch (error) {
        console.error("Search failed", error);
        setUserData([]);
      }
    } else {
      // If empty, will revert to paginated list due to useEffect on listResponse
      setCurrentPage(1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const isLoading = isListLoading || searchMutation.isPending;

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
        <div className="flex w-full flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)]">
          <div className="text-[32px] font-bold text-black">가입자 목록</div>
          <div className="text-base font-medium text-[#858585]">
            가나다순 정렬
          </div>

          <div className="flex min-h-[81px] flex-wrap items-center justify-end gap-2">
            <SortButton
              label="50명씩 정렬"
              isSelected={selectedSort === "50명씩 정렬"}
              onClick={() => handleSortChange("50명씩 정렬")}
            />
            <SortButton
              label="10명씩 정렬"
              isSelected={selectedSort === "10명씩 정렬"}
              onClick={() => handleSortChange("10명씩 정렬")}
            />
            <SortButton
              label="5명씩 정렬"
              isSelected={selectedSort === "5명씩 정렬"}
              onClick={() => handleSortChange("5명씩 정렬")}
            />

            <div className="relative ml-4 flex h-[53px] w-full items-center border-b border-[#999] md:w-[347px]">
              <input
                type="text"
                placeholder="닉네임 또는 이메일로 검색하세요."
                className="w-full bg-transparent text-center text-2xl font-semibold text-[#808080] outline-none placeholder:text-2xl placeholder:text-[#b3b3b3]"
                onKeyDown={handleKeyDown}
                onChange={handleSearchChange}
                value={searchQuery}
              />
              <div
                className="absolute right-0 flex h-12 w-12 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
                onClick={handleSearchClick}
              >
                <Search size={28} className="text-[#808080]" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col">
            {isLoading ? (
              <div className="flex justify-center p-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff775e]"></div>
              </div>
            ) : userData.length > 0 ? (
              userData.map((user, idx) => (
                <SearchUserComponent
                  key={idx}
                  email={user.email}
                  nickname={user.username}
                  uuid={user.uuid}
                />
              ))
            ) : (
              <div className="py-20 text-center text-xl font-medium text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>

        {!searchQuery && (
          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}

const SortButton = ({ label, isSelected, onClick }: any) => (
  <button
    onClick={onClick}
    className={`h-12 w-32 rounded-lg px-[10px] py-3 text-[18px] font-bold text-white shadow-sm transition-all ${
      isSelected ? "bg-[#ff7752]" : "bg-[#999] hover:bg-gray-400"
    }`}
  >
    {label}
  </button>
);
