import React, { useState } from "react";
import { ChevronDown, Megaphone } from "lucide-react";
import Button from "@/components/ui/Button";

interface NoticeSectionProps {
  title: string;
  detail: string;
}

const NoticeSection = ({ title, detail }: NoticeSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  console.log("📢 [NoticeSection Component] title:", title);
  console.log("📢 [NoticeSection Component] detail:", detail);

  return (
    <section
      className={`flex w-full flex-col justify-center border border-white/30 bg-white/50 shadow-[0_0_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px] transition-all duration-300 ease-in-out ${
        isExpanded
          ? "gap-4 rounded-[24px] p-6"
          : "gap-0 rounded-[16px] px-5 py-3"
      }`}
    >
      {/* Header: 클릭 시 접힘/펼침 토글 */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full cursor-pointer items-center justify-between transition-all duration-300 ${
          isExpanded ? "border-b border-[#F0F0F0] pb-3" : "border-none pb-0"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Megaphone className="h-4 w-4 shrink-0 text-[#E83ABC]" />
          <span className="typo-16-600 truncate font-semibold text-[#373737]">
            {title}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#858585] transition-transform duration-300 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* 부드러운 아코디언 높이 + 페이드 애니메이션 (Grid transition) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-hidden">
          <p className="typo-14-400 w-full pt-2 text-left leading-[140%] tracking-[-0.02em] whitespace-pre-wrap text-[#666666]">
            {detail}
          </p>

          <Button
            style={{
              background:
                "conic-gradient(from -36.07deg at 64.06% -102.34%, #E83ABC 0deg, rgba(255, 119, 94, 0.1) 0.04deg, rgba(255, 77, 97, 0.6) 169.2deg, #E83ABC 360deg)",
            }}
            className="typo-14-600 h-9 w-full border-none text-white"
            shadow={true}
            onClick={(e) => {
              e.stopPropagation(); // 헤더 클릭 토글 이벤트 버블링 방지
              setIsExpanded(false);
            }}
          >
            공지 접기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;
