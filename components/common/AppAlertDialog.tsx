"use client";

import { useRef } from "react";
import { useStore } from "zustand";
import { AlertDialog } from "radix-ui";
import { acknowledgeAppAlert, appAlerts } from "@/lib/app-alert";

export default function AppAlertDialog() {
  const alert = useStore(appAlerts, (queue) => queue[0]);
  const confirm = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <AlertDialog.Root open={!!alert}>
      {alert && (
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[10000] bg-black/35" />
          <AlertDialog.Content
            className="fixed top-1/2 left-1/2 z-[10001] grid max-h-[80dvh] w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl outline-none"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              returnFocus.current =
                document.activeElement instanceof HTMLElement
                  ? document.activeElement
                  : null;
              confirm.current?.focus({ preventScroll: true });
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (returnFocus.current?.isConnected)
                returnFocus.current.focus({ preventScroll: true });
            }}
            onEscapeKeyDown={(event) => {
              event.preventDefault();
              acknowledgeAppAlert(alert);
            }}
          >
            <AlertDialog.Title className="typo-20-700 text-color-text-black">
              코매칭 알림
            </AlertDialog.Title>
            <AlertDialog.Description className="typo-16-500 text-color-gray-700 break-words whitespace-pre-line">
              {alert.message}
            </AlertDialog.Description>
            <button
              type="button"
              ref={confirm}
              onClick={() => acknowledgeAppAlert(alert)}
              className="typo-16-600 bg-color-brand-primary-flame mt-2 min-h-12 rounded-2xl text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              확인
            </button>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      )}
    </AlertDialog.Root>
  );
}
