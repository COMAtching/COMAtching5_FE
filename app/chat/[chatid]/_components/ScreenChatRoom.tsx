"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUp, ChevronLeft, MoreVertical, UserRound } from "lucide-react";

type ScreenChatRoomProps = {
  chatId: string;
};

type ChatMessage = {
  id: string;
  sender: "me" | "other";
  text: string;
  time: string;
  readCount: number;
};

type ChatApiMessage = {
  id: string;
  roomId: string;
  senderId: number;
  content: string;
  type: "TALK";
  createdAt: string;
  readCount: number;
};

const currentUserId = 1;

const roomMessages: ChatApiMessage[] = [
  {
    id: "6969e675866d67f1c3b68107",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 1,
    content: "안녕하세요~~",
    type: "TALK",
    createdAt: "2026-01-16T16:19:17.547",
    readCount: 1,
  },
  {
    id: "6969e675866d67f1c3b68108",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 1,
    content: "오늘 매칭 너무 반가웠어요.",
    type: "TALK",
    createdAt: "2026-01-16T16:20:10.201",
    readCount: 1,
  },
  {
    id: "6969e675866d67f1c3b68109",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "저도 반가웠어요!",
    type: "TALK",
    createdAt: "2026-01-16T16:20:44.120",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68110",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "지금 어디 계세요?",
    type: "TALK",
    createdAt: "2026-01-16T16:21:05.437",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68111",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 1,
    content: "부스 앞이에요. 지금 오실 수 있나요?",
    type: "TALK",
    createdAt: "2026-01-16T16:21:45.901",
    readCount: 1,
  },
  {
    id: "6969e675866d67f1c3b68112",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "네! 금방 갈게요.",
    type: "TALK",
    createdAt: "2026-01-16T16:22:12.014",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68113",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "방금 도착했어요. 어디 계신가요?",
    type: "TALK",
    createdAt: "2026-01-16T16:23:05.120",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68114",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "사람이 많네요. 혹시 눈에 띄는 옷 입으셨어요?",
    type: "TALK",
    createdAt: "2026-01-16T16:24:10.450",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68115",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "저는 회색 후드 입고 있어요!",
    type: "TALK",
    createdAt: "2026-01-16T16:24:55.991",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68116",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "찾으면 손 흔들게요 ㅎㅎ",
    type: "TALK",
    createdAt: "2026-01-16T16:25:20.210",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68117",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "혹시 어느 부스 근처세요?",
    type: "TALK",
    createdAt: "2026-01-16T16:26:02.735",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68118",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "아, 보이는 것 같아요!",
    type: "TALK",
    createdAt: "2026-01-16T16:26:45.501",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68119",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "오케이! 만나면 인사할게요.",
    type: "TALK",
    createdAt: "2026-01-16T16:27:30.220",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68120",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "혹시 좋아하는 간식 있어요?",
    type: "TALK",
    createdAt: "2026-01-16T16:28:12.044",
    readCount: 0,
  },
  {
    id: "6969e675866d67f1c3b68121",
    roomId: "6969e61b866d67f1c3b68106",
    senderId: 12,
    content: "저는 츄러스 좋아해요!",
    type: "TALK",
    createdAt: "2026-01-16T16:28:50.900",
    readCount: 0,
  },
];

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

const IncomingMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="flex w-full items-start gap-2">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
        <Image
          src="/profile/default-profile.svg"
          alt="프로필"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="typo-12-500 text-[#1A1A1A]">겨울이오길</span>
        <div className="flex items-end gap-2">
          <div className="max-w-55 rounded-3xl rounded-bl-xl bg-white px-3 py-2 text-sm text-[#333333] shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
            {message.text}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
            {message.readCount === 1 ? (
              <span className="text-[#999999]">1</span>
            ) : null}
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
        {message.readCount === 1 ? <span>1</span> : null}
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
  const isSendEnabled = messageText.trim().length > 0;
  const filteredMessages = roomMessages.filter(
    (message) => message.roomId === chatId,
  );
  const sourceMessages =
    filteredMessages.length > 0 ? filteredMessages : roomMessages;
  const messages: ChatMessage[] = sourceMessages.map((message) => ({
    id: message.id,
    sender: message.senderId === currentUserId ? "me" : "other",
    text: message.content,
    time: formatMessageTime(message.createdAt),
    readCount: message.readCount,
  }));

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-20 pb-24">
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
            <span className="typo-14-600 text-[#1A1A1A]">겨울이오길</span>
            <div className="flex items-center gap-1 text-xs text-[#999999]">
              <span>20세</span>
              <span>,</span>
              <span>정보통신전자공학부</span>
            </div>
          </div>

          <button
            type="button"
            aria-label="상대 사용자 정보 열기"
            className="flex h-12 items-center gap-3 rounded-full border border-white/30 bg-white/60 px-4 text-[#1A1A1A] shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]"
          >
            <UserRound size={20} />
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      <section className="relative z-0 mt-6 flex w-full flex-1 flex-col gap-4 overflow-y-auto pb-6">
        <ChatDateDivider label="2025년 4월 22일" />
        {messages.map((message) =>
          message.sender === "me" ? (
            <OutgoingMessage key={message.id} message={message} />
          ) : (
            <IncomingMessage key={message.id} message={message} />
          ),
        )}
      </section>

      <div
        className="fixed right-0 bottom-10 left-0 z-20 pb-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-12 w-[calc(100%-32px)] max-w-93.75 items-center gap-3 rounded-[24px] border border-white/30 bg-white/70 py-2 pr-1 pl-4 shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]">
          <input
            type="text"
            placeholder="메세지를 입력하세요.."
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            className="flex-1 bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#999999]"
          />
          <button
            type="button"
            aria-label="메시지 보내기"
            disabled={!isSendEnabled}
            className={
              "flex h-10 w-12 items-center justify-center rounded-[24px] border border-white/30 transition-colors " +
              (isSendEnabled
                ? "bg-button-primary text-button-primary-text-default"
                : "bg-[#E5E5E5] text-[#CCCCCC]")
            }
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
        <span className="sr-only">chatId: {chatId}</span>
      </div>
    </main>
  );
}
