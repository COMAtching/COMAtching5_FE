"use client";
import React, { useState, useEffect } from "react";
import MainHeader from "./MainHeader";
import MyCoinSection from "./MyCoinSection";
import {
  QAButton,
  MatchingButton,
  SearchMyListButton,
} from "./FooterButtonList";

import BusinessInfo from "@/components/common/BusinessInfo";
import NoticeSection from "./NoticeSection";
import ContactUserProfile from "./ContactUserProfile";
import { ProfileData } from "@/lib/types/profile";
import ChargeRequestWaiting from "./ChargeRequestWaiting";

const ScreenMainPage = () => {
  // 실제 서비스 시에는 서버에서 받아온 데이터(notice)가 있는지 여부에 따라 렌더링을 결정할 수 있습니다.
  const noticeData = {
    id: "match-notice-001", // 공지사항 고유 ID (데이터를 받아올 때 id가 포함되어 있다고 가정)
    title: "매칭 안내문",
    detail:
      "현재 많은 수요로 인해 일부 유형에 이용자가 몰리는 현상이 일어나고 있습니다. 원하는 유형이 나오지 않을 수도 있으니 이 점 양해 부탁드립니다. 코매칭을 이용해 주셔서 감사합니다.",
  };

  const [isNoticeVisible, setIsNoticeVisible] = useState(false);

  useEffect(() => {
    // 로컬스토리지에 해당 공지 ID가 저장되어 있는지 확인
    const confirmed = localStorage.getItem(`notice_confirmed_${noticeData.id}`);
    if (!confirmed) {
      // 컴포넌트 마운트 직후 상태 변경으로 인한 cascading render 린트 에러 방지를 위해 비동기 처리
      const timeoutId = setTimeout(() => setIsNoticeVisible(true), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [noticeData.id]);

  const handleNoticeClose = () => {
    // 확인 버튼 클릭 시 로컬스토리지에 해당 공지 ID 저장
    localStorage.setItem(`notice_confirmed_${noticeData.id}`, "true");
    setIsNoticeVisible(false);
  };

  // 실제 서비스 시에는 서버에서 받아온 데이터(profiles)를 넘겨줍니다.
  const mockProfileData: ProfileData[] = [
    {
      memberId: 1,
      nickname: "겨울이오길",
      birthDate: "2004-01-01",
      major: "정보통신전자공학부",
      mbti: "ENTP",
      contactFrequency: "NORMAL",
      hobbies: [{ name: "🎸 인디음악", category: "음악" }],
      profileImageUrl: "/main/cat.png",
      socialAccountId: "winterizcoming_",
    },
    {
      memberId: 2,
      nickname: "코매칭짱",
      birthDate: "2002-05-15",
      major: "컴퓨터정보공학부",
      mbti: "INFJ",
      contactFrequency: "FREQUENT",
      hobbies: [{ name: "🎬 영화감상", category: "문화" }],
      profileImageUrl: "/main/dog.png",
      socialType: "INSTAGRAM",
      socialAccountId: "comatching_king",
    },
    {
      memberId: 3,
      nickname: "카카오톡유저",
      birthDate: "2001-10-20",
      major: "경영학과",
      mbti: "ENFP",
      contactFrequency: "NORMAL",
      hobbies: [{ name: "☕ 카페투어", category: "일상" }],
      profileImageUrl: "/main/cat.png",
      socialType: "KAKAO",
      socialAccountId: "kakao_kim",
    },
    {
      memberId: 4,
      nickname: "봄날의햇살",
      birthDate: "2003-03-21",
      major: "산업디자인학과",
      mbti: "ISFP",
      contactFrequency: "RARE",
      hobbies: [{ name: "🎨 그림그리기", category: "예술" }],
      profileImageUrl: "/main/cat.png",
      socialAccountId: "",
    },
    {
      memberId: 5,
      nickname: "밤하늘별",
      birthDate: "2000-08-12",
      major: "천문학과",
      mbti: "INTP",
      contactFrequency: "NORMAL",
      hobbies: [{ name: "🔭 별보기", category: "자연" }],
      profileImageUrl: "/main/dog.png",
      socialType: "INSTAGRAM",
      socialAccountId: "nightsky_star",
    },
    {
      memberId: 6,
      nickname: "운동좋아",
      birthDate: "2001-06-05",
      major: "체육교육과",
      mbti: "ESTP",
      contactFrequency: "FREQUENT",
      hobbies: [{ name: "⚽ 축구", category: "스포츠" }],
      profileImageUrl: "/main/cat.png",
      socialAccountId: "",
    },
    {
      memberId: 7,
      nickname: "책벌레",
      birthDate: "2002-11-30",
      major: "국어국문학과",
      mbti: "ISTJ",
      contactFrequency: "RARE",
      hobbies: [{ name: "📚 독서", category: "문화" }],
      profileImageUrl: "/main/dog.png",
      socialType: "INSTAGRAM",
      socialAccountId: "bookworm_kr",
    },
  ];

  return (
    <section className="flex min-h-dvh flex-col items-center gap-4 px-4 pb-4">
      <MainHeader />
      <MyCoinSection />
      <ChargeRequestWaiting />
      {isNoticeVisible && noticeData && (
        <NoticeSection
          title={noticeData.title}
          detail={noticeData.detail}
          onClose={handleNoticeClose}
        />
      )}
      {/* <NoContactSection /> */}
      <ContactUserProfile profiles={mockProfileData} />
      <MatchingButton />
      <div className="flex w-full gap-2">
        <SearchMyListButton />
        <QAButton />
      </div>
      <BusinessInfo />
    </section>
  );
};

export default ScreenMainPage;
