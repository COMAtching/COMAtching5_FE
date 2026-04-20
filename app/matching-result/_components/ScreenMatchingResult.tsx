"use client";
import React, { useState, useEffect } from "react";
import { BackButton } from "@/components/ui/BackButton";
import Image from "next/image";
import WaitingFrame from "./WaitingFrame";
import MatchingResult from "./MatchingResult";
import ResultFooter from "./ResultFooter";

const ScreenMatchingResult = () => {
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-10">
      <BackButton
        text={
          <div className="flex items-center gap-1.5">
            <Image
              src="/logo/comatching-logo.svg"
              alt="Comatching"
              width={96}
              height={16}
              priority
            />
            <span className="typo-18-700 text-color-text-black">매칭 결과</span>
          </div>
        }
      />
      {isWaiting ? (
        <WaitingFrame />
      ) : (
        <>
          <MatchingResult />
          <ResultFooter />
        </>
      )}
    </main>
  );
};

export default ScreenMatchingResult;
