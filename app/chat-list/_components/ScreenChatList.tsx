"use client";

import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { useChatRooms } from "@/hooks/useChatRooms";
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

const inboxItems: ChatListItem[] = [
  {
    id: "chat-1",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "22세, 정보통신전자공학부",
    preview:
      "안녕하세요! 오늘 시간 괜찮으세요? 혹시 축제 끝나고 같이 산책하면서 이야기 나눌 수 있을까요?",
    time: "방금",
    unread: true,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-2",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "22세, 정보통신전자공학부",
    preview:
      "혹시 축제 끝나고 커피 한 잔 하실래요? 요즘 좋아하는 음악이나 취미도 궁금해요!",
    time: "방금",
    unread: false,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-3",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "22세, 정보통신전자공학부",
    preview:
      "오늘 매칭 너무 반가웠어요 :) 혹시 시간 괜찮으시면 잠깐 만나서 인사하고 싶어요!",
    time: "방금",
    unread: true,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-4",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "23세, 컴퓨터공학과",
    preview: "지금 어디에 계세요?",
    time: "1분 전",
    unread: false,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-5",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "21세, 심리학과",
    preview: "공연 같이 보실래요?",
    time: "3분 전",
    unread: false,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-6",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "24세, 경영학과",
    preview: "인사 늦어서 미안해요!",
    time: "5분 전",
    unread: true,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-7",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "22세, 전자공학과",
    preview: "혹시 좋아하는 음악 장르 있어요?",
    time: "8분 전",
    unread: false,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-8",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "23세, 디자인학과",
    preview: "지금 부스 앞에서 기다리고 있어요.",
    time: "12분 전",
    unread: false,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-9",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "21세, 사회학과",
    preview: "요즘 관심사 뭐예요?",
    time: "18분 전",
    unread: false,
    avatar: "/profile/default-profile.svg",
  },
  {
    id: "chat-10",
    roomId: "6969e61b866d67f1c3b68106",
    name: "username",
    detail: "24세, 기계공학과",
    preview: "저도 그 동아리 관심 있어요!",
    time: "25분 전",
    unread: true,
    avatar: "/profile/default-profile.svg",
  },
];

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
    if (!rooms || rooms.length === 0) {
      return [];
    }

    return rooms.map((room) => ({
      id: String(room.historyId),
      roomId: room.chatRoomId,
      name: room.partner.nickname,
      detail: `${room.partner.age}세, ${room.partner.major}`,
      preview: "채팅을 시작해보세요.", // 마지막 메시지 필드가 없으므로 기본값
      time: formatChatTime(room.matchedAt),
      unread: false, // 현재 응답에 unreadCount 없음
      avatar: getProfileImageUrl(
        room.partner.profileImageUrl,
        room.partner.gender,
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
