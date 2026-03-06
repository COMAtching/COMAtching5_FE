"use client";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import ProgressStepBar from "@/components/ui/ProgressStepBar";
import AdvantageDrawer from "./AdvantageDrawer";

const ScreenExtraInfoDetail = () => {
  const [contactType, setContactType] = useState<"instagram" | "kakao">(
    "instagram",
  );
  const [contactId, setContactId] = useState("");
  const [favoriteSong, setFavoriteSong] = useState("");
  const [advantages, setAdvantages] = useState<string[]>([]);
  const contactOptions = [
    {
      key: "instagram",
      label: "인스타",
      img: "/sns/insta-sns.svg",
      placeholder: "인스타 아이디 (예: @winterizcoming_)",
      inputId: "contact-instagram",
      inputName: "contactInstagram",
    },
    {
      key: "kakao",
      label: "카카오",
      img: "/sns/kakao-sns.svg",
      placeholder: "카카오톡 아이디",
      inputId: "contact-kakao",
      inputName: "contactKakao",
    },
  ];

  const selectedOption = contactOptions.find((opt) => opt.key === contactType)!;

  const isContactValid =
    contactType === "instagram"
      ? contactId.startsWith("@") && contactId.length > 1
      : contactId.trim().length > 0;

  const isValid =
    advantages.length === 5 && isContactValid && favoriteSong.trim().length > 0;

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden px-4 pb-[120px]">
      <ProgressStepBar currentStep={3} totalSteps={3} />
      <div className="my-6 flex flex-col gap-2 text-center">
        <h1 className="typo-20-700 text-[#373737]">추가정보 입력</h1>
        <p className="typo-14-500 leading-[1.6] text-[#858585]">
          코매칭에서 사용할 정보를 입력해 주세요.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 장점 안내 및 > 아이콘 */}
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col">
            <label className="typo-16-600 text-black">제 장점은요...</label>
            <p className="typo-14-500 flex h-[32px] items-center text-gray-400">
              내가 생각하는 나의 장점을 골라주세요
            </p>
          </div>
          <AdvantageDrawer
            selectedAdvantages={advantages}
            onComplete={(newAdvantages) => setAdvantages(newAdvantages)}
          >
            <button
              aria-label="장점 선택 열기"
              type="button"
              className="flex items-center justify-center p-1"
            >
              <ChevronRight className="text-gray-400" size={24} />
            </button>
          </AdvantageDrawer>
        </div>
        {advantages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {advantages.map((adv) => (
              <span
                key={adv}
                className="typo-14-500 rounded-full bg-[#FFEBED] px-3 py-[7.5px] text-[#FF4D61]"
              >
                {adv}
              </span>
            ))}
          </div>
        )}

        {/* 연락 수단 */}
        <div className="flex flex-col gap-3">
          <label className="typo-16-600 text-black">연락 수단</label>
          <div className="mb-2 flex w-full flex-row gap-2">
            {contactOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`flex h-[48px] min-w-0 flex-1 flex-col items-center justify-center rounded-[16px] border px-0 transition-colors ${contactType === opt.key ? "border-gray-100 bg-[#FFFFFF]" : "border-[#E8E8E8]"}`}
                style={
                  contactType === opt.key
                    ? { height: 48 }
                    : {
                        background:
                          "linear-gradient(102deg, rgba(255,255,255,0.5) 9.36%, rgba(255,255,255,0.3) 95.75%)",
                        borderRadius: 16,
                        border: "1px solid #E8E8E8",
                        height: 48,
                      }
                }
                onClick={() => {
                  setContactType(opt.key as typeof contactType);
                  setContactId(""); // 타입 변경 시 입력값 초기화
                }}
              >
                <span className="flex flex-row items-center justify-center gap-2">
                  <Image
                    src={opt.img}
                    alt={opt.label + " 아이콘"}
                    width={24}
                    height={24}
                  />
                  <span className="typo-14-600">{opt.label}</span>
                </span>
              </button>
            ))}
          </div>
          <FormInput
            id={selectedOption.inputId}
            name={selectedOption.inputName}
            type="text"
            placeholder={selectedOption.placeholder}
            className="typo-18-600 text-black"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
          />
        </div>

        {/* 좋아하는 노래 */}
        <div className="flex flex-col gap-2">
          <label className="typo-16-600 text-black" htmlFor="favoriteSong">
            좋아하는 노래
          </label>
          <FormInput
            id="favoriteSong"
            name="favoriteSong"
            type="text"
            placeholder="예: 이찬혁 - 멸종위기사랑"
            className="typo-18-600 text-black"
            value={favoriteSong}
            onChange={(e) => setFavoriteSong(e.target.value)}
          />
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <Button
        type="button"
        fixed
        bottom={100}
        sideGap={16}
        safeArea
        disabled={!isValid}
      >
        다음으로
      </Button>
      <Button
        type="button"
        fixed
        bottom={40}
        shadow={false}
        safeArea
        className="typo-14-500 border-none bg-transparent text-gray-500"
        // TODO: onClick 핸들러 필요시 추가
      >
        다음에 할게요
      </Button>
    </main>
  );
};

export default ScreenExtraInfoDetail;
