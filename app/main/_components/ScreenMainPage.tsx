"use client";
import React, { useState, useEffect } from "react";
import MainHeader from "./MainHeader";
import {
  QAButton,
  MatchingButton,
  SearchMyListButton,
} from "./FooterButtonList";

import BusinessInfo from "@/components/common/BusinessInfo";
import MyCoinSection from "@/components/common/MyCoinSection";
import NoticeSection from "./NoticeSection";
import ProfileSlider from "./ProfileSlider";
import { ProfileData, ContactFrequency } from "@/lib/types/profile";
import ChargeRequestWaiting from "./ChargeRequestWaiting";
import NoContactSection from "./NoContactSection";

import {
  useMatchingHistory,
  MatchingPartner,
} from "@/hooks/useMatchingHistory";
import { useRequestStatus } from "@/hooks/useRequestStatus";
import { useActiveNotices, Notice } from "@/hooks/useActiveNotices";

const ScreenMainPage = () => {
  const [noticePopup, setNoticePopup] = useState<{
    active: Notice | null;
    isVisible: boolean;
  }>({ active: null, isVisible: false });

  const { data: noticesData } = useActiveNotices();
  const { data: historyData, isLoading } = useMatchingHistory();
  const { isPurchasePending } = useRequestStatus();

  useEffect(() => {
    if (noticesData?.data && noticesData.data.length > 0) {
      const firstUnconfirmed = noticesData.data.find(
        (notice) =>
          !localStorage.getItem(`notice_confirmed_${notice.noticeId}`),
      );

      if (firstUnconfirmed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNoticePopup({ active: firstUnconfirmed, isVisible: true });
      } else {
         
        setNoticePopup((prev) =>
          prev.isVisible ? { ...prev, isVisible: false } : prev,
        );
      }
    } else {
       
      setNoticePopup((prev) =>
        prev.isVisible ? { ...prev, isVisible: false } : prev,
      );
    }
  }, [noticesData]);

  const handleNoticeClose = () => {
    if (noticePopup.active) {
      localStorage.setItem(
        `notice_confirmed_${noticePopup.active.noticeId}`,
        "true",
      );
      setNoticePopup((prev) => ({ ...prev, isVisible: false }));
    }
  };

  // 매칭 히스토리 데이터에서 파트너 정보를 추출하여 프로필 목록 생성
  const allContent =
    historyData?.pages.flatMap((page) => page?.data?.content || []) ?? [];

  const profileList: ProfileData[] = allContent.map(
    ({ partner }: { partner: MatchingPartner }) => ({
      memberId: partner.memberId,
      nickname: partner.nickname,
      gender: partner.gender,
      birthDate: partner.birthDate ?? undefined,
      mbti: partner.mbti,
      intro: partner.intro ?? undefined,
      profileImageUrl:
        partner.profileImageUrl ?? partner.profileImageKey ?? undefined,
      socialType: partner.socialType ?? undefined,
      socialAccountId: partner.socialAccountId ?? "",
      university: partner.university,
      major: partner.major,
      contactFrequency: partner.contactFrequency as ContactFrequency,
      hobbies: (partner.hobbies ?? []).map(
        (h: { category: string; name: string }) => h.name,
      ),
      tags: partner.tags ?? undefined,
      song: partner.song ?? undefined,
    }),
  );

  return (
    <section className="flex min-h-dvh flex-col items-center gap-4 px-4 pb-4">
      <MainHeader />
      <MyCoinSection />
      {isPurchasePending && <ChargeRequestWaiting />}
      {noticePopup.isVisible && noticePopup.active && (
        <NoticeSection
          title={noticePopup.active.title}
          detail={noticePopup.active.content}
          onClose={handleNoticeClose}
        />
      )}
      {!isLoading &&
        (profileList.length > 0 ? (
          <ProfileSlider profiles={profileList} />
        ) : (
          <NoContactSection />
        ))}
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
