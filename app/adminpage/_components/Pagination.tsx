"use client";

import React from "react";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ totalPage, currentPage, onPageChange }: PaginationProps) => {
  const pagePerGroup = 10;
  const currentGroup = Math.floor((currentPage - 1) / pagePerGroup);
  const startPage = currentGroup * pagePerGroup + 1;
  const endPage = Math.min(startPage + pagePerGroup - 1, totalPage);

  const handlePrevGroup = () => {
    onPageChange(Math.max(1, startPage - 1));
  };

  const handleNextGroup = () => {
    onPageChange(Math.min(totalPage, endPage + 1));
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) onPageChange(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex gap-4 items-center font-sans py-6">
      <button
        onClick={handlePrevGroup}
        className="text-[#828282] text-2xl font-bold hover:opacity-70 disabled:opacity-30"
        disabled={startPage <= 1}
      >
        {"<<"}
      </button>
      <button
        onClick={handlePrevPage}
        className="text-[#828282] text-2xl font-bold hover:opacity-70 disabled:opacity-30"
        disabled={currentPage <= 1}
      >
        {"<"}
      </button>
      
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl font-bold transition-all ${
            currentPage === page ? "bg-[#ff775e] text-white" : "bg-white text-[#d9d9d9] hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        className="text-[#828282] text-2xl font-bold hover:opacity-70 disabled:opacity-30"
        disabled={currentPage >= totalPage}
      >
        {">"}
      </button>
      <button
        onClick={handleNextGroup}
        className="text-[#828282] text-2xl font-bold hover:opacity-70 disabled:opacity-30"
        disabled={endPage >= totalPage}
      >
        {">>"}
      </button>
    </div>
  );
};
