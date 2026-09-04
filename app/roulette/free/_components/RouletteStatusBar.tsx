import React from "react";

const RouletteStatusBar = () => {
  return (
    <div className="flex h-[62px] w-full items-center justify-between pt-[21px] pb-[19px]">
      <div className="flex w-[95px] items-center justify-center">
        <span className="text-color-text-black text-[17px] leading-[22px] font-[590]">
          9:41
        </span>
      </div>

      <div className="flex w-[95px] items-center justify-center gap-2.5">
        <div className="flex items-end gap-[2px]">
          <span className="bg-color-text-black h-[5px] w-[2px] rounded-[1px]" />
          <span className="bg-color-text-black h-[7px] w-[2px] rounded-[1px]" />
          <span className="bg-color-text-black h-[9px] w-[2px] rounded-[1px]" />
          <span className="bg-color-text-black h-[11px] w-[2px] rounded-[1px]" />
        </div>
        <div className="bg-color-text-black h-[12px] w-[17px] rounded-[999px]" />
        <div className="border-color-brand-black/35 relative h-[13px] w-[28px] rounded-[4px] border">
          <div className="bg-color-text-black absolute top-[2px] left-[2px] h-[9px] w-[21px] rounded-[2.5px]" />
          <div className="bg-color-text-black/40 absolute top-[4px] -right-[3px] h-[5px] w-[2px] rounded-r-[1px]" />
        </div>
      </div>
    </div>
  );
};

export default RouletteStatusBar;
