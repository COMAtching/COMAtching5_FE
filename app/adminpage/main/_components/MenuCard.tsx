"use client";

import React from "react";
import Link from "next/link";
import { type LucideIcon, ArrowRight } from "lucide-react";

interface MenuCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    active: boolean;
    gradient: string;
    badge?: string;
  };
}

export default function MenuCard({ item }: MenuCardProps) {
  const Icon = item.icon;

  if (!item.active) {
    return (
      <div className="group relative flex flex-col gap-4 rounded-2xl border border-[#1e2030] bg-[#161827]/60 p-6 opacity-50">
        {/* 아이콘 */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} opacity-40`}
        >
          <Icon size={22} className="text-white" />
        </div>

        {/* 텍스트 */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#6b7094]">
              {item.title}
            </h3>
            <span className="rounded-md bg-[#1e2030] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#4a4e69] uppercase">
              준비 중
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#4a4e69]">
            {item.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="group relative flex flex-col gap-4 rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-6 transition-all duration-300 hover:border-[#2a2d42] hover:bg-[#1a1d32] hover:shadow-xl hover:shadow-black/20"
    >
      {/* 호버 글로우 효과 */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-[0.04]`}
      />

      {/* 아이콘 */}
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300 group-hover:scale-105`}
          style={{
            boxShadow: `0 8px 24px -4px rgba(255, 77, 97, 0.15)`,
          }}
        >
          <Icon size={22} className="text-white" />
        </div>

        {item.badge && (
          <span className="flex items-center gap-1 rounded-full bg-[#ff4d61]/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#ff4d61] uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4d61]" />
            {item.badge}
          </span>
        )}
      </div>

      {/* 텍스트 */}
      <div>
        <h3 className="mb-1 text-base font-semibold text-white">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-[#6b7094]">
          {item.description}
        </p>
      </div>

      {/* 화살표 */}
      <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-[#6b7094] transition-colors duration-200 group-hover:text-[#ff4d61]">
        <span>바로가기</span>
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
