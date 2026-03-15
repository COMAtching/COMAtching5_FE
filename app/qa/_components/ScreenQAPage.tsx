"use client";
import React from "react";
import { BackButton } from "@/components/ui/BackButton";
import { QA_LIST } from "@/lib/constants/qa";

const ScreenQAPage = () => {
  return (
    <div className="flex min-h-screen flex-col px-4 pb-10">
      <header className="py-4">
        <BackButton text="QA" />
      </header>

      <main className="mt-4 flex flex-col gap-4">
        {QA_LIST.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-[24px] border border-white/30 bg-white/40 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[20px]"
          >
            <div className="flex gap-2">
              <span className="typo-18-700 text-color-brand-primary-flame">
                Q.
              </span>
              <h3 className="typo-18-700 text-gray-900">{item.question}</h3>
            </div>
            <div className="flex gap-2 border-t border-gray-200/30 pt-3">
              <span className="typo-16-600 text-gray-500">A.</span>
              <p className="typo-16-500 leading-relaxed whitespace-pre-wrap text-gray-700">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-10 px-4 text-center">
        <p className="typo-14-400 text-gray-400">
          더 궁금한 점이 있으신가요?
          <br />
          인스타그램{" "}
          <span className="text-color-brand-primary-flame font-semibold">
            @cuk_coma
          </span>
          로 문의주세요!
        </p>
      </footer>
    </div>
  );
};

export default ScreenQAPage;
