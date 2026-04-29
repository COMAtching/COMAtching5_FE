"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MenuCard from "./MenuCard";
import {
  CreditCard,
  Package,
  Users,
  BarChart3,
  LogOut,
  Shield,
} from "lucide-react";

const MENU_ITEMS = [
  {
    id: "payment",
    title: "결제 승인 관리",
    description: "사용자 결제 요청을 실시간으로 확인하고 승인/거절합니다",
    icon: CreditCard,
    href: "/adminpage/dashboard",
    active: true,
    gradient: "from-[#ff4d61] to-[#ff775e]",
    badge: "LIVE",
  },
  {
    id: "products",
    title: "상품 관리",
    description: "매칭권/옵션권 상품을 등록, 수정, 관리합니다",
    icon: Package,
    href: "/adminpage/products",
    active: true,
    gradient: "from-[#6366f1] to-[#8b5cf6]",
  },
  {
    id: "users",
    title: "사용자 관리",
    description: "가입된 사용자 목록 조회 및 관리",
    icon: Users,
    href: "#",
    active: false,
    gradient: "from-[#06b6d4] to-[#3b82f6]",
  },
  {
    id: "stats",
    title: "통계",
    description: "서비스 이용 현황 및 매출 데이터를 확인합니다",
    icon: BarChart3,
    href: "#",
    active: false,
    gradient: "from-[#f59e0b] to-[#ef4444]",
  },
];

export default function AdminMainScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // 쿠키 삭제 후 로그인 페이지로 이동
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/adminpage");
  };

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4d61] to-[#ff775e]">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              관리자 콘솔
            </h1>
            <p className="text-xs text-[#6b7094] sm:text-sm">
              COMAtching Admin Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-[#2a2d42] bg-[#161827] px-4 py-2.5 text-sm font-medium text-[#8b8fa3] transition-all duration-200 hover:border-[#ff4d61]/40 hover:text-[#ff4d61]"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </header>

      {/* 메뉴 그리드 */}
      <section>
        <h2 className="mb-5 text-sm font-semibold tracking-wider text-[#6b7094] uppercase">
          관리 메뉴
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU_ITEMS.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
