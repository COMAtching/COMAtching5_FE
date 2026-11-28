"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { inboxKey } from "@/hooks/useMemberSession";
import { useRef, useState } from "react";
import {
  reportCategories,
  type ReportCategory,
} from "@/lib/constants/reportCategories";
import { Flag, MoreVertical, UserRound } from "lucide-react";
import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PartnerProfileModal, {
  type PartnerDetails,
} from "./PartnerProfileModal";

interface Props {
  partner: PartnerDetails;
  source?: "PROFILE" | "CHAT";
  profileOpen?: boolean;
  onProfileOpenChange?: (open: boolean) => void;
  favorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function PartnerMenu({
  partner,
  source = "PROFILE",
  profileOpen,
  onProfileOpenChange,
  favorite,
  onFavoriteToggle,
}: Props) {
  const client = useQueryClient();
  const [sheet, setSheet] = useState<"menu" | "report" | "received" | null>(
    null,
  );
  const [localProfile, setLocalProfile] = useState(false);
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const pending = useRef(false);
  const request = useRef<{
    id: string;
    reason: string;
    category: ReportCategory;
  } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const openingProfile = useRef(false);
  const showProfile = onProfileOpenChange ?? setLocalProfile;
  const nickname = partner.nickname || "상대방";

  function openMenu() {
    showProfile(false);
    openingProfile.current = false;
    setError("");
    setSheet("menu");
  }

  async function submit() {
    const detail = reason.trim();
    if (!category || !detail || pending.current) return;
    if (
      request.current?.reason !== detail ||
      request.current.category !== category
    )
      request.current = { id: crypto.randomUUID(), reason: detail, category };
    pending.current = true;
    setSending(true);
    setError("");
    try {
      await api.post("/api/members/reports", {
        targetId: partner.memberId,
        source,
        category,
        reason: detail,
        requestId: request.current.id,
      });
      request.current = null;
      setReason("");
      setCategory(null);
      setSheet("received");
      void client.invalidateQueries({ queryKey: inboxKey });
    } catch (err) {
      setError(
        (isAxiosError(err) && err.response?.data?.message) ||
          "신고 접수를 확인하지 못했어요. 다시 시도해 주세요.",
      );
    } finally {
      pending.current = false;
      setSending(false);
    }
  }

  return (
    <div
      className="shrink-0"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Drawer
        open={sheet !== null}
        onOpenChange={(open) => {
          if (open) openMenu();
          else if (!pending.current) setSheet(null);
        }}
        autoFocus
        noBodyStyles
        dismissible={!sending}
        repositionInputs={false}
      >
        <DrawerTrigger asChild>
          <button
            ref={trigger}
            type="button"
            aria-label={nickname + " 더 보기"}
            className="flex size-11 items-center justify-center rounded-full"
          >
            <MoreVertical size={19} />
          </button>
        </DrawerTrigger>
        <DrawerContent
          className="max-h-[90dvh] gap-4 overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-6 pb-[max(24px,env(safe-area-inset-bottom))]"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (!openingProfile.current)
              trigger.current?.focus({ preventScroll: true });
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <DrawerTitle>
              {sheet === "received"
                ? "신고가 접수되었습니다"
                : sheet === "report"
                  ? "신고하기"
                  : nickname}
            </DrawerTitle>
            <button
              type="button"
              disabled={sending}
              className="min-h-11 px-2 text-sm text-gray-600"
              onClick={() => setSheet(null)}
            >
              닫기
            </button>
          </div>
          {sheet === "menu" && (
            <>
              <DrawerDescription className="sr-only">
                매칭 상대 메뉴
              </DrawerDescription>
              <button
                type="button"
                className="flex min-h-12 items-center gap-3 text-left"
                onClick={() => {
                  openingProfile.current = true;
                  setSheet(null);
                  showProfile(true);
                }}
              >
                <UserRound size={20} />
                프로필 보기
              </button>
              <button
                type="button"
                className="flex min-h-12 items-center gap-3 text-left text-[#c52f48]"
                onClick={() => setSheet("report")}
              >
                <Flag size={20} />
                신고하기
              </button>
            </>
          )}
          {sheet === "report" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <DrawerDescription>
                {nickname}님을 신고하는 이유를 운영자에게 알려주세요.
              </DrawerDescription>
              <fieldset disabled={sending} className="min-w-0">
                <legend className="typo-14-600 mb-2">신고 분류</legend>
                <div className="grid grid-cols-2 gap-2" data-vaul-no-drag>
                  {(Object.keys(reportCategories) as ReportCategory[]).map(
                    (value) => (
                      <label key={value} className="relative">
                        <input
                          className="peer sr-only"
                          type="radio"
                          name="report-category"
                          required
                          checked={category === value}
                          onChange={() => setCategory(value)}
                          value={value}
                        />
                        <span className="typo-14-500 border-color-gray-100 text-color-gray-700 peer-checked:border-color-flame-700 peer-checked:text-color-flame-700 peer-focus-visible:ring-color-flame-700 flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-2 py-2 text-center peer-checked:bg-rose-50 peer-focus-visible:ring-2">
                          {reportCategories[value]}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </fieldset>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                신고 사유
                <textarea
                  data-vaul-no-drag
                  required
                  maxLength={1000}
                  value={reason}
                  disabled={sending}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="rounded-2xl border border-gray-200 p-3 text-base font-normal"
                />
              </label>
              {error && (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={!category || !reason.trim() || sending}
                className="min-h-12 rounded-2xl bg-[#d63652] font-semibold text-white disabled:opacity-50"
              >
                {sending ? "접수 중…" : "신고 접수"}
              </button>
            </form>
          )}
          {sheet === "received" && (
            <>
              <DrawerDescription role="status">
                처리 결과는 알림함에서 확인할 수 있어요.
              </DrawerDescription>
              <Link
                href="/inbox"
                className="typo-14-600 min-h-11 self-start py-2 underline underline-offset-4"
                onClick={() => setSheet(null)}
              >
                내 알림함 보기
              </Link>
            </>
          )}
        </DrawerContent>
      </Drawer>
      {(profileOpen ?? localProfile) && (
        <PartnerProfileModal
          isOpen
          partner={partner}
          onClose={() => {
            showProfile(false);
            trigger.current?.focus({ preventScroll: true });
          }}
          onMore={openMenu}
          isFavorite={favorite}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}
    </div>
  );
}
