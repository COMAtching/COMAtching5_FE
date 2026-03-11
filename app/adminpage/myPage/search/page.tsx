"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminHeader } from "../../_components/AdminHeader";
import { SearchUserComponent } from "../../_components/SearchUserComponent";
import { Pagination } from "../../_components/Pagination";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useUserList, useSearchUsers } from "@/hooks/useAdminManagement";

export default function AdminSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [selectedSort, setSelectedSort] = useState("50명씩 정렬");
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  
  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;

  const pageSize = selectedSort === "50명씩 정렬" ? 50 : selectedSort === "10명씩 정렬" ? 10 : 5;

  const { data: listResponse, isLoading: isListLoading } = useUserList(currentPage - 1, pageSize);
  const searchMutation = useSearchUsers();

  useEffect(() => {
    if (listResponse && !searchQuery) {
      setUserData(listResponse.data.content);
      setTotalPage(listResponse.data.page.totalPages);
    }
  }, [listResponse, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = async () => {
    if (searchQuery) {
      const searchType = searchQuery.includes("@") ? "email" : "username";
      try {
        const data = await searchMutation.mutateAsync({ searchType, keyword: searchQuery });
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
      
      <main className="p-6 md:px-[max(5vw,20px)] flex flex-col items-center gap-4">
        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] w-full p-6 flex flex-col gap-2">
          <div className="text-[32px] font-bold text-black">가입자 목록</div>
          <div className="text-base font-medium text-[#858585]">가나다순 정렬</div>
          
          <div className="flex flex-wrap items-center justify-end gap-2 min-h-[81px]">
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
            
            <div className="relative flex items-center border-b border-[#999] w-full md:w-[347px] h-[53px] ml-4">
              <input
                type="text"
                placeholder="닉네임 또는 이메일로 검색하세요."
                className="w-full text-center text-[#808080] text-2xl font-semibold outline-none bg-transparent placeholder:text-[#b3b3b3] placeholder:text-2xl"
                onKeyDown={handleKeyDown}
                onChange={handleSearchChange}
                value={searchQuery}
              />
              <div 
                className="absolute right-0 w-12 h-12 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleSearchClick}
              >
                <Image src="/logo/search-logo.svg" alt="Search" width={35} height={35} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col">
            {isLoading ? (
              <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff775e]"></div>
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
              <div className="text-center py-20 text-gray-500 text-xl font-medium">
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
    className={`px-[10px] py-3 w-32 h-12 rounded-lg text-white text-[18px] font-bold shadow-sm transition-all ${
      isSelected ? "bg-[#ff7752]" : "bg-[#999] hover:bg-gray-400"
    }`}
  >
    {label}
  </button>
);
