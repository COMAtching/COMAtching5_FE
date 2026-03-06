"use client";
import Button from "@/components/ui/Button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
          style={{
            opacity: showFirst ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
        >
          거의 다 왔어요!
        </span>
        <span
          style={{
            opacity: showSecond ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
        >
          추가 정보를 적으면 매칭 확률이 올라가요!
        </span>
        <span
          style={{
            opacity: showThird ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
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
      <button
        disabled={buttonDisabled}
        className="typo-14-500 mt-7 text-gray-500"
        onClick={() => router.push("/profile-image")}
      >
        다음에 할게요
      </button>
    </section>
  );
};

export default StartExtraInfo;
