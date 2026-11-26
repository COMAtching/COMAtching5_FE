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
      <div className="group border-admin-edge bg-admin-panel/60 relative flex flex-col gap-4 rounded-2xl border p-6 opacity-50">
        {/* 아이콘 */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} opacity-40`}
        >
          <Icon size={22} className="text-white" />
        </div>

        {/* 텍스트 */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-admin-muted text-base font-semibold">
              {item.title}
            </h3>
            <span className="typo-10-700 bg-admin-subtle text-admin-muted rounded-md px-2 py-0.5 tracking-wider uppercase">
              준비 중
            </span>
          </div>
          <p className="text-admin-muted text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="group border-admin-edge bg-admin-panel/80 hover:border-admin-line hover:bg-admin-hover relative flex flex-col gap-4 rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
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
          <span className="typo-10-700 text-admin-danger flex items-center gap-1 rounded-full bg-[#ff4d61]/10 px-2.5 py-1 tracking-wider uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4d61]" />
            {item.badge}
          </span>
        )}
      </div>

      {/* 텍스트 */}
      <div>
        <h3 className="text-admin-ink mb-1 text-base font-semibold">
          {item.title}
        </h3>
        <p className="text-admin-muted text-sm leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* 화살표 */}
      <div className="text-admin-muted group-hover:text-admin-danger mt-auto flex items-center gap-1.5 text-sm font-medium transition-colors duration-200">
        <span>바로가기</span>
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
