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
import ProfileProgressCard from "./ProfileProgressCard";

import {
  useMatchingHistory,
  MatchingPartner,
  MatchingHistoryItem,
} from "@/hooks/useMatchingHistory";
import { useRequestStatus } from "@/hooks/useRequestStatus";
import { useActiveNotices, Notice } from "@/hooks/useActiveNotices";
import { useQueryClient } from "@tanstack/react-query";

const ScreenMainPage = () => {
  const queryClient = useQueryClient();
  const { data: noticesData } = useActiveNotices();
  const { data: historyData, isLoading } = useMatchingHistory();
  const { isPurchasePending } = useRequestStatus();

  useEffect(() => {
    const handleFcmMessage = (event: Event) => {
      console.log("🔔 [MainPage] FCM 알림 수신 -> 실시간 메인 데이터 갱신!");
      queryClient.invalidateQueries({ queryKey: ["chatUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      queryClient.invalidateQueries({ queryKey: ["matchingHistory"] });
    };

    window.addEventListener("fcm-message-received", handleFcmMessage);
    return () => {
      window.removeEventListener("fcm-message-received", handleFcmMessage);
    };
  }, [queryClient]);

  const activeNotice = noticesData?.data?.[0] || null;

  // 매칭 히스토리 데이터에서 파트너 정보를 추출하여 프로필 목록 생성 (탈퇴한 사용자는 메인에서 숨김)
  const allContent = (
    historyData?.pages.flatMap((page) => page?.data?.content || []) ?? []
  ).filter(
    (item) =>
      item.partner?.nickname !== "탈퇴한 사용자" && item.partner?.age !== 57,
  );

  const profileList: ProfileData[] = allContent.map(
    (item: MatchingHistoryItem) => {
      const { partner } = item;
      return {
        chatRoomId: item.chatRoomId,
        memberId: partner.memberId,
        nickname: partner.nickname,
        gender: partner.gender,
        birthDate: partner.birthDate ?? undefined,
        age: partner.age ?? undefined,
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
        historyId: item.historyId,
        favorite: item.favorite,
      };
    },
  );

  return (
    <section className="flex min-h-dvh flex-col items-center gap-4 px-4 pb-4">
      <MainHeader />
      <MyCoinSection />
      <ProfileProgressCard />
      {isPurchasePending && <ChargeRequestWaiting />}
      {activeNotice && (
        <NoticeSection
          title={activeNotice.title}
          detail={activeNotice.content}
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
