import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InfoCardProps {
  title: string;
  detail: string;
  email?: string;
  disabled?: boolean;
  href?: string;
}

const InfoCard = ({
  title,
  detail,
  email,
  disabled = false,
  href,
}: InfoCardProps) => {
  const CardContent = (
    <div
      className={cn(
        "box-border flex w-full flex-col items-start gap-4 rounded-[16px] p-6 transition-all",
        disabled
          ? "border border-[#E9E9E9] bg-[#F1F1F1]"
          : "border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.5)] shadow-[0px_2px_8px_rgba(0,0,0,0.12)] backdrop-blur-sm",
      )}
    >
      <div className="flex flex-col items-start gap-[16px] p-0">
        <h3
          className={cn(
            "typo-20-700 flex items-center",
            disabled ? "text-gray-400" : "text-gray-900",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "typo-14-500 flex items-center text-left whitespace-pre-wrap",
            disabled ? "text-gray-300" : "text-gray-500",
          )}
        >
          {detail}
        </p>
        {email && (
          <span
            className={cn(
              "typo-14-500 block",
              disabled ? "text-gray-300" : "text-gray-500",
            )}
          >
            {email}
          </span>
        )}
      </div>
    </div>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="flex w-full justify-center">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default InfoCard;
