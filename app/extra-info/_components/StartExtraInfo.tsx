"use client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const StartExtraInfo = () => {
  const router = useRouter();
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setShowFirst(true), 100);
    const t2 = setTimeout(() => setShowSecond(true), 2100);
    const t3 = setTimeout(() => setShowThird(true), 4100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="flex w-full flex-col items-center px-[15px]">
      <div className="typo-18-600 mt-[18.1vh] mb-[44.2vh] flex flex-col items-center gap-2 leading-2 text-gray-800">
        <span
          className={cn(
            "transition-opacity duration-700 ease-in-out",
            showFirst ? "opacity-100" : "opacity-0",
          )}
        >
          거의 다 왔어요!
        </span>
        <span
          className={cn(
            "transition-opacity duration-700 ease-in-out",
            showSecond ? "opacity-100" : "opacity-0",
          )}
        >
          추가 정보를 적으면 매칭 확률이 올라가요!
        </span>
        <span
          className={cn(
            "transition-opacity duration-700 ease-in-out",
            showThird ? "opacity-100" : "opacity-0",
          )}
          onTransitionEnd={() => setButtonDisabled(false)}
        >
          물론, 나중에 수정할 수 있어요.
        </span>
      </div>
      <Button
        disabled={buttonDisabled}
        shadow={true}
        onClick={() => router.push("/extra-info/detail")}
      >
        네, 좋아요!
      </Button>
      <Link href="/profile-image">
        <Button
          disabled={buttonDisabled}
          shadow={false}
          className="typo-14-500 mt-7 border-none bg-transparent text-gray-500"
        >
          다음에 할게요
        </Button>
      </Link>
    </section>
  );
};

export default StartExtraInfo;
