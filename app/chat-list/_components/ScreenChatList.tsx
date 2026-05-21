"use client";

import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { useChatRooms, type ChatRoom } from "@/hooks/useChatRooms";
import { useEffect, useMemo } from "react";
import NoMatchingList from "@/app/matching-list/_components/NoMatchingList";

type ChatListItem = {
  id: string;
  roomId: string;
  name: string;
  detail: string;
  preview: string;
  time: string;
  unread?: boolean;
  unreadCount?: number;
  avatar: string;
};

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

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-end gap-2">
          <span className="typo-18-700 shrink-0 text-[#3C4043]">
            {item.name}
          </span>
          <span className="typo-14-600 truncate text-[#999999]">
            {item.detail}
          </span>
        </div>

        <span className="typo-14-500 min-w-0 truncate text-[#9AA0A6]">
          {item.preview}
        </span>
      </div>

      <div className="flex min-w-[65px] shrink-0 flex-col items-end justify-center gap-1.5 pl-2">
        <span className="typo-12-500 whitespace-nowrap text-[#9AA0A6]">
          {item.time}
        </span>
        {item.unread &&
        item.unreadCount !== undefined &&
        item.unreadCount > 0 ? (
          <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF4D61] px-1.5 text-[11px] leading-none font-bold text-white shadow-sm">
            {item.unreadCount > 99 ? "99+" : item.unreadCount}
          </div>
        ) : (
          <div className="h-5 w-5 opacity-0" aria-hidden="true" />
        )}
      </div>
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
  const { data: rooms, refetch: refetchRooms } = useChatRooms();

  // 컴포넌트 마운트 시 최신 데이터 호출
  useEffect(() => {
    refetchRooms();
  }, [refetchRooms]);

  // 데이터 변경 로그
  useEffect(() => {
    if (rooms) {
      console.log("📡 [Chat Rooms List Data]:", rooms);
    }
  }, [rooms]);

  // FCM 채팅 알림 수신 시 채팅방 목록 실시간 최신화
  useEffect(() => {
    const handleFcmChat = () => {
      console.log(
        "🔔 [FCM Chat Notification Received] Refreshing chat list...",
      );
      refetchRooms();
    };
    window.addEventListener("fcm-chat-received", handleFcmChat);
    return () => {
      window.removeEventListener("fcm-chat-received", handleFcmChat);
    };
  }, [refetchRooms]);

  const chatItems = useMemo(() => {
    // 이제 SSR/CSR 모두 배열로 통일되었으므로 단순하게 처리합니다.
    const roomsArray = (rooms || []) as ChatRoom[];

    if (roomsArray.length === 0) {
      return [];
    }

    // 최신 메시지 순으로 정렬 (메시지가 없는 방은 아래로 보냄, 메시지 유무가 같으면 매칭 ID 최신순 정렬)
    const sortedRooms = [...roomsArray].sort((a, b) => {
      const timeA = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : 0;
      const timeB = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      return b.matchingId - a.matchingId;
    });

    return sortedRooms.map((room) => ({
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
      unreadCount: room.unreadCount || 0,
      avatar: room.otherUser?.profileImageUrl || "/default-profile.png",
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

      {chatItems.length === 0 ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center pt-20">
          <NoMatchingList type="chat" />
        </div>
      ) : (
        <section className="mt-6 flex w-full flex-col">
          {chatItems.map((item) => (
            <ChatListRow key={item.id} item={item} />
          ))}
        </section>
      )}
    </main>
  );
}
