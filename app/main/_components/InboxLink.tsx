"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useInboxUnreadCount } from "@/hooks/useMemberInbox";

export default function InboxLink() {
  const { data: count } = useInboxUnreadCount();
  return (
    <Link
      href="/inbox"
      aria-label={count ? "알림함 · 읽지 않은 알림 " + count + "건" : "알림함"}
      className="relative flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/60 text-[#454545] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
    >
      <Bell size={18} aria-hidden="true" />
      {!!count && (
        <span
          aria-hidden="true"
          className="bg-color-flame-700 absolute top-2.5 right-2.5 size-2 rounded-full ring-1 ring-white"
        />
      )}
    </Link>
  );
}
