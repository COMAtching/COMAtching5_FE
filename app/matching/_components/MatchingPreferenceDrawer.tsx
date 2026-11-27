"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface Props {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  showHandle?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MatchingPreferenceDrawer({
  trigger,
  children,
  className,
  showHandle,
  onOpenChange,
}: Props) {
  const opener = useRef<HTMLButtonElement>(null);
  const pageTop = useRef(0);
  const [open, setOpen] = useState(false);
  return (
    <Drawer
      open={open}
      autoFocus
      noBodyStyles
      repositionInputs={false}
      onOpenChange={(nextOpen) => {
        // Capture before the modal mounts. Its iOS keyboard workaround scrolls to the top.
        if (nextOpen) pageTop.current = window.scrollY;
        setOpen(nextOpen);
        onOpenChange?.(nextOpen);
      }}
    >
      <DrawerTrigger asChild ref={opener}>
        {trigger}
      </DrawerTrigger>
      <DrawerContent
        data-matching-sheet=""
        showHandle={showHandle}
        className={cn(
          "overflow-hidden outline-none data-[vaul-drawer-direction=bottom]:max-h-[calc(100dvh-env(safe-area-inset-top)-12px)]",
          className,
        )}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          requestAnimationFrame(() => {
            if (
              !opener.current?.isConnected ||
              document.querySelector('[data-matching-sheet][data-state="open"]')
            )
              return;
            opener.current.focus({ preventScroll: true });
            window.scrollTo({ top: pageTop.current, behavior: "instant" });
          });
        }}
      >
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export function MatchingDrawerClose() {
  return (
    <DrawerClose
      type="button"
      data-vaul-no-drag=""
      className="typo-16-500 text-color-text-caption3 inline-flex min-h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center"
    >
      닫기
    </DrawerClose>
  );
}
