"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  ChevronLeft,
  MoreVertical,
  Paperclip,
  UserRound,
} from "lucide-react";
import { featureMessage, useFeature } from "@/stores/features";
import { useChatRoomSocket } from "@/hooks/useChatRoomSocket";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useMyProfile } from "@/hooks/useProfile";
import { getProfileImageUrl } from "@/lib/utils/profile";
import {
  useUpdateFavorite,
  type MatchingPartner,
} from "@/hooks/useMatchingHistory";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT, IMAGE_MIB, uploadChatImage } from "@/lib/image-upload";
import ChatReadOnlyNotice from "@/components/common/ChatReadOnlyNotice";
import PartnerProfileModal from "./PartnerProfileModal";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useChatMemberProfile } from "@/hooks/useChatMemberProfile";
import { AxiosError } from "axios";

type ScreenChatRoomProps = {
  chatId: string;
};

type ChatMessage = {
  id: string;
  sender: "me" | "other";
  text: string;
  image: boolean;
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

const MessageBody = ({ message }: { message: ChatMessage }) =>
  message.image ? (
    <Image
      src={message.text}
      alt="채팅 첨부 이미지"
      width={240}
      height={240}
      unoptimized
      className="h-auto max-h-64 max-w-full rounded-lg object-contain"
    />
  ) : (
    message.text
  );

const IncomingMessage = ({
  message,
  nickname,
  profileImageUrl,
  onProfileClick,
}: {
  message: ChatMessage;
  nickname?: string;
  profileImageUrl?: string;
  onProfileClick?: () => void;
}) => {
  return (
    <div className="flex w-full items-start gap-2">
      <div
        className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-full bg-white transition-opacity hover:opacity-80"
        onClick={onProfileClick}
      >
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
          <div className="max-w-[244px] rounded-[16px_16px_16px_8px] bg-white p-3 text-sm leading-[140%] text-[#1A1A1A] shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
            <MessageBody message={message} />
          </div>
          <div className="typo-10-500 flex items-center gap-2 leading-[130%]">
            <span className="text-[#B3B3B3]">{message.time}</span>
            {message.readCount === 1 && (
              <span className="text-[#999999]">1</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OutgoingMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="flex w-full items-end justify-end gap-2">
      <div className="typo-10-500 flex items-center gap-2 leading-[130%]">
        {message.readCount === 1 && <span className="text-[#999999]">1</span>}
        <span className="text-[#B3B3B3]">{message.time}</span>
      </div>
      <div className="max-w-[244px] rounded-[16px_16px_8px_16px] bg-[linear-gradient(125.6deg,#FF4D61_22.6%,#FF775E_88.94%)] p-3 text-sm leading-[140%] text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
        <MessageBody message={message} />
      </div>
    </div>
  );
};

export default function ScreenChatRoom({ chatId }: ScreenChatRoomProps) {
  const chat = useFeature("CHAT");
  const readOnly = chat?.open === false;
  const router = useRouter();
  const [messageText, setMessageText] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const viewportRef = React.useRef<HTMLElement>(null);
  const hasInitiallyScrolledRef = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const lastMessageIdRef = React.useRef<string | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // 채팅방이 바뀌면 즉시 스크롤 초기화
  useEffect(() => {
    hasInitiallyScrolledRef.current = false;
  }, [chatId]);

  useEffect(() => {
    const shell = viewportRef.current;
    const viewport = window.visualViewport;
    if (!shell || !viewport) return;
    const update = () => {
      shell.style.setProperty("--chat-viewport-height", viewport.height + "px");
      shell.style.setProperty("--chat-viewport-top", viewport.offsetTop + "px");
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    const list = scrollContainerRef.current;
    if (!list) return;
    let previousHeight = list.clientHeight;
    const observer = new ResizeObserver(() => {
      if (previousHeight === list.clientHeight) return;
      const wasAtEnd =
        list.scrollHeight - list.scrollTop - previousHeight <= 24;
      previousHeight = list.clientHeight;
      if (wasAtEnd) list.scrollTop = list.scrollHeight;
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // 0. 내 프로필 정보 가져오기 (현재 사용자 ID 확인용)
  const profile = useMyProfile({
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
  const currentUserId =
    profile.isFetchedAfterMount && profile.isSuccess
      ? profile.data.data.memberId
      : undefined;

  // 즐겨찾기 토글 mutation
  const updateFavorite = useUpdateFavorite();

  // 0-1. 현재 채팅방 정보 가져오기
  const { data: chatRooms } = useChatRooms(currentUserId);
  const currentRoom = chatRooms?.find((r) => r.id === chatId);
  const partnerMemberId = currentRoom?.otherUser.memberId;

  // 0-2. 상대방 경량 프로필 API 호출
  const { data: profileRes } = useChatMemberProfile(partnerMemberId);
  const opponentProfile = profileRes?.data;

  const mergedPartner = useMemo(() => {
    const rawFreq = opponentProfile?.contactFrequency || "NORMAL";
    const mappedFreq =
      rawFreq === "자주"
        ? "FREQUENT"
        : rawFreq === "보통"
          ? "NORMAL"
          : rawFreq === "적음"
            ? "RARE"
            : rawFreq;

    return {
      memberId: opponentProfile?.memberId || partnerMemberId || 999,
      email: "winter@example.com",
      nickname:
        opponentProfile?.nickname ||
        currentRoom?.otherUser.nickname ||
        "겨울이오길",
      age: opponentProfile?.age || currentRoom?.otherUser.age || 20,
      gender: currentRoom?.otherUser.gender || "FEMALE",
      birthDate: "2004-01-01",
      major:
        opponentProfile?.major ||
        currentRoom?.otherUser.major ||
        "정보통신전자공학부",
      university: currentRoom?.otherUser.university || "가톨릭대학교",
      mbti: opponentProfile?.mbti || "ENTP",
      contactFrequency: mappedFreq,
      profileImageUrl:
        opponentProfile?.profileImageUrl ||
        currentRoom?.otherUser.profileImageUrl ||
        "animal_cat",
      profileImageKey: null,
      intro: opponentProfile?.intro || "친하게 지내요! 😆",
      song: opponentProfile?.song || null,
      hobbies: opponentProfile?.hobbies || [],
      tags: opponentProfile?.tags || [],
      intros: [],
      socialType: opponentProfile?.socialType || "INSTAGRAM",
      socialAccountId: opponentProfile?.socialAccountId || "",
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
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useChatMessages(chatId, currentUserId);

  // 404 에러 발생 시 채팅방 목록으로 안전하게 리다이렉트
  useEffect(() => {
    if (isError && error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        alert("존재하지 않거나 참여할 수 없는 채팅방입니다.");
        router.replace("/chat-list");
      }
    }
  }, [isError, error, router]);

  // 2. 소켓 연결 및 실시간 메시지 수신
  const pendingMessage = React.useRef<{
    content: string;
    type: "TALK" | "IMAGE";
  } | null>(null);
  const uploadAbort = React.useRef<AbortController | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  useEffect(
    () => () => uploadAbort.current?.abort(),
    [chatId, currentUserId, chat?.open],
  );
  const [sendState, setSendState] = useState<
    "idle" | "sending" | "unconfirmed"
  >("idle");
  const onOwnMessage = React.useCallback(
    (content: string, type: "TALK" | "IMAGE") => {
      const pending = pendingMessage.current;
      if (!pending || pending.type !== type) return;
      if (
        type === "IMAGE"
          ? !content.endsWith("/" + pending.content.split("/").pop())
          : content !== pending.content
      )
        return;
      pendingMessage.current = null;
      if (type === "TALK")
        setMessageText((draft) => (draft === content ? "" : draft));
      setSendState("idle");
    },
    [],
  );
  const {
    messages: socketMessages,
    sendMessage,
    isConnected,
    endReason,
  } = useChatRoomSocket(
    chatId,
    historyData && !isError ? currentUserId : undefined,
    onOwnMessage,
  );

  useEffect(() => {
    if (sendState !== "sending") return;
    const timer = window.setTimeout(() => setSendState("unconfirmed"), 10000);
    return () => window.clearTimeout(timer);
  }, [sendState]);

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
    // 페이지네이션의 각 페이지들을 합칩니다. 오래된 대화가 앞부분에 오도록 뒤집어서 병합합니다.
    const pages = historyData?.pages || [];
    const combined = [...pages].reverse().flatMap((page) => page.data || []);

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
      image: m.type === "IMAGE",
      time: formatMessageTime(m.createdAt),
      readCount: m.readCount,
      createdAt: m.createdAt,
    })) as ChatMessage[];
  }, [historyData, socketMessages, currentUserId]);

  useEffect(() => {
    const list = scrollContainerRef.current;
    if (!list || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const lastId = lastMsg ? lastMsg.id : null;

    if (!hasInitiallyScrolledRef.current) {
      // 처음 진입했을 때는 즉시 가장 아래로 이동 (빠른 속도감)
      list.scrollTop = list.scrollHeight;
      hasInitiallyScrolledRef.current = true;
      lastMessageIdRef.current = lastId;
      return;
    }

    // 마지막 메시지 ID가 변경되었을 때만 (실시간 새 메시지 송수신 시) 하단으로 부드럽게 스크롤
    if (lastId !== lastMessageIdRef.current) {
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
      lastMessageIdRef.current = lastId;
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    // 첫 진입 시 자동으로 맨 아래로 가기 전에는 작동하지 않도록 방어
    if (!hasInitiallyScrolledRef.current) return;

    // 맨 위에서 300px 이내로 들어오면 선제적으로 다음 페이지(더 오래된 메시지)를 미리 가져옵니다.
    if (container.scrollTop < 300 && hasNextPage && !isFetchingNextPage) {
      // 1. 스크롤 위치 보존을 위한 높이 저장
      const previousScrollHeight = container.scrollHeight;

      // 2. 다음 페이지 불러오기
      fetchNextPage().then(() => {
        // 3. 데이터를 불러온 후 스크롤 위치 복원
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - previousScrollHeight;
        });
      });
    }
  };

  const handleSendMessage = () => {
    if (
      !messageText.trim() ||
      !isConnected ||
      uploading ||
      sendState === "sending"
    )
      return;
    pendingMessage.current = { content: messageText, type: "TALK" };
    setSendState(sendMessage(messageText) ? "sending" : "unconfirmed");
  };

  const canAttach =
    isConnected && chat?.open === true && !uploading && sendState !== "sending";
  const isSendEnabled = canAttach && messageText.trim().length > 0;

  const attachImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !canAttach || uploadAbort.current) return;
    const controller = new AbortController();
    uploadAbort.current = controller;
    setUploading(true);
    setUploadError("");
    try {
      const key = await uploadChatImage(file, chatId, controller.signal);
      if (controller.signal.aborted) return;
      pendingMessage.current = { content: key, type: "IMAGE" };
      setSendState(sendMessage(key, "IMAGE") ? "sending" : "unconfirmed");
    } catch (error) {
      if (!controller.signal.aborted)
        setUploadError(
          error instanceof Error
            ? error.message
            : "이미지를 첨부하지 못했습니다.",
        );
    } finally {
      uploadAbort.current = null;
      setUploading(false);
    }
  };

  if (isError && (error as AxiosError)?.response?.status === 404) return null;

  return (
    <main
      ref={viewportRef}
      className="chat-viewport flex w-full flex-col overflow-hidden"
    >
      <header className="relative z-20 shrink-0 px-4 py-2">
        <div className="absolute inset-0 -z-10 bg-[#F5F5F5]/80 backdrop-blur-[15px]" />
        <div className="pointer-events-none absolute top-full left-0 h-8 w-full bg-[#F5F5F5]/60 mask-[linear-gradient(to_bottom,black,transparent)] backdrop-blur-[10px]" />
        <div className="mx-auto flex h-12 w-full max-w-93.75 items-center gap-4">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() =>
              history.length > 1 ? router.back() : router.replace("/chat-list")
            }
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

      {isFetchingNextPage && (
        <div className="absolute top-[calc(env(safe-area-inset-top)+72px)] left-1/2 z-30 flex -translate-x-1/2 items-center justify-center rounded-full bg-white/95 p-2 shadow-[0px_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-sm">
          <LoadingSpinner variant="inline" label="이전 메시지 불러오는 중" />
        </div>
      )}

      <section
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{ overflowAnchor: "none" }}
        className="chat-messages scrollbar-hide relative z-0 flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 pt-5 pb-4"
      >
        {isLoading ? (
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <LoadingSpinner label="대화 불러오는 중" />
          </div>
        ) : messages.length === 0 ? (
          <div
            className={cn(
              "absolute top-1/2 left-1/2 flex w-[285px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-[24px] border border-white/30 bg-white/50 px-6 py-8 shadow-[0px_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[15px]",
              !readOnly && "h-[192.32px] justify-between",
            )}
          >
            <div className="flex h-[92.32px] w-[116px] flex-col items-center justify-center gap-3">
              <Image
                src="/chat/heart.png"
                alt="하트"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <p className="typo-14-500 w-[116px] text-center leading-[140%] text-[#666666]">
                {readOnly ? "아직 나눈 대화가 없어요" : "대화를 시작해 보세요"}
              </p>
            </div>
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  setMessageText("안녕하세요! 코매칭에서 뽑고 연락드려요!")
                }
                className="typo-14-600 flex h-5 w-[237px] cursor-pointer items-center justify-center text-center leading-[140%] text-[#4D4D4D] transition-opacity hover:opacity-80"
              >
                “안녕하세요! 코매칭에서 뽑고 연락드려요!”
              </button>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
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
                      onProfileClick={() => setIsProfileModalOpen(true)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </section>

      {readOnly ? (
        <footer
          className="max-h-[38dvh] w-full shrink-0 overflow-y-auto px-4 py-3"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <ChatReadOnlyNotice message={chat.message} />
        </footer>
      ) : (
        <div
          className="relative z-20 w-full shrink-0 pt-2"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          {uploadError && (
            <p role="alert" className="mb-1 text-center text-xs text-red-600">
              {uploadError}
            </p>
          )}
          {uploading && (
            <p role="status" className="mb-1 text-center text-xs text-gray-600">
              <LoadingSpinner variant="inline" label="이미지 업로드 중" />
            </p>
          )}
          {(!isConnected || sendState !== "idle") && (
            <p role="status" className="mb-1 text-center text-xs text-gray-600">
              {endReason === "changed" ? (
                "로그인 계정이 바뀌었어요. 채팅방을 새로고침해 주세요."
              ) : endReason === "ended" ? (
                "실시간 연결이 종료됐어요. 기존 대화 내역을 확인해 주세요."
              ) : sendState === "unconfirmed" ? (
                "전송을 확인하지 못했어요. 대화 내역을 확인해 주세요."
              ) : !isConnected ? (
                <LoadingSpinner variant="inline" label="채팅 서버에 연결 중" />
              ) : (
                <LoadingSpinner variant="inline" label="전송 확인 중" />
              )}
            </p>
          )}
          <div className="relative mx-auto flex h-12 w-[calc(100%-32px)] max-w-93.75 items-center rounded-3xl border border-white/30 bg-white/70 pr-[52px] pl-4 shadow-[0px_4px_8px_rgba(0,0,0,0.08),0px_0px_16px_rgba(0,0,0,0.1)] backdrop-blur-[15px]">
            <label
              className={cn(
                "mr-2 inline-flex items-center",
                canAttach ? "cursor-pointer" : "opacity-40",
              )}
              title={`이미지 첨부 · 최대 ${IMAGE_MIB.chat} MiB`}
            >
              <Paperclip aria-hidden="true" size={18} />
              <input
                type="file"
                className="sr-only"
                accept={IMAGE_ACCEPT}
                onChange={attachImage}
                disabled={!canAttach}
                aria-label={`채팅 이미지 첨부 · 최대 ${IMAGE_MIB.chat} MiB`}
              />
            </label>
            <input
              ref={inputRef}
              type="text"
              disabled={!chat?.open}
              placeholder={
                chat?.open
                  ? "메시지를 입력하세요."
                  : featureMessage("CHAT", chat)
              }
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.nativeEvent.isComposing &&
                  isSendEnabled
                ) {
                  handleSendMessage();
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-base text-[#1A1A1A] outline-none placeholder:text-[#999999]"
            />
            <button
              type="button"
              aria-label="메시지 보내기"
              disabled={!isSendEnabled}
              onPointerDown={(e) => {
                // 버튼 클릭 시 input에서 포커스가 빠져나가 키보드가 닫히는 현상 방지
                e.preventDefault();
              }}
              onClick={handleSendMessage}
              className={cn(
                "absolute top-1/2 right-1 flex h-10 w-12 shrink-0 -translate-y-1/2 items-center justify-center rounded-3xl border border-white/30 transition-colors",
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
      )}
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
