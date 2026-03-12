"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
interface PaginationProps {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  totalPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
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
    <div className="flex items-center gap-4 py-6 font-sans">
      <button
        onClick={handlePrevGroup}
        className="text-[#828282] transition-colors hover:text-black hover:opacity-70 disabled:opacity-30 disabled:hover:text-[#828282]"
        disabled={startPage <= 1}
      >
        <ChevronsLeft size={28} />
      </button>
      <button
        onClick={handlePrevPage}
        className="text-[#828282] transition-colors hover:text-black hover:opacity-70 disabled:opacity-30 disabled:hover:text-[#828282]"
        disabled={currentPage <= 1}
      >
        <ChevronLeft size={28} />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold transition-all ${
            currentPage === page
              ? "bg-[#ff775e] text-white"
              : "bg-white text-[#d9d9d9] hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        className="text-[#828282] transition-colors hover:text-black hover:opacity-70 disabled:opacity-30 disabled:hover:text-[#828282]"
        disabled={currentPage >= totalPage}
      >
        <ChevronRight size={28} />
      </button>
      <button
        onClick={handleNextGroup}
        className="text-[#828282] transition-colors hover:text-black hover:opacity-70 disabled:opacity-30 disabled:hover:text-[#828282]"
        disabled={endPage >= totalPage}
      >
        <ChevronsRight size={28} />
      </button>
    </div>
  );
};
