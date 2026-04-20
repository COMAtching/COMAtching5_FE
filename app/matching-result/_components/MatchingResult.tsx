import {
  ALL_ADVANTAGES,
  ALL_HOBBIES,
  findWithEmoji,
} from "@/lib/utils/matching";
import Image from "next/image";
import React from "react";

const MatchingResult = () => {
  // 임시 데이터 (상수에 존재하는 값들로 구성)
  const data = {
    nickname: "겨울이오길",
    major: "정보통신전자공학부",
    age: "21",
    mbti: "ENTP",
    contactFrequency: "보통",
    hobbies: ["축구", "영화감상", "캠핑", "코딩", "게임"],
    strengths: ["다정다감", "유머러스", "계획적"],
    song: "한로로 - 사랑하게 될 거야",
    intro: "친하게 지내요@!🙃",
    instagram: "@winterizcoming_",
  };

  return (
    <div className="mt-6 flex w-full flex-col gap-6 rounded-[24px] border border-white/30 bg-white/50 p-6 shadow-[0px_0px_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      <div className="flex w-full flex-col gap-4">
        {/* Header Section (Frame 2612385) */}
        <div className="flex w-full flex-row items-center gap-4">
          {/* Profile Image (Container + Image (Profile)) */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white/0 p-[2px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="relative h-11 w-11 overflow-hidden rounded-full">
              <Image
                src="/animal/cat_female 1.png"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/* Nickname & Label (Frame 2612933) */}
          <div className="flex flex-col items-start gap-1">
            <span className="typo-12-600 flex items-center text-[#777777]">
              내가 뽑은 사람
            </span>
            <span className="typo-16-600 flex items-center text-black">
              {data.nickname}
            </span>
          </div>
        </div>

        {/* Major Section */}
        <div className="flex w-full flex-col items-start gap-1">
          <span className="typo-12-600 flex items-center text-[#777777]">
            전공
          </span>
          <span className="typo-16-700 flex items-center text-black">
            {data.major}
          </span>
        </div>

        {/* Stats Section (Frame 22) */}
        <div className="flex w-full flex-row items-start gap-2">
          {/* Age (Std_Num) */}
          <div className="flex flex-1 flex-col items-center gap-1">
            <span className="typo-12-600 flex w-full items-center text-[#777777]">
              나이
            </span>
            <span className="typo-16-700 flex w-full items-center text-black">
              {data.age}
            </span>
          </div>
          {/* MBTI (Major) */}
          <div className="flex flex-1 flex-col items-start gap-1">
            <span className="typo-12-600 flex w-full items-center text-[#777777]">
              MBTI
            </span>
            <span className="typo-16-700 flex w-full items-center text-black">
              {data.mbti}
            </span>
          </div>
          {/* Contact (Std_Num) */}
          <div className="flex flex-1 flex-col items-start gap-1">
            <span className="typo-12-600 flex items-center text-[#777777]">
              연락빈도
            </span>
            <span className="typo-16-700 flex w-full items-center text-black">
              {data.contactFrequency}
            </span>
          </div>
        </div>
      </div>

      {/* Hobbies Section */}
      <div className="flex w-full flex-col items-start gap-1">
        <span className="typo-12-600 flex items-center text-[#777777]">
          취미
        </span>
        <div className="flex w-full flex-row flex-wrap items-start gap-1 py-1">
          {data.hobbies.map((hobby) => (
            <div
              key={hobby}
              className="flex h-8 items-center justify-center gap-[10px] rounded-full border border-[#DFDFDF] bg-[#B3B3B3]/10 px-3 py-2 backdrop-blur-[50px]"
            >
              <span className="typo-14-500 text-black">
                {findWithEmoji(ALL_HOBBIES, hobby)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths Section */}
      <div className="flex w-full flex-col items-start gap-1">
        <span className="typo-12-600 flex items-center text-[#777777]">
          장점
        </span>
        <div className="flex w-full flex-row flex-wrap items-start gap-1 py-1">
          {data.strengths.map((strength) => (
            <div
              key={strength}
              className="flex h-8 items-center justify-center gap-[10px] rounded-full border border-[#DFDFDF] bg-[#B3B3B3]/10 px-3 py-2 backdrop-blur-[50px]"
            >
              <span className="typo-14-500 text-black">
                {findWithEmoji(ALL_ADVANTAGES, strength)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Song Section */}
      <div className="flex w-full flex-col items-start gap-1">
        <span className="typo-12-600 flex items-center text-[#777777]">
          좋아하는 노래
        </span>
        <span className="typo-16-700 flex items-center text-black">
          {data.song}
        </span>
      </div>

      {/* Intro Section */}
      <div className="flex w-full flex-col items-start gap-1">
        <span className="typo-12-600 flex items-center text-[#777777]">
          나를 소개하는 한마디
        </span>
        <span className="typo-16-700 flex items-center text-black">
          {data.intro}
        </span>
      </div>

      {/* SNS Section (Contacts) */}
      <div className="flex w-full flex-col items-start gap-1 py-2">
        <span className="typo-12-600 flex w-full items-center justify-center text-center text-[#777777]">
          Instagram
        </span>
        <span className="typo-16-700 flex w-full items-center justify-center text-center text-[#FF4D61]">
          {data.instagram}
        </span>
      </div>
    </div>
  );
};

export default MatchingResult;
