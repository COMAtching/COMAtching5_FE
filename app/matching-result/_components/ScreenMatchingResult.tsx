"use client";
import React, { useState, useEffect } from "react";
import { BackButton } from "@/components/ui/BackButton";
import Image from "next/image";
import WaitingFrame from "./WaitingFrame";
import MatchingResult from "./MatchingResult";
import ResultFooter from "./ResultFooter";
import { useMatchingStore } from "@/stores/matching-store";
import { useRouter } from "next/navigation";
import { m, LazyMotion, AnimatePresence } from "motion/react";

// 애니메이션 엔진(domAnimation)을 비동기적으로 동적 임포트 (초기 번들 사이즈 최적화)
const loadFeatures = () =>
  import("motion/react").then((res) => res.domAnimation);

const ScreenMatchingResult = () => {
  const [isWaiting, setIsWaiting] = useState(true);
  const result = useMatchingStore((s) => s.result);
  const isMatching = useMatchingStore((s) => s.isMatching);
  const lastPayload = useMatchingStore((s) => s.lastPayload);
  const router = useRouter();

  // DEBUG: 매칭 결과 데이터 로그 출력
  useEffect(() => {
    if (result) {
      console.log("✅ [Matching Result Data]:", result);
    }
    if (lastPayload) {
      console.log("📝 [Matching Last Payload]:", lastPayload);
    }
  }, [result, lastPayload]);

  useEffect(() => {
    if (isMatching) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsWaiting(true);
    }
  }, [isMatching]);

  useEffect(() => {
    if (!result && !isMatching) {
      router.replace("/matching");
      return;
    }

    if (!isMatching) {
      const timer = setTimeout(() => {
        setIsWaiting(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [result, router, isMatching]);

  if (!result) return null;

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-10">
      <BackButton
        onClick={() => router.push("/matching")}
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
      <LazyMotion features={loadFeatures} strict>
        <AnimatePresence mode="wait">
          {isWaiting ? (
            <m.div
              key="waiting"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <WaitingFrame />
            </m.div>
          ) : (
            <m.div
              key="result"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="flex w-full flex-col"
            >
              {/* 카드 내부 콘텐츠만 blur → clear */}
              <m.div
                initial={{ filter: "blur(10px)" }}
                animate={{ filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <MatchingResult data={result} />
              </m.div>

              {/* 푸터도 blur → clear, 약간 딜레이 */}
              <m.div
                initial={{ filter: "blur(8px)", opacity: 0.3 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              >
                <ResultFooter lastPayload={lastPayload} />
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </main>
  );
};

export default ScreenMatchingResult;
