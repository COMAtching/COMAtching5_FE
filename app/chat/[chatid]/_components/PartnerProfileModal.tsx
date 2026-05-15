"use client";

import React from "react";
import Image from "next/image";
import { X, Star, Send } from "lucide-react";
import { MatchingPartner } from "@/hooks/useMatchingHistory";
import {
  getProfileImageUrl,
  getContactFrequencyLabel,
} from "@/lib/utils/profile";
import { cn } from "@/lib/utils";
import {
  findWithEmoji,
  ALL_HOBBIES,
  ALL_ADVANTAGES,
} from "@/lib/utils/matching";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PartnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: MatchingPartner;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const PartnerProfileModal = ({
  isOpen,
  onClose,
  partner,
  isFavorite,
  onFavoriteToggle,
}: PartnerProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30 backdrop-blur-[2px]" />
        <DialogContent
          className="flex flex-col items-center justify-center border-none bg-transparent p-0 shadow-none outline-none focus:ring-0"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">상대방 프로필</DialogTitle>
          <DialogDescription className="sr-only">
            상대방의 닉네임, 나이, MBTI, 관심사 등의 상세 정보를 확인합니다.
          </DialogDescription>
          {/* 카드 + 닫기 버튼 그룹 */}
          <div className="relative flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] flex-col items-center gap-4">
            {/* 모달 컨테이너 (MatchingListCard 스타일 계승) */}
            <div className="flex w-full flex-col overflow-hidden rounded-[24px] shadow-[0_0_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
              {/* 카드 본체 (내부 내용에 따라 높이 조절, 최대 높이시 스크롤) */}
              <div className="scrollbar-hide flex w-full flex-col overflow-y-auto border border-b-0 border-white/30 bg-white px-4 pt-6 pb-4">
                {/* 헤더 */}
                <div className="flex w-full items-center gap-4">
                  <div className="border-color-gray-0 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white/0 p-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#D9D9D9]">
                      <Image
                        src={getProfileImageUrl(
                          partner.profileImageUrl,
                          partner.gender,
                        )}
                        alt="프로필"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-1">
                    <span className="typo-12-600 text-[#777777]">
                      내가 뽑은 사람
                    </span>
                    <span className="typo-16-600 text-color-text-black">
                      {partner.nickname || "익명"}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle?.();
                      }}
                      className="flex h-4 w-4 items-center justify-center"
                    >
                      <Star
                        size={16}
                        className={cn(
                          "transition-colors",
                          isFavorite
                            ? "fill-[#FF4D61] text-[#FF4D61]"
                            : "text-color-gray-500",
                        )}
                      />
                    </button>
                    <button
                      onClick={onClose}
                      className="flex h-4 w-4 items-center justify-center"
                    >
                      <Send size={16} className="text-color-gray-500" />
                    </button>
                    <div className="flex h-4 w-4 flex-col items-center justify-center gap-[2px]">
                      <div className="bg-color-gray-500 h-[2.57px] w-[2.57px] rounded-full" />
                      <div className="bg-color-gray-500 h-[2.57px] w-[2.57px] rounded-full" />
                      <div className="bg-color-gray-500 h-[2.57px] w-[2.57px] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* 스펙 섹션 (나이, MBTI, 연락빈도) */}
                <div className="mt-4 mb-3 flex w-full items-start gap-2">
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="typo-12-600 text-[#777777]">나이</span>
                    <span className="typo-16-700 text-color-text-black">
                      {partner.age || "??"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="typo-12-600 text-[#777777]">MBTI</span>
                    <span className="typo-16-700 text-color-text-black">
                      {partner.mbti}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="typo-12-600 whitespace-nowrap text-[#777777]">
                      연락빈도
                    </span>
                    <span className="typo-16-700 text-color-text-black">
                      {getContactFrequencyLabel(partner.contactFrequency)}
                    </span>
                  </div>
                </div>

                {/* 상세 정보 섹션 (CardDetails 스타일) */}
                <div className="flex w-full flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="typo-12-600 text-[#777777]">관심사</span>
                    <div className="flex flex-wrap gap-1">
                      {partner.hobbies?.map((h) => (
                        <div
                          key={h.name}
                          className="flex h-8 items-center justify-center gap-1.5 rounded-full border border-[#DFDFDF] bg-[#B3B3B31A] px-3 py-2 backdrop-blur-[50px]"
                        >
                          <span className="typo-14-500 text-color-text-black whitespace-nowrap">
                            {findWithEmoji(ALL_HOBBIES, h.name)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="typo-12-600 text-[#777777]">장점</span>
                    <div className="flex flex-wrap gap-1">
                      {partner.tags?.map((t) => (
                        <div
                          key={t.tag}
                          className="flex h-8 items-center justify-center gap-1.5 rounded-full border border-[#DFDFDF] bg-[#B3B3B31A] px-3 py-2 backdrop-blur-[50px]"
                        >
                          <span className="typo-14-500 text-color-text-black whitespace-nowrap">
                            {findWithEmoji(ALL_ADVANTAGES, t.tag)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="typo-12-600 text-[#777777]">
                      좋아하는 노래
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎵</span>
                      <span className="typo-16-600 text-color-text-black">
                        {partner.song || "아직 없어요!"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="typo-12-600 text-[#777777]">
                      나를 소개하는 한마디
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-base">💬</span>
                      <span className="typo-16-600 text-color-text-black">
                        {partner.intro}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 그라디언트 푸터 */}
              <footer
                style={{
                  background:
                    "linear-gradient(93.29deg, #FF775E 0.01%, #FF4D61 47.4%, #E83ABC 100%)",
                }}
                className="flex h-[42px] w-full items-center px-4 backdrop-blur-[50px]"
              >
                {partner.socialType === "KAKAO" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/sns/kakao-sns.svg"
                      alt="kakao"
                      width={16}
                      height={16}
                    />
                    <span className="typo-15-600 text-color-text-white">
                      {partner.socialAccountId}
                    </span>
                  </div>
                ) : (
                  <span className="typo-15-600 text-color-text-white">
                    {partner.socialAccountId
                      ? `@${partner.socialAccountId}`
                      : "비공개"}
                  </span>
                )}
              </footer>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0px_0px_16px_rgba(0,0,0,0.16)] transition-transform active:scale-95"
            >
              <X size={18} className="stroke-[3px] text-[#1A1A1A]" />
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default PartnerProfileModal;
