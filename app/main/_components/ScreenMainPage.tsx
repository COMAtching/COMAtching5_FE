"use client";
import React, { useState } from "react";
import MainHeader from "./MainHeader";
import MyCoinSection from "./MyCoinSection";
import NoContactSection from "./NoContactSection";
import {
  GuideBookButton,
  MatchingButton,
  SearchMyListButton,
} from "./FooterButtonList";

import BusinessInfo from "@/components/common/BusinessInfo";
import NoticeSection from "./NoticeSection";
import ContactUserProfile from "./ContactUserProfile";
import { ProfileData } from "@/lib/types/profile";

const ScreenMainPage = () => {
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);

  // 실제 서비스 시에는 서버에서 받아온 데이터(notice)가 있는지 여부에 따라 렌더링을 결정할 수 있습니다.
  const noticeData = {
    title: "매칭 안내문",
    detail:
      "현재 많은 수요로 인해 일부 유형에 이용자가 몰리는 현상이 일어나고 있습니다. 원하는 유형이 나오지 않을 수도 있으니 이 점 양해 부탁드립니다. 코매칭을 이용해 주셔서 감사합니다.",
  };

  // 실제 서비스 시에는 서버에서 받아온 데이터(profiles)를 넘겨줍니다.
  const mockProfileData: ProfileData[] = [
    {
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
      nickname: "코매칭짱",
      birthDate: "2002-05-15",
      major: "컴퓨터정보공학부",
      mbti: "INFJ",
      contactFrequency: "FREQUENT",
      hobbies: [{ name: "🎬 영화감상", category: "문화" }],
      profileImageUrl: "/main/dog.png",
      socialAccountId: "comatching_king",
    },
  ];

  return (
    <section className="flex min-h-dvh flex-col items-center gap-4 px-4 pb-4">
      <MainHeader />
      <MyCoinSection />
      {isNoticeVisible && noticeData && (
        <NoticeSection
          title={noticeData.title}
          detail={noticeData.detail}
          onClose={() => setIsNoticeVisible(false)}
        />
      )}
      {/* <NoContactSection /> */}
      <ContactUserProfile profiles={mockProfileData} />
      <MatchingButton />
      <div className="flex w-full gap-2">
        <SearchMyListButton />
        <GuideBookButton />
      </div>
      <BusinessInfo />
    </section>
  );
};

export default ScreenMainPage;
