import { ArrowUpToLine } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ImportantOption } from "@/lib/types/matching";
import { cn } from "@/lib/utils";
import MatchingOptionCard from "./MatchingOptionCard";

interface ImportantOptionDrawerProps {
  trigger: React.ReactNode;
  onSelect: (option: ImportantOption | null) => void;
  selectedOption?: ImportantOption | null;
  selections?: Record<ImportantOption, string>;
}

function TypingText({
  text,
  speed = 30,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = React.useState("");

  React.useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return <>{displayedText}</>;
}

export default function ImportantOptionDrawer({
  trigger,
  onSelect,
  selectedOption,
  selections = {
    MBTI: "",
    AGE: "",
    HOBBY: "",
    CONTACT: "",
  },
}: ImportantOptionDrawerProps) {
  const [dragState, setDragState] = React.useState<{
    option: ImportantOption | null;
    x: number;
    y: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    isOverZone: boolean;
  }>({
    option: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    isOverZone: false,
  });
  const [typingStep, setTypingStep] = React.useState(0);
  const isMounted = React.useRef(false);

  const dropZoneRef = React.useRef<HTMLDivElement>(null);

  const options: { label: string; value: ImportantOption }[] = [
    { label: "MBTI", value: "MBTI" },
    { label: "관심사", value: "HOBBY" },
    { label: "나이", value: "AGE" },
    { label: "연락빈도", value: "CONTACT" },
  ];

  const selectedItem = options.find((opt) => opt.value === selectedOption);
  const remainingOptions = options.filter(
    (opt) => opt.value !== selectedOption,
  );

  React.useEffect(() => {
    if (selectedOption) {
      if (!isMounted.current) {
        setTypingStep(2); // 이미 선택된 상태로 진입 시 완성된 상태로 시작
      } else {
        setTypingStep(1); // 드롭 등으로 새롭게 선택된 경우 애니메이션 시작
      }
    } else {
      setTypingStep(0);
    }
    isMounted.current = true;
  }, [selectedOption]);

  const handleStep1Complete = React.useCallback(() => {
    setTypingStep(2);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.option) return;

    const x = e.clientX;
    const y = e.clientY;

    let isOverZone = false;
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      isOverZone =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    setDragState((prev) => ({ ...prev, x, y, isOverZone }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.option) return;

    if (dragState.isOverZone) {
      onSelect(dragState.option);
    }

    setDragState({
      option: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0,
      isOverZone: false,
    });
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handlePointerDown = (e: React.PointerEvent, value: ImportantOption) => {
    const selection = selections[value];
    if (!selection || selection === "" || selection === "선택 전") {
      alert(
        `${options.find((o) => o.value === value)?.label} 옵션을 먼저 선택해 주세요!`,
      );
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragState({
      option: value,
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      offsetX,
      offsetY,
      isOverZone: false,
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className="h-[782px] pb-16 outline-none"
        showHandle={false}
      >
        <div className="relative flex h-full flex-col px-6 select-none">
          <DrawerHeader className="gap-4 px-0 pt-6 pb-0">
            <div className="relative flex items-center justify-between">
              <div className="w-[40px]" />
              <DrawerTitle className="typo-16-700 flex-1 text-center font-bold text-[#1A1A1A]">
                중요한 옵션 선택
              </DrawerTitle>
              <DrawerClose className="w-[40px] text-right text-[16px] leading-[19px] font-medium text-[#999999]">
                닫기
              </DrawerClose>
            </div>
            <p className="text-center text-[14px] leading-[17px] font-medium text-[#999999]">
              가장 중요하게 생각하는 옵션을 하나 선택하세요.
              <br />
              선택한 조건을 반드시 만족하는 사람만 추천해 줄 거에요!
            </p>
          </DrawerHeader>

          <div className="scrollbar-hide flex-1 touch-pan-y overflow-y-auto px-0 pb-4">
            <div
              ref={dropZoneRef}
              className={cn(
                "relative mt-6 mb-6 flex h-[166px] flex-col items-center rounded-2xl transition-all duration-200",
                !selectedOption ? "justify-center" : "justify-start pt-3",
                dragState.isOverZone ? "bg-black/10" : "bg-transparent",
              )}
            >
              {!selectedOption ? (
                <div className="pointer-events-none flex flex-col items-center gap-[12px]">
                  <ArrowUpToLine
                    className="h-6 w-6 text-[#B3B3B3]"
                    strokeWidth={2}
                  />
                  <span className="text-center text-[14px] leading-[17px] font-medium text-[#B3B3B3]">
                    중요한 옵션을 위에 올려놓으세요!
                  </span>
                </div>
              ) : (
                <div className="relative flex w-full flex-col items-end gap-1 pt-3">
                  {typingStep >= 1 && (
                    <div className="flex items-center justify-center rounded-t-[16px] rounded-br-[8px] rounded-bl-[16px] bg-gradient-to-r from-[#FF4D61] to-[#FF775E] px-3 py-[12px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
                      <span className="text-right text-[14px] leading-[130%] font-medium text-white">
                        <TypingText
                          key={selectedOption}
                          text="Comatching AI 야, 이 옵션은 꼭 지켜줘!"
                          onComplete={handleStep1Complete}
                        />
                      </span>
                    </div>
                  )}
                  {typingStep >= 2 && (
                    <div
                      className="mt-1 flex w-full items-center justify-center rounded-l-[16px] rounded-tr-[8px] rounded-br-[16px] px-4 py-[15px] shadow-[5px_5px_5px_rgba(0,0,0,0.25),0px_5px_20px_rgba(0,0,0,0.12)]"
                      style={{
                        background:
                          "conic-gradient(from 158.66deg at 64.06% -102.34%, #000000 0deg, #FF775E 0.04deg, #FF4D61 170.63deg, #E83ABC 360deg)",
                      }}
                    >
                      <span className="w-full text-right text-[18px] leading-[130%] font-semibold text-white">
                        <TypingText
                          key={selectedOption}
                          text={`${selectedItem?.label}는 ${selections[selectedOption]} 이면 좋겠어!`}
                        />
                      </span>
                    </div>
                  )}
                  {typingStep >= 2 && (
                    <button
                      onClick={() => onSelect(null)}
                      className="animate-in fade-in mx-auto mt-4 flex h-[26px] items-center justify-center rounded-[99px] bg-[#E5E5E5] px-3 py-[6px] text-[12px] font-bold text-[#808080] transition-colors duration-500 active:bg-gray-300"
                    >
                      선택 취소
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {remainingOptions.map((option) => (
                <MatchingOptionCard
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  isSelected={false}
                  selectionLabel={selections[option.value]}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                />
              ))}
            </div>
          </div>

          <div className="touch-pan-y">
            <DrawerClose asChild>
              <button className="flex h-[48px] w-full items-center justify-center rounded-[16px] border-[0.8px] border-white/30 bg-[#1A1A1A] text-[20px] font-bold text-white transition-transform active:scale-[0.98]">
                NEXT
              </button>
            </DrawerClose>
          </div>

          {/* Ghost Element (Dragging) */}
          {dragState.option &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="pointer-events-none fixed z-[9999]"
                style={{
                  left: dragState.x - dragState.offsetX,
                  top: dragState.y - dragState.offsetY,
                  transform: "scale(1.05)",
                  width: `${dragState.width}px`,
                }}
              >
                <div
                  className="flex w-full flex-col items-start justify-center gap-1 rounded-lg border-2 border-[#FF4D61] bg-white px-[17px] opacity-95 shadow-[0px_10px_30px_rgba(0,0,0,0.25)]"
                  style={{ height: `${dragState.height}px` }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-end gap-2">
                      <span className="typo-20-600 text-color-text-black font-bold">
                        {
                          options.find((o) => o.value === dragState.option)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <div className="h-[2px] w-4 rounded-[1px] bg-[#CCCCCC]" />
                      <div className="h-[2px] w-4 rounded-[1px] bg-[#CCCCCC]" />
                      <div className="h-[2px] w-4 rounded-[1px] bg-[#CCCCCC]" />
                    </div>
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
