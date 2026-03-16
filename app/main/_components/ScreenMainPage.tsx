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
import ProfileSlider from "./ProfileSlider";
import { ProfileData, ContactFrequency } from "@/lib/types/profile";
import ChargeRequestWaiting from "./ChargeRequestWaiting";

import { useMatchingHistory } from "@/hooks/useMatchingHistory";

const ScreenMainPage = () => {
  // 실제 서비스 시에는 서버에서 받아온 데이터(notice)가 있는지 여부에 따라 렌더링을 결정할 수 있습니다.
  const noticeData = {
    id: "match-notice-001", // 공지사항 고유 ID (데이터를 받아올 때 id가 포함되어 있다고 가정)
    title: "매칭 안내문",
    detail:
      "현재 많은 수요로 인해 일부 유형에 이용자가 몰리는 현상이 일어나고 있습니다. 원하는 유형이 나오지 않을 수도 있으니 이 점 양해 부탁드립니다. 코매칭을 이용해 주셔서 감사합니다.",
  };

  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const { data: historyData, isLoading } = useMatchingHistory();

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
  /*
  const mockProfileData: ProfileData[] = [
    {
      memberId: 1,
      nickname: "겨울이오길",
      birthDate: "2004-01-01",
      major: "정보통신전자공학부",
      mbti: "ENTP",
      contactFrequency: "NORMAL",
      hobbies: [
        { name: "🎸 인디음악", category: "음악" },
        { name: "📸 사진찍기", category: "문화" },
      ],
      advantages: ["친절함", "경청하는 태도"],
      profileImageUrl: "/main/cat.png",
      socialAccountId: "winterizcoming_",
    },
    ... (중략)
  ];
  */

  // 매칭 히스토리 데이터에서 파트너 정보를 추출하여 프로필 목록 생성
  const profileList: ProfileData[] =
    historyData?.data.content.map((item) => ({
      ...item.partner,
      // API 응답의 partner 정보를 ProfileData 형식에 맞춤
      nickname: item.partner.nickname,
      birthDate: item.partner.birthDate ?? undefined,
      intro: item.partner.intro ?? undefined,
      profileImageUrl: item.partner.profileImageUrl ?? undefined,
      socialType: item.partner.socialType ?? undefined,
      socialAccountId: item.partner.socialAccountId ?? "",
      contactFrequency: (item.partner.contactFrequency === "자주"
        ? "FREQUENT"
        : item.partner.contactFrequency === "보통"
          ? "NORMAL"
          : "RARE") as ContactFrequency,
    })) || [];

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
      {!isLoading && <ProfileSlider profiles={profileList} />}
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
