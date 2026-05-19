import Link from "next/link";
import { useParticipantsCount } from "@/hooks/useParticipantsCount";
import { alertIfBlocked } from "@/lib/constants/date";

const MatchingButton = () => {
  const { data: participantsCount } = useParticipantsCount();

  const handleMatchingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (alertIfBlocked()) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href="/matching"
      prefetch={true}
      onClick={handleMatchingClick}
      style={{
        background:
          "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #E83ABC 0%, #FF775E 100%) border-box",
      }}
      className="flex h-[13.11vh] w-full flex-col items-center justify-center gap-1 rounded-[24px] border border-transparent backdrop-blur-[50px]"
    >
      <div className="flex items-center gap-2">
        <span className="typo-24-600 text-gray-900">AI 매칭하기</span>
        <div
          className="h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-[#1A1A1A]"
          aria-hidden="true"
        />
      </div>
      <span className="typo-16-500 text-gray-400">
        현재{" "}
        <span className="text-color-flame-700">
          {participantsCount?.data?.count ?? 0}명
        </span>{" "}
        참여중이에요!
      </span>
    </Link>
  );
};

const SearchMyListButton = () => {
  return (
    <Link
      href="/matching-list"
      prefetch={true}
      style={{
        background:
          "radial-gradient(100% 99.65% at 0% -4.11%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)",
      }}
      className="flex h-[56px] flex-1 items-center justify-center rounded-[16px] border-[1.5px] border-white/30 shadow-[0_0_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]"
    >
      <div className="flex items-center gap-3">
        <span className="typo-18-600 text-color-gray-700">🔍</span>
        <span className="typo-18-600 text-color-gray-900">조회하기</span>
      </div>
    </Link>
  );
};

const QAButton = () => {
  const handleQAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (alertIfBlocked()) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href="/FAQ"
      prefetch={true}
      onClick={handleQAClick}
      style={{
        background:
          "radial-gradient(100% 99.65% at 0% -4.11%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)",
      }}
      className="flex h-[56px] flex-1 items-center justify-center rounded-[16px] border-[1.5px] border-white/30 shadow-[0_0_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]"
    >
      <div className="flex items-center gap-3">
        <span className="typo-18-600 text-color-gray-700">📖</span>
        <span className="typo-18-600 text-color-gray-900">FAQ</span>
      </div>
    </Link>
  );
};

export { MatchingButton, SearchMyListButton, QAButton };
