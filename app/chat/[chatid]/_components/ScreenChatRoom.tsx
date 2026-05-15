"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUp, ChevronLeft, MoreVertical, UserRound } from "lucide-react";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useMyProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

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

  // 0. 내 프로필 정보 가져오기 (현재 사용자 ID 확인용)
  const { data: myProfile } = useMyProfile();
  const currentUserId = myProfile?.data.memberId;

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
  }, [historyData, socketMessages]);

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
              "flex h-10 w-12 items-center justify-center rounded-[24px] border border-white/30 transition-colors",
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
    </main>
  );
}
