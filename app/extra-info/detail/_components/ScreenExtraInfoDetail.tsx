"use client";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import ProgressStepBar from "@/components/ui/ProgressStepBar";
import AdvantageDrawer from "./AdvantageDrawer";
import { cn } from "@/lib/utils";
import { useProfile } from "@/providers/profile-provider";
import { SocialType } from "@/lib/types/profile";
import { useRouter } from "next/navigation";

const ScreenExtraInfoDetail = () => {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  const [contactType, setContactType] = useState<"instagram" | "kakao" | null>(
    (profile.socialType?.toLowerCase() as "instagram" | "kakao") || null,
  );
  const [contactId, setContactId] = useState(profile.socialAccountId || "");
  const [favoriteSong, setFavoriteSong] = useState(profile.favoriteSong || ""); 
  const [advantages, setAdvantages] = useState<string[]>(profile.advantages || []);

  const contactOptions = [
    {
      key: "instagram",
      label: "인스타",
      img: "/sns/insta-sns.svg",
      unactiveImg: "/sns/unactive-insta.svg",
      placeholder: "인스타 아이디 (예: @coma_comatching)",
      inputId: "contact-instagram",
      inputName: "contactInstagram",
    },
    {
      key: "kakao",
      label: "카카오",
      img: "/sns/kakao-sns.svg",
      unactiveImg: "/sns/unactive-kakao.svg",
      placeholder: "카카오톡 아이디",
      inputId: "contact-kakao",
      inputName: "contactKakao",
    },
  ];

  const selectedOption = contactOptions.find((opt) => opt.key === contactType);

  const isContactValid =
    contactType === null
      ? true
      : contactType === "instagram"
        ? contactId.startsWith("@") && contactId.length > 1
        : contactId.trim().length > 0;

  const isValid = isContactValid;

  const handleNext = () => {
    updateProfile({
      socialType: contactType
        ? (contactType.toUpperCase() as SocialType)
        : undefined,
      socialAccountId: contactType ? contactId : undefined,
      advantages: advantages.length > 0 ? advantages : undefined,
      favoriteSong: favoriteSong.trim() || undefined,
    });
    router.push("/profile-image");
  };

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
                className={cn(
                  "flex h-[48px] min-w-0 flex-1 flex-col items-center justify-center rounded-[16px] border px-0 transition-colors",
                  contactType === opt.key
                    ? "border-gray-100 bg-[#FFFFFF]"
                    : "border-[#E8E8E8]",
                )}
                style={
                  contactType !== opt.key
                    ? {
                        background:
                          "linear-gradient(102deg, rgba(255,255,255,0.5) 9.36%, rgba(255,255,255,0.3) 95.75%)",
                      }
                    : undefined
                }
                onClick={() => {
                  if (contactType === opt.key) {
                    setContactType(null);
                    setContactId("");
                  } else {
                    setContactType(opt.key as "instagram" | "kakao");
                    setContactId("");
                  }
                }}
              >
                <span className="flex flex-row items-center justify-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <Image
                      src={contactType === opt.key ? opt.img : opt.unactiveImg}
                      alt={opt.label + " 아이콘"}
                      width={contactType === opt.key ? 24 : 12}
                      height={contactType === opt.key ? 24 : 12}
                    />
                  </div>
                  <span className="typo-16-600">{opt.label}</span>
                </span>
              </button>
            ))}
          </div>
          {contactType && selectedOption && (
            <FormInput
              id={selectedOption.inputId}
              name={selectedOption.inputName}
              type="text"
              placeholder={selectedOption.placeholder}
              className="typo-18-600 text-black"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            />
          )}
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
        onClick={handleNext}
      >
        다음으로
      </Button>
      <button
        type="button"
        onClick={() => {
          updateProfile({
            socialType: undefined,
            socialAccountId: undefined,
            advantages: undefined,
            favoriteSong: undefined,
          });
          router.push("/profile-image");
        }}
        className="typo-14-500 fixed left-1/2 z-50 -translate-x-1/2 whitespace-nowrap text-gray-500 transition-colors duration-300 hover:text-gray-800"
        style={{ bottom: "calc(40px + env(safe-area-inset-bottom))" }}
      >
        다음에 할게요
      </button>
    </main>
  );
};

export default ScreenExtraInfoDetail;
