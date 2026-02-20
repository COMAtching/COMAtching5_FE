"use client";
import Button from "@/components/ui/Button";
import React, { useEffect, useState } from "react";

const StartOnBoarding = () => {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setShowFirst(true), 100);
    const t2 = setTimeout(() => setShowSecond(true), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
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
          <span
            style={{
              background:
                "linear-gradient(90deg, #FF4D61 5.29%, #FF775E 33.17%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            코매칭
          </span>
          에 오신 것을 환영합니다.
        </span>
        <span
          style={{
            opacity: showSecond ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
          onTransitionEnd={() => setButtonDisabled(false)}
        >
          원활한 매칭을 위해 여러분의 정보가 필요해요!
        </span>
      </div>
      <Button disabled={buttonDisabled} shadow={true}>
        네, 좋아요!
      </Button>
    </section>
  );
};

export default StartOnBoarding;
