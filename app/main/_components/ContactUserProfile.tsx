import { Hobby, ProfileData } from "@/lib/types/profile";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ContactUserProfileProps {
  profiles: ProfileData[];
}

const ContactUserProfile = ({ profiles }: ContactUserProfileProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    };

    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const getContactFrequencyLabel = (freq?: string) => {
    switch (freq) {
      case "FREQUENT":
        return "자주";
      case "NORMAL":
        return "보통";
      case "RARE":
        return "드물게";
      default:
        return freq || "보통";
    }
  };

  const getHobbyLabel = (hobbies?: (Hobby | string)[]) => {
    if (!hobbies || hobbies.length === 0) return "없음";
    const hobby = hobbies[0];
    if (typeof hobby === "string") return hobby;
    return `${hobby.name}`;
  };

  if (!profiles || profiles.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center">
      {/* Profile Card Section */}
      <section className="flex w-full flex-col overflow-hidden rounded-[24px] border border-b-0 border-white/30 bg-white/50 backdrop-blur-[50px]">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto"
        >
          {profiles.map((profile, index) => (
            <div
              key={profile.memberId}
              className="flex w-full shrink-0 snap-center flex-col items-center justify-center gap-[12px] p-4"
            >
              {/* Upper Section: Profile and Name */}
              <div className="flex w-full items-center gap-4">
                {/* Profile Image Container */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/0 p-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
                  <div className="bg-color-gray-100 relative h-11 w-11 overflow-hidden rounded-full">
                    <Image
                      src={profile.profileImageUrl || "/default-profile.png"}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Name and Label */}
                <div className="flex flex-1 flex-col items-start gap-1">
                  <span className="typo-12-600 text-color-gray-500">
                    내가 뽑은 사람
                  </span>
                  <span className="typo-16-600 text-color-text-black">
                    {profile.nickname || "익명"}
                  </span>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex h-4 w-4 items-center justify-center"
                  >
                    <Image
                      src="/icons/send-message.svg"
                      alt="dm"
                      width={16}
                      height={16}
                    />
                  </button>
                  <button
                    type="button"
                    className="flex h-4 w-4 flex-col items-center justify-center gap-1"
                  >
                    <div className="bg-color-gray-800 h-[2.57px] w-[2.57px] rounded-full" />
                    <div className="bg-color-gray-800 h-[2.57px] w-[2.57px] rounded-full" />
                    <div className="bg-color-gray-800 h-[2.57px] w-[2.57px] rounded-full" />
                  </button>
                </div>
              </div>

              {/* Age and Major Section */}
              <div className="flex w-full items-start gap-2 pt-1">
                <div className="flex flex-col gap-1">
                  <span className="typo-12-600 text-color-gray-500">나이</span>
                  <span className="typo-14-600 text-color-text-black">
                    {profile.birthDate
                      ? new Date().getFullYear() -
                        new Date(profile.birthDate).getFullYear() +
                        1
                      : "?? "}
                  </span>
                </div>
                <div className="ml-8 flex flex-col gap-1">
                  <span className="typo-12-600 text-color-gray-500">전공</span>
                  <span className="typo-14-600 text-color-text-black">
                    {profile.major || "미지정"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="bg-color-gray-100 h-px w-full" />

              <div className="flex w-full flex-col">
                <div className="mb-2 flex items-center gap-1 text-[14px]">
                  <span className="typo-14-500 text-color-gray-500">
                    MBTI는
                  </span>
                  <span className="typo-14-600 border-color-gray-400 text-color-text-black border-b">
                    {profile.mbti}
                  </span>
                  <span className="typo-14-500 text-color-gray-500">
                    , 연락빈도는
                  </span>
                  <span className="typo-14-600 border-color-gray-400 text-color-text-black border-b">
                    {getContactFrequencyLabel(profile.contactFrequency)} ➡️
                  </span>
                  <span className="typo-14-500 text-color-gray-500">
                    이에요.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[14px]">
                  <span className="typo-14-500 text-color-gray-500">
                    저는 요즘
                  </span>
                  <span className="typo-14-600 border-color-gray-400 text-color-text-black border-b">
                    {getHobbyLabel(profile.hobbies)}
                  </span>
                  <span className="typo-14-500 text-color-gray-500">
                    을 좋아해요.
                  </span>
                </div>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "mt-4 grid-rows-[1fr] opacity-100"
                      : "mt-0 grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-4 overflow-hidden">
                    {/* Advantages Section */}
                    <div className="flex w-full flex-col gap-2">
                      <span className="typo-14-500 text-color-gray-500">
                        제 장점은요,
                      </span>
                      <div className="border-color-gray-400 flex w-full items-center justify-center border-b pb-1 text-center">
                        <span className="typo-14-600 text-color-text-black">
                          {profile.advantages?.[0] || "웃음이 많아요 😊"}
                        </span>
                      </div>
                    </div>

                    {/* Favorite Song Section */}
                    <div className="flex w-full flex-col gap-2">
                      <span className="typo-14-500 text-color-gray-500">
                        요즘 좋아하는 노래는,
                      </span>
                      <div className="flex w-full items-center justify-center gap-1">
                        <div className="border-color-gray-400 flex flex-1 items-center justify-center border-b pb-1 text-center">
                          <span className="typo-14-600 text-color-text-black truncate">
                            {profile.favoriteSong || "아직 없어요!"}
                          </span>
                        </div>
                        <span className="typo-14-500 text-color-gray-500 whitespace-nowrap">
                          입니다!
                        </span>
                      </div>
                    </div>

                    {/* Last Word Section */}
                    <div className="flex w-full flex-col gap-2">
                      <span className="typo-14-500 text-color-gray-500">
                        마지막 한마디는,
                      </span>
                      <div className="border-color-gray-400 flex w-full items-center justify-center border-b pb-1 text-center">
                        <span className="typo-14-600 text-color-text-black">
                          {profile.intro || "잘 부탁드립니다!! 😆"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Footer Section */}
        <footer
          style={{
            background:
              "linear-gradient(93.29deg, #FF775E 0.01%, #FF4D61 47.4%, #E83ABC 100%)",
          }}
          className="flex h-[42px] w-full items-center justify-between rounded-b-[24px] border border-t-0 border-white/30 px-4 backdrop-blur-[50px]"
        >
          <div className="flex items-center">
            {profiles[activeIndex]?.socialType === "KAKAO" ? (
              <div className="flex items-center gap-2">
                <Image
                  src="/sns/kakao-sns.svg"
                  alt="kakao"
                  width={16}
                  height={16}
                />
                <span className="typo-15-600 text-white">
                  {profiles[activeIndex]?.socialAccountId || "id_hidden"}
                </span>
              </div>
            ) : (
              <span className="typo-15-600 text-white">
                @{profiles[activeIndex]?.socialAccountId || "id_hidden"}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-[18px] items-center justify-center gap-1 rounded-full border border-white/30 bg-white/30 px-2 py-1 transition-all"
          >
            <span className="typo-10-600 text-white">
              {isExpanded ? "접기" : "펼치기"}
            </span>
            {isExpanded ? (
              <ChevronUp size={10} className="text-white" />
            ) : (
              <ChevronDown size={10} className="text-white" />
            )}
          </button>
        </footer>
      </section>

      {/* Indicator dots separated below the entire card */}
      {profiles.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {profiles.map((profile, i) => (
            <div
              key={`dot-${profile.memberId}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                i === activeIndex ? "bg-color-gray-800" : "bg-color-gray-100"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactUserProfile;
