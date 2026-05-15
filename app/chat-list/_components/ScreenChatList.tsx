"use client";

import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { useChatRooms, type ChatRoom } from "@/hooks/useChatRooms";
import { useEffect, useMemo } from "react";
import { getProfileImageUrl } from "@/lib/utils/profile";

type ChatListItem = {
  id: string;
  roomId: string;
  name: string;
  detail: string;
  preview: string;
  time: string;
  unread?: boolean;
  avatar: string;
};

const pickedItems: ChatListItem[] = [
  {
    id: "picked-1",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "22세, 정보통신전자공학부",
    preview: "아직 연락 안한 분들께 용기내어 연락해봐요!",
    time: "방금",
    unread: false,
    avatar: "/profile/default-profile.svg",
  },
];

function ChatListRow({ item }: { item: ChatListItem }) {
  return (
    <Link
      href={`/chat/${item.roomId}`}
      prefetch={true}
      aria-label={`${item.name} 채팅방 이동`}
      className="flex w-full items-center gap-4 border-b border-[#E5E5E5] py-5 text-left"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
        <Image
          src={item.avatar}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-w-0 items-end gap-2">
          <span className="typo-18-700 shrink-0 text-[#3C4043]">
            {item.name}
          </span>
          <span className="typo-14-600 truncate text-[#999999]">
            {item.detail}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="typo-14-500 min-w-0 flex-1 truncate text-[#9AA0A6]">
            {item.preview}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-[#999999]" />
          <span className="typo-14-500 shrink-0 text-[#80868B]">
            {item.time}
          </span>
        </div>
      </div>

      <div
        className={`ml-auto h-3 w-3 shrink-0 rounded-full bg-[#FF4D61] ${
          item.unread ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </Link>
  );
}

function ChatSectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="typo-20-700 text-[#1A1A1A]">{title}</h2>
      <p className="typo-14-500 leading-4.25 text-[#999999]">{description}</p>
    </div>
  );
}

const formatChatTime = (isoString: string | null) => {
  if (!isoString) return "";

  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return "";

  const diffMs = Date.now() - parsed.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "방금";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return parsed.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
};

export default function ScreenChatList() {
  const { data: rooms } = useChatRooms();

  // DEBUG: 채팅방 목록 데이터 로그
  useEffect(() => {
    if (rooms) {
      console.log("📡 [Chat Rooms List Data]:", rooms);
    }
  }, [rooms]);

  const chatItems = useMemo(() => {
    // 이제 SSR/CSR 모두 배열로 통일되었으므로 단순하게 처리합니다.
    const roomsArray = (rooms || []) as ChatRoom[];

    if (roomsArray.length === 0) {
      return [];
    }

    return roomsArray.map((room) => ({
      id: String(room.matchingId),
      roomId: room.id,
      name: room.otherUser?.nickname || "익명",
      detail: room.otherUser
        ? `${room.otherUser.age}세, ${room.otherUser.major}`
        : "정보 없음",
      preview: room.lastMessage || "채팅을 시작해보세요.",
      time: room.lastMessageTime
        ? formatChatTime(room.lastMessageTime)
        : "방금",
      unread: (room.unreadCount || 0) > 0,
      avatar: getProfileImageUrl(
        room.otherUser?.profileImageUrl,
        "UNKNOWN", // 성별 정보가 없으므로 기본값 처리
      ),
    }));
  }, [rooms]);

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-2 pb-30">
      <BackButton text="채팅하기" />
      <span className="typo-14-500 mt-2 text-center leading-4.25 text-[#999999]">
        매칭된 분들과 채팅을 해보세요!
        <br />
        가볍게 인사는 어떠신가요?
      </span>

      <section className="mt-6 flex w-full flex-col">
        {chatItems.map((item) => (
          <ChatListRow key={item.id} item={item} />
        ))}
      </section>

      <section className="mt-10 flex w-full flex-col gap-4">
        <ChatSectionTitle
          title="내가 뽑은 사람"
          description="아직 연락 안한 분들께 용기내어 연락해봐요!"
        />

        <div className="flex flex-col">
          {pickedItems.map((item) => (
            <ChatListRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
