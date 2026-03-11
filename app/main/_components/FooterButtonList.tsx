import React from "react";

const MatchingButton = () => {
  return (
    <button
      style={{
        background:
          "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #E83ABC 0%, #FF775E 100%) border-box",
      }}
      className="flex h-[13.11vh] w-full flex-col items-center justify-center gap-1 rounded-[24px] border border-transparent backdrop-blur-[50px]"
    >
      <div className="flex items-center gap-2">
        <span className="typo-24-600 text-gray-900">AI 매칭하기</span>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "11px solid #1A1A1A",
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
          }}
        />
      </div>
      <span className="typo-16-500 text-gray-400">
        현재 <span className="text-color-flame-700">740명</span> 참여중이에요!
      </span>
    </button>
  );
};

const SearchMyListButton = () => {
  return <button>Search My List</button>;
};

const GuideBookButton = () => {
  return <button>Guide Book</button>;
};

export { MatchingButton, SearchMyListButton, GuideBookButton };
