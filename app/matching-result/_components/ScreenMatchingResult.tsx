"use client";
import { useEffect } from "react";
import MatchingSearchLoader from "@/components/ui/MatchingSearchLoader";
import Image from "next/image";
import MatchingResult from "./MatchingResult";
import ResultFooter from "./ResultFooter";
import { useMatchingStore } from "@/stores/matching-store";
import { useRouter } from "next/navigation";
import { m, LazyMotion } from "motion/react";
import { useFeature } from "@/stores/features";

// 애니메이션 엔진(domAnimation)을 비동기적으로 동적 임포트 (초기 번들 사이즈 최적화)
const loadFeatures = () =>
  import("motion/react").then((res) => res.domAnimation);

const ScreenMatchingResult = () => {
  const result = useMatchingStore((s) => s.result);
  const isMatching = useMatchingStore((s) => s.isMatching);
  const lastPayload = useMatchingStore((s) => s.lastPayload);
  const router = useRouter();
  const matchingClosed = !useFeature("MATCHING")?.open;

  useEffect(() => {
    if (!result && !isMatching)
      router.replace(matchingClosed ? "/main" : "/matching");
  }, [result, router, isMatching, matchingClosed]);

  if (isMatching) return <MatchingSearchLoader />;
  if (!result) return null;

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-2 pb-10">
      <h1 className="flex h-12 w-full items-center justify-center gap-1.5">
        <Image
          src="/logo/comatching-logo.svg"
          alt="Comatching"
          width={96}
          height={16}
          priority
        />
        <span className="typo-18-700 text-color-text-black">매칭 결과</span>
      </h1>
      <LazyMotion features={loadFeatures} strict>
        <div className="flex w-full flex-col">
          {/* 카드 내부 콘텐츠 페이드 인 */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <MatchingResult data={result} />
          </m.div>

          {/* 푸터 페이드 인, 약간 딜레이 */}
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <ResultFooter lastPayload={lastPayload} />
          </m.div>
        </div>
      </LazyMotion>
    </main>
  );
};

export default ScreenMatchingResult;
