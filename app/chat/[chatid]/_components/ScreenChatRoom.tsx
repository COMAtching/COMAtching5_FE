"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowUp, ChevronLeft, MoreVertical, UserRound } from "lucide-react";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useMyProfile } from "@/hooks/useProfile";
import { getProfileImageUrl } from "@/lib/utils/profile";
import {
  useUpdateFavorite,
  type MatchingPartner,
} from "@/hooks/useMatchingHistory";
import { cn } from "@/lib/utils";
import PartnerProfileModal from "./PartnerProfileModal";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useChatMemberProfile } from "@/hooks/useChatMemberProfile";

type ScreenChatRoomProps = {
  chatId: string;
};

type ChatMessage = {
  id: string;
  sender: "me" | "other";
  text: string;
  time: string;
  readCount: number;
  createdAt: string;
};

const formatMessageTime = (isoString: string) => {
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const ChatDateDivider = ({ label }: { label: string }) => {
  return (
    <div className="flex w-full justify-center">
      <span className="rounded-full bg-[#E5E5E5] px-6 py-1 text-xs text-[#808080]">
        {label}
      </span>
    </div>
  );
};

const IncomingMessage = ({
  message,
  nickname,
  profileImageUrl,
}: {
  message: ChatMessage;
  nickname?: string;
  profileImageUrl?: string;
}) => {
  return (
    <div className="flex w-full items-start gap-2">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
        <Image
          src={getProfileImageUrl(profileImageUrl, "FEMALE")}
          alt="프로필"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="typo-12-500 text-[#1A1A1A]">{nickname || "..."}</span>
        <div className="flex items-end gap-2">
          <div className="max-w-55 rounded-3xl rounded-bl-xl bg-white px-3 py-2 text-sm text-[#333333] shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
            {message.text}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
            <span>{message.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OutgoingMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="flex w-full items-end justify-end gap-2">
      <div className="flex flex-col items-end gap-1 text-xs text-[#999999]">
        <span className="text-[#B3B3B3]">{message.time}</span>
      </div>
      <div className="max-w-55 rounded-3xl rounded-br-xl bg-[linear-gradient(125.6deg,#FF4D61_22.6%,#FF775E_88.94%)] px-3 py-2 text-sm text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
        {message.text}
      </div>
    </div>
  );
};

export default function ScreenChatRoom({ chatId }: ScreenChatRoomProps) {
  const router = useRouter();
  const [messageText, setMessageText] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 0. 내 프로필 정보 가져오기 (현재 사용자 ID 확인용)
  const { data: myProfile } = useMyProfile();
  const currentUserId = myProfile?.data.memberId;

  // 즐겨찾기 토글 mutation
  const updateFavorite = useUpdateFavorite();

  // 0-1. 현재 채팅방 정보 가져오기
  const { data: chatRooms } = useChatRooms();
  const currentRoom = chatRooms?.find((r) => r.id === chatId);
  const partnerMemberId = currentRoom?.otherUser.memberId;

  // 0-2. 상대방 경량 프로필 API 호출
  const { data: profileRes } = useChatMemberProfile(partnerMemberId);
  const opponentProfile = profileRes?.data;

  const mergedPartner = useMemo(() => {
    return {
      memberId: partnerMemberId || 999,
      email: "winter@example.com",
      nickname:
        opponentProfile?.nickname ||
        currentRoom?.otherUser.nickname ||
        "겨울이오길",
      age: currentRoom?.otherUser.age || 20,
      gender: currentRoom?.otherUser.gender || "FEMALE",
      birthDate: "2004-01-01",
      major:
        opponentProfile?.major ||
        currentRoom?.otherUser.major ||
        "정보통신전자공학부",
      university: currentRoom?.otherUser.university || "가톨릭대학교",
      mbti: "ENTP",
      contactFrequency: "NORMAL",
      profileImageUrl:
        opponentProfile?.profileImageUrl ||
        currentRoom?.otherUser.profileImageUrl ||
        "animal_cat",
      profileImageKey: null,
      intro: "친하게 지내요! 😆",
      song: "한로로 - 사랑하게 될 거야",
      hobbies: [
        { category: "취미", name: "독서" },
        { category: "취미", name: "영화감상" },
        { category: "취미", name: "음악감상" },
      ],
      tags: [{ tag: "친절한" }, { tag: "열정적인" }],
      intros: [],
      socialType: "INSTAGRAM",
      socialAccountId: "winterizcoming_",
    } as MatchingPartner;
  }, [opponentProfile, currentRoom, partnerMemberId]);

  const handleFavoriteToggle = () => {
    if (!opponentProfile?.historyId) return;

    updateFavorite.mutate({
      historyId: opponentProfile.historyId,
      favorite: !opponentProfile.favorite,
    });
  };

  // 1. 과거 대화 내역 가져오기 (API)
  const { data: historyData } = useChatMessages(chatId);

  // 2. 소켓 연결 및 실시간 메시지 수신
  const { messages: socketMessages, sendMessage } = useChatRoomSocket(chatId);

  // DEBUG: 채팅방 데이터 로그
  useEffect(() => {
    if (historyData) {
      console.log("📡 [Chat Room History Data]:", historyData);
    }
    if (socketMessages.length > 0) {
      console.log("🔌 [Chat Room Socket Messages]:", socketMessages);
    }
    if (opponentProfile) {
      console.log("👤 [Chat Opponent Real-time Profile API]:", opponentProfile);
    }
    if (mergedPartner) {
      console.log("💎 [Chat Opponent Merged Partner Object]:", mergedPartner);
    }
  }, [historyData, socketMessages, opponentProfile, mergedPartner]);

  // 3. 전체 메시지 목록 변환 및 중복 제거 (Derived State)
  const messages = useMemo(() => {
    // API 데이터와 소켓 데이터를 합침
    const combined = [...(historyData?.data || [])];

    // 소켓으로 온 메시지 중 이미 내역에 있는 건 제외하고 추가
    socketMessages.forEach((socketMsg) => {
      if (!combined.some((m) => m.id === socketMsg.id)) {
        combined.push(socketMsg);
      }
    });

    // 화면 표시용 타입으로 변환
    return combined.map((m) => ({
      id: m.id,
      sender: m.senderId === currentUserId ? "me" : "other",
      text: m.content,
      time: formatMessageTime(m.createdAt),
      readCount: m.readCount,
      createdAt: m.createdAt,
    })) as ChatMessage[];
  }, [historyData, socketMessages, currentUserId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    // 소켓으로 전송 (senderId는 서버에서 자동 주입)
    sendMessage(messageText);

    // 입력창 초기화
    setMessageText("");
  };

  const isSendEnabled = messageText.trim().length > 0;

  return (
    <main className="flex h-dvh w-full flex-col items-center overflow-hidden px-4 pt-10">
      <header className="fixed top-0 right-0 left-0 z-20 px-4 py-2">
        <div className="absolute inset-0 -z-10 bg-[#F5F5F5]/80 backdrop-blur-[15px]" />
        <div className="pointer-events-none absolute top-full left-0 h-8 w-full bg-[#F5F5F5]/60 mask-[linear-gradient(to_bottom,black,transparent)] backdrop-blur-[10px]" />
        <div className="mx-auto flex h-12 w-full max-w-93.75 items-center gap-4">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => router.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/60 shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]"
          >
            <ChevronLeft className="h-5 w-5 text-[#1A1A1A]" />
          </button>

          <div className="flex flex-1 flex-col justify-center">
            <span className="typo-14-600 text-[#1A1A1A]">
              {opponentProfile?.nickname ||
                currentRoom?.otherUser.nickname ||
                "..."}
            </span>
            <div className="flex items-center gap-1 text-xs text-[#999999]">
              <span>{currentRoom?.otherUser.age || "??"}세</span>
              <span>,</span>
              <span className="max-w-40 truncate">
                {opponentProfile?.major ||
                  currentRoom?.otherUser.major ||
                  "..."}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="상대 사용자 정보 열기"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex h-12 items-center gap-3 rounded-full border border-white/30 bg-white/60 px-4 text-[#1A1A1A] shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]"
          >
            <UserRound size={20} />
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      <section className="scrollbar-hide relative z-0 mt-10 mb-18 flex w-full flex-1 flex-col gap-4 overflow-y-auto pt-5 pb-8">
        {messages.length === 0 ? (
          <div className="absolute top-1/2 left-1/2 flex h-[192.32px] w-[285px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between gap-4 rounded-[24px] border border-white/30 bg-white/50 px-6 py-8 shadow-[0px_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[15px]">
            <div className="flex h-[92.32px] w-[116px] flex-col items-center justify-center gap-3">
              <Image
                src="/chat/heart.png"
                alt="하트"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <p className="typo-14-500 w-[116px] text-center leading-[140%] text-[#666666]">
                내가 뽑은 사람과
                <br /> 대화를 시작해 보세요
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setMessageText("안녕하세요! 코매칭에서 뽑고 연락드려요!")
              }
              className="typo-14-600 flex h-5 w-[237px] cursor-pointer items-center justify-center text-center leading-[140%] text-[#4D4D4D] transition-opacity hover:opacity-80"
            >
              “안녕하세요! 코매칭에서 뽑고 연락드려요!”
            </button>
          </div>
        ) : (
          messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;

            // YYYY년 MM월 DD일 형식으로 변환
            const getFormattedDate = (isoString: string) => {
              const d = new Date(isoString);
              if (Number.isNaN(d.getTime())) return "";
              return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
            };

            const currentDateStr = getFormattedDate(message.createdAt);
            const prevDateStr = prevMessage
              ? getFormattedDate(prevMessage.createdAt)
              : "";
            const showDivider = currentDateStr !== prevDateStr;

            return (
              <React.Fragment key={message.id}>
                {showDivider && <ChatDateDivider label={currentDateStr} />}
                {message.sender === "me" ? (
                  <OutgoingMessage message={message} />
                ) : (
                  <IncomingMessage
                    message={message}
                    nickname={
                      opponentProfile?.nickname ||
                      currentRoom?.otherUser.nickname
                    }
                    profileImageUrl={
                      opponentProfile?.profileImageUrl ||
                      currentRoom?.otherUser.profileImageUrl
                    }
                  />
                )}
              </React.Fragment>
            );
          })
        )}
      </section>

      <div
        className="fixed right-0 bottom-5 left-0 z-20 pb-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-12 w-[calc(100%-32px)] max-w-93.75 items-center gap-3 rounded-[24px] border border-white/30 bg-white/70 py-2 pr-1 pl-4 shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]">
          <input
            type="text"
            placeholder="메세지를 입력하세요.."
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isSendEnabled) {
                handleSendMessage();
              }
            }}
            className="flex-1 bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#999999]"
          />
          <button
            type="button"
            aria-label="메시지 보내기"
            disabled={!isSendEnabled}
            onClick={handleSendMessage}
            className={cn(
              "flex h-10 w-12 shrink-0 items-center justify-center rounded-[24px] border border-white/30 transition-colors",
              isSendEnabled
                ? "bg-button-primary text-button-primary-text-default"
                : "bg-[#E5E5E5] text-[#CCCCCC]",
            )}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
        <span className="sr-only">chatId: {chatId}</span>
      </div>
      {opponentProfile && (
        <PartnerProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          partner={mergedPartner}
          isFavorite={opponentProfile.favorite}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </main>
  );
}
