import { Info } from "lucide-react";
import React from "react";

const RouletteParticipationInfo = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Info className="text-color-text-caption3" size={12} strokeWidth={2.5} />
      <span className="typo-14-500 text-color-text-caption3">
        참여 가능 횟수는 매일 1회예요.
      </span>
    </div>
  );
};

export default RouletteParticipationInfo;
