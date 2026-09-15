"use client";

import React, { useEffect, useState } from "react";
import { Download, Share, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallCard() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // 1. 이미 설치되어 앱으로 실행 중인지 확인 (비동기 지연으로 cascading render 에러 방지)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone ===
          true;
      if (isStandaloneMode) setIsStandalone(true);
    };

    // 컴포넌트 마운트 후 아주 짧은 지연을 주어 동기적 setState로 인한 렌더링 충돌(Cascading renders) 방지
    const timerId = setTimeout(checkStandalone, 50);

    // 2. Android 등 설치 프롬프트 지원 브라우저 대비
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    if (isIosDevice) {
      // iOS는 설치 프롬프트 API가 없으므로 가이드 모달 띄우기
      setShowIOSModal(true);
    } else if (deferredPrompt) {
      // 안드로이드/데스크탑 Chrome은 저장해둔 프롬프트 호출
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsStandalone(true);
      }
    } else {
      // 프롬프트가 안 잡힌 경우 (일반 브라우저/PC 등)
      alert(
        "브라우저의 메뉴 옵션에서 '앱 설치' 또는 '홈 화면에 추가'를 이용해주세요.",
      );
    }
  };

  // 이미 설치된 상태라면 카드 숨김 (원하면 변경 가능)
  if (isStandalone) return null;

  return (
    <>
      <div
        onClick={handleInstallClick}
        className="from-color-brand-primary-flame/10 to-color-brand-primary-coral/10 flex cursor-pointer items-center justify-between rounded-3xl border border-white/30 bg-gradient-to-r p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[20px] transition-all hover:opacity-80 active:scale-95"
      >
        <div className="flex flex-col gap-1">
          <h3 className="typo-18-700 text-color-brand-primary-flame">
            코매칭 앱 다운로드
          </h3>
          <p className="typo-14-500 text-gray-600">
            홈 화면에 추가하고 더 편하게 접속하세요!
          </p>
        </div>
        <div className="bg-color-brand-primary-flame shadow-color-brand-primary-flame/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg">
          <Download size={20} />
        </div>
      </div>

      {/* iOS 가이드 모달 */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm transition-all">
          <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="typo-18-700 text-center text-gray-900">
              홈 화면에 추가하는 방법
            </h3>

            <div className="flex w-full flex-col gap-5 text-gray-700">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Share className="text-blue-500" size={20} />
                </div>
                <p className="typo-14-500 flex-1">
                  하단의 <span className="font-bold text-blue-500">공유</span>{" "}
                  아이콘을 누르세요.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <PlusSquare className="text-gray-900" size={20} />
                </div>
                <p className="typo-14-500 flex-1">
                  <span className="font-bold">홈 화면에 추가</span>를
                  선택하세요.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="typo-16-600 bg-color-brand-primary-flame mt-2 w-full rounded-2xl py-3.5 text-white transition-opacity hover:opacity-90"
            >
              확인했어요
            </button>
          </div>
        </div>
      )}
    </>
  );
}
