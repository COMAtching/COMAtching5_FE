import { RotateCw } from "lucide-react";

const ChargeRequestWaiting = () => {
  return (
    <div className="flex h-[120px] w-full flex-col items-center justify-center gap-[11px] rounded-[24px] border border-white/30 bg-white/50 p-6 shadow-[0px_0px_8px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
      <div className="flex h-[72px] w-full items-center gap-4">
        {/* 커스텀 7도트 로더 영역 */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <div className="relative h-8 w-8 animate-spin">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 flex justify-center"
                style={{
                  transform: `rotate(${i * (360 / 7)}deg)`,
                }}
              >
                <div
                  className="h-2 w-1 rounded-full bg-[#FCCD00]"
                  style={{
                    opacity: 1 - i * 0.12,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 텍스트 영역 (Frame 2612794) */}
        <div className="flex flex-1 flex-col items-start gap-2">
          {/* 타이틀 행 (Frame 2612797) */}
          <div className="flex w-full items-center justify-between gap-[10px]">
            <span className="typo-20-600 text-color-text-black leading-6">
              대기중
            </span>
            {/* ArrowClockwise #9E9E9E 반영 */}
            <RotateCw className="h-4 w-4 text-[#9E9E9E]" />
          </div>

          {/* 설명 문구 */}
          <p className="typo-14-500 text-color-gray-700 leading-[140%] tracking-[-0.03em]">
            관리자가 입금 내역을 확인하고 있어요.
            <br />
            3분 이내로 완료되니 잠시만 기다려 주세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChargeRequestWaiting;
