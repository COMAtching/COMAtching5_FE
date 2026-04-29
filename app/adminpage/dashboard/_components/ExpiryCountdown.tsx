"use client";

import React, { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface ExpiryCountdownProps {
  expiresAt: string;
  onExpired?: () => void;
}

export default function ExpiryCountdown({
  expiresAt,
  onExpired,
}: ExpiryCountdownProps) {
  const [remaining, setRemaining] = useState<number>(() =>
    calculateRemaining(expiresAt),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newRemaining = calculateRemaining(expiresAt);
      setRemaining(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(timer);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  if (remaining <= 0) {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-[#4a4e69]">
        <Timer size={12} />
        만료됨
      </span>
    );
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isUrgent = remaining < 120; // 2분 미만

  return (
    <span
      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold tabular-nums ${
        isUrgent ? "bg-red-500/10 text-red-400" : "bg-[#1e2030] text-[#8b8fa3]"
      }`}
    >
      <Timer size={12} className={isUrgent ? "animate-pulse" : ""} />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}

function calculateRemaining(expiresAt: string): number {
  const expiry = new Date(expiresAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((expiry - now) / 1000));
}
