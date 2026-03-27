import React from "react";
import Button from "@/components/ui/Button";

interface NoticeSectionProps {
  title?: string;
  detail?: string;
  onClose?: () => void;
}

const NoticeSection = ({
  title = "매칭 안내문",
  detail = "현재 많은 수요로 인해 일부 유형에 이용자가 몰리는 현상이 일어나고 있습니다. 원하는 유형이 나오지 않을 수도 있으니 이 점 양해 부탁드립니다. 코매칭을 이용해 주셔서 감사합니다.",
  onClose,
}: NoticeSectionProps) => {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 rounded-[24px] border border-white/30 bg-white/50 p-6 shadow-[0_0_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      <div className="flex w-full flex-col items-center gap-4">
        <h3 className="typo-18-600 text-color-gray-900 flex items-center">
          {title}
        </h3>
        <p className="typo-14-400 text-color-gray-700 text-center leading-[130%] tracking-[-0.02em] whitespace-pre-wrap">
          {detail}
        </p>
      </div>

      <Button
        style={{
          background:
            "conic-gradient(from -36.07deg at 64.06% -102.34%, #E83ABC 0deg, rgba(255, 119, 94, 0.1) 0.04deg, rgba(255, 77, 97, 0.6) 169.2deg, #E83ABC 360deg)",
        }}
        className="typo-18-600 border-none text-white"
        shadow={true}
        onClick={onClose}
      >
        확인
      </Button>
    </section>
  );
};

export default NoticeSection;
